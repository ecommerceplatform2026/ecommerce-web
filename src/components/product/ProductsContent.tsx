'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useProductFilters, PAGE_SIZE } from '@/hooks/useProductFilters'
import { applyProductFilters, paginateProducts, getUniqueMaterials } from '@/utils/applyProductFilters'
import { CategoryList } from './CategoryList'
import { ProductFilter } from './ProductFilter'
import { ProductSortSelect } from './ProductSortSelect'
import { ProductGrid } from './ProductGrid'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export function ProductsContent() {
    const { data: products = [], isLoading, error } = useProducts()
    const { data: categories = [] } = useCategories()
    const { filters, updateFilter, updateFilters, resetFilters, hasActiveFilters } = useProductFilters()

    const [searchInput, setSearchInput] = useState(filters.search)
    const [filterOpen, setFilterOpen] = useState(false)

    const updateFilterRef = useRef(updateFilter)
    const filtersSearchRef = useRef(filters.search)
    useEffect(() => { updateFilterRef.current = updateFilter }, [updateFilter])
    useEffect(() => { filtersSearchRef.current = filters.search }, [filters.search])

    // Sync local search input when URL-driven reset changes filters.search
    useEffect(() => {
        if (filters.search !== searchInput) setSearchInput(filters.search)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search])

    // Debounce local search input to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = searchInput.trim()
            if (trimmed !== filtersSearchRef.current) {
                updateFilterRef.current('search', trimmed)
            }
        }, 400)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput])

    const materials = useMemo(() => getUniqueMaterials(products), [products])
    const filtered = useMemo(() => applyProductFilters(products, filters), [products, filters])
    const { items: currentProducts, totalPages, currentPage } = useMemo(
        () => paginateProducts(filtered, filters.page, PAGE_SIZE),
        [filtered, filters.page],
    )

    const activeFilterCount = [
        filters.categoryId,
        filters.minPrice !== null,
        filters.maxPrice !== null,
        filters.material,
        filters.sort,
    ].filter(Boolean).length

    return (
        <main className="min-h-screen">
            <section className="py-16 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto">
                    <h1 className="font-serif text-5xl md:text-6xl mb-4">Tất Cả Sản Phẩm</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Khám phá bộ sưu tập đầy đủ thời trang cao cấp dành cho quý ông hiện đại
                    </p>
                </div>
            </section>

            <section className="py-4 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label="Xoá tìm kiếm"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden flex-1 sm:flex-none"
                            onClick={() => setFilterOpen(!filterOpen)}
                            aria-expanded={filterOpen}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Bộ lọc{hasActiveFilters ? ` (${activeFilterCount})` : ''}
                        </Button>
                        <ProductSortSelect
                            value={filters.sort}
                            onChange={v => updateFilter('sort', v)}
                        />
                    </div>
                </div>
            </section>

            {categories.length > 0 && (
                <section className="py-4 px-4 lg:px-8 border-b border-border">
                    <div className="container mx-auto">
                        <CategoryList
                            categories={categories}
                            selectedCategoryId={filters.categoryId}
                            onSelect={id => updateFilter('categoryId', id)}
                        />
                    </div>
                </section>
            )}

            {filterOpen && (
                <section className="md:hidden px-4 py-4 border-b border-border bg-muted/30">
                    <div className="container mx-auto">
                        <ProductFilter
                            filters={filters}
                            materials={materials}
                            onUpdate={updateFilters}
                            onReset={resetFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    </div>
                </section>
            )}

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex gap-8">
                    <aside className="hidden md:block w-56 shrink-0">
                        <div className="sticky top-4">
                            <h2 className="font-semibold mb-4">Bộ lọc</h2>
                            <ProductFilter
                                filters={filters}
                                materials={materials}
                                onUpdate={updateFilters}
                                onReset={resetFilters}
                                hasActiveFilters={hasActiveFilters}
                            />
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-6">
                            {isLoading ? 'Đang tải...' : `${filtered.length} sản phẩm`}
                        </p>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="aspect-[3/4] w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <EmptyState
                                title="Không thể tải sản phẩm"
                                description="Vui lòng thử lại sau"
                            />
                        ) : currentProducts.length === 0 ? (
                            <EmptyState
                                title="Không tìm thấy sản phẩm"
                                description={
                                    hasActiveFilters
                                        ? 'Thử thay đổi hoặc xoá bộ lọc để xem thêm sản phẩm'
                                        : 'Hiện chưa có sản phẩm nào'
                                }
                                action={
                                    hasActiveFilters ? (
                                        <Button variant="outline" size="sm" onClick={resetFilters}>
                                            Xoá bộ lọc
                                        </Button>
                                    ) : undefined
                                }
                            />
                        ) : (
                            <ProductGrid products={currentProducts} />
                        )}

                        {!isLoading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-1.5 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFilter('page', currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Button
                                        key={p}
                                        variant={p === currentPage ? 'default' : 'outline'}
                                        size="icon-sm"
                                        onClick={() => updateFilter('page', p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFilter('page', currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
