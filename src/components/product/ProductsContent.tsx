'use client'

import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useProductFilters, PAGE_SIZE } from '@/hooks/useProductFilters'
import { applyProductFilters, paginateProducts, getUniqueMaterials, getUniqueColors, getUniqueSizes } from '@/utils/applyProductFilters'
import { ProductSortSelect } from './ProductSortSelect'
import { ProductFilter } from './ProductFilter'
import { ProductGrid } from './ProductGrid'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export function ProductsContent() {
    const { data: products = [], isLoading, error } = useProducts()
    const { data: categories = [] } = useCategories()
    const { filters, updateFilter, updateFilters, resetFilters, hasActiveFilters } = useProductFilters()

    const filtered = useMemo(() => applyProductFilters(products, filters), [products, filters])
    const { items: currentProducts, totalPages, currentPage } = useMemo(
        () => paginateProducts(filtered, filters.page, PAGE_SIZE),
        [filtered, filters.page],
    )

    const materials = useMemo(() => getUniqueMaterials(products), [products])
    const colors = useMemo(() => getUniqueColors(products), [products])
    const sizes = useMemo(() => getUniqueSizes(products), [products])

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <section className="py-16 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto">
                    <h1 className="font-serif text-5xl md:text-6xl mb-4 text-balance">All Products</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                        Explore premium fashion collections for modern women
                    </p>
                </div>
            </section>

            {/* Toolbar */}
            <section className="py-4 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Category tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => updateFilter('categoryId', '')}
                            className={`shrink-0 px-4 py-1.5 text-sm transition-colors border ${
                                filters.categoryId === ''
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => updateFilter('categoryId', cat.id)}
                                className={`shrink-0 px-4 py-1.5 text-sm transition-colors border ${
                                    filters.categoryId === cat.id
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="shrink-0">
                        <ProductSortSelect
                            value={filters.sort}
                            onChange={v => updateFilter('sort', v)}
                        />
                    </div>
                </div>
            </section>

            {/* Products Grid + Filter Sidebar */}
            <section className="py-16 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="flex gap-10 items-start">

                        {/* Sidebar filter */}
                        <aside className="hidden lg:block w-56 shrink-0 sticky top-28">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-6">Filters</h2>
                            <ProductFilter
                                filters={filters}
                                materials={materials}
                                colors={colors}
                                sizes={sizes}
                                onUpdate={updateFilters}
                                onReset={resetFilters}
                                hasActiveFilters={hasActiveFilters}
                            />
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Product count */}
                            <p className="text-sm text-muted-foreground mb-8">
                                {isLoading ? 'Loading...' : `${filtered.length} products`}
                            </p>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    title="Unable to load products"
                                    description="Please try again later"
                                />
                            ) : currentProducts.length === 0 ? (
                                <EmptyState
                                    title="No products found"
                                    description={
                                        hasActiveFilters
                                            ? 'Try changing or clearing filters to see more products'
                                            : 'There are no products yet'
                                    }
                                    action={
                                        hasActiveFilters ? (
                                            <Button variant="outline" size="sm" onClick={resetFilters}>
                                                Clear filters
                                            </Button>
                                        ) : undefined
                                    }
                                />
                            ) : (
                                <ProductGrid products={currentProducts} />
                            )}

                            {/* Pagination */}
                            {!isLoading && totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <Button
                                        variant="outline"
                                        onClick={() => updateFilter('page', currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <Button
                                                key={p}
                                                variant={p === currentPage ? 'default' : 'outline'}
                                                onClick={() => updateFilter('page', p)}
                                                className="w-10"
                                            >
                                                {p}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => updateFilter('page', currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
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
