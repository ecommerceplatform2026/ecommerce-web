'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useProductFacetProducts, useProductSearch } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useProductFilters, PAGE_SIZE } from '@/hooks/useProductFilters'
import { getUniqueMaterials, getUniqueColors, getUniqueSizes } from '@/utils/applyProductFilters'
import { ProductSortSelect } from './ProductSortSelect'
import { ProductFilter } from './ProductFilter'
import { ProductGrid } from './ProductGrid'
import { CategoryList } from './CategoryList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

function ProductSearchInput({
    value,
    onSearch,
}: {
    value: string
    onSearch: (value: string) => void
}) {
    const [searchInput, setSearchInput] = useState(value)

    useEffect(() => {
        const nextSearch = searchInput.trim()
        if (nextSearch === value) return

        const timeoutId = setTimeout(() => {
            onSearch(nextSearch)
        }, 400)

        return () => clearTimeout(timeoutId)
    }, [onSearch, searchInput, value])

    return (
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="h-10 pl-10"
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
            />
        </div>
    )
}

export function ProductsContent() {
    const { data: categories = [] } = useCategories()
    const { filters, updateFilter, updateFilters, resetFilters, hasActiveFilters } = useProductFilters()
    const { data, isLoading, error } = useProductSearch(filters, PAGE_SIZE)
    const { data: facetProducts = [] } = useProductFacetProducts()

    const currentProducts = useMemo(() => data?.items ?? [], [data?.items])
    const totalCount = data?.totalCount ?? 0
    const totalPages = data?.totalPages ?? 0
    const currentPage = data?.page ?? filters.page

    const facetById = useMemo(
        () => new Map(facetProducts.map(product => [product.id, product])),
        [facetProducts],
    )

    const displayProducts = useMemo(
        () => currentProducts.map(product => {
            if (product.variants?.length > 0) return product

            const enriched = facetById.get(product.id)
            return enriched ? { ...product, variants: enriched.variants } : product
        }),
        [currentProducts, facetById],
    )

    const materials = useMemo(() => getUniqueMaterials(facetProducts), [facetProducts])
    const colors = useMemo(() => getUniqueColors(facetProducts), [facetProducts])
    const sizes = useMemo(() => getUniqueSizes(facetProducts), [facetProducts])

    const filterPanel = (
        <ProductFilter
            key={`${filters.minPrice ?? ''}:${filters.maxPrice ?? ''}`}
            filters={filters}
            materials={materials}
            colors={colors}
            sizes={sizes}
            onUpdate={updateFilters}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
        />
    )

    return (
        <main className="min-h-screen">
            <section className="border-b border-border px-4 py-16 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="mb-4 text-balance font-serif text-5xl md:text-6xl">Tất cả sản phẩm</h1>
                    <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
                        Khám phá bộ sưu tập thời trang cao cấp dành cho phụ nữ hiện đại
                    </p>
                </div>
            </section>

            <section className="border-b border-border px-4 py-4 lg:px-8">
                <div className="container mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CategoryList
                        categories={categories}
                        selectedCategoryId={filters.categoryId}
                        onSelect={categoryId => updateFilter('categoryId', categoryId)}
                        className="w-full sm:w-64"
                    />

                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                        <ProductSearchInput
                            key={filters.search}
                            value={filters.search}
                            onSearch={value => updateFilter('search', value)}
                        />
                        <ProductSortSelect
                            value={filters.sort}
                            onChange={value => updateFilter('sort', value)}
                        />
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 lg:px-8">
                <div className="container mx-auto">
                    <div className="flex items-start gap-10">
                        <aside className="sticky top-28 hidden w-56 shrink-0 lg:block">
                            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide">Bộ lọc</h2>
                            {filterPanel}
                        </aside>

                        <div className="min-w-0 flex-1">
                            <details className="mb-8 rounded-md border border-border p-4 lg:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wide [&::-webkit-details-marker]:hidden">
                                    <span>Bộ lọc</span>
                                    <SlidersHorizontal className="h-4 w-4" />
                                </summary>
                                <div className="mt-6">{filterPanel}</div>
                            </details>

                            <p className="mb-8 text-sm text-muted-foreground">
                                {isLoading ? 'Đang tải...' : `${totalCount} sản phẩm`}
                            </p>

                            {isLoading ? (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <div key={index} className="space-y-3">
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
                            ) : displayProducts.length === 0 ? (
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
                                <ProductGrid products={displayProducts} />
                            )}

                            {!isLoading && totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => updateFilter('page', currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </Button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? 'default' : 'outline'}
                                                onClick={() => updateFilter('page', page)}
                                                className="w-10"
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
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
            </section>
        </main>
    )
}
