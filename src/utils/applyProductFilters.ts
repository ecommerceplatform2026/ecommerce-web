import { ProductSortBy, ProductStatus } from '@/constants/enums'
import type { Product } from '@/types/product'
import type { ProductFilters } from '@/hooks/useProductFilters'

export function applyProductFilters(products: Product[], filters: ProductFilters): Product[] {
    let result = products.filter(p => p.status === ProductStatus.Active)

    if (filters.search.trim()) {
        const term = filters.search.trim().toLowerCase()
        result = result.filter(
            p =>
                p.name.toLowerCase().includes(term) ||
                (p.description?.toLowerCase().includes(term) ?? false) ||
                (p.categoryName?.toLowerCase().includes(term) ?? false),
        )
    }

    if (filters.categoryId) {
        result = result.filter(p => p.categoryId === filters.categoryId)
    }

    if (filters.minPrice !== null) {
        result = result.filter(p => p.basePrice >= (filters.minPrice as number))
    }

    if (filters.maxPrice !== null) {
        result = result.filter(p => p.basePrice <= (filters.maxPrice as number))
    }

    if (filters.material) {
        const mat = filters.material.toLowerCase()
        result = result.filter(p => p.material?.toLowerCase() === mat)
    }

    if (filters.color) {
        const col = filters.color.toLowerCase()
        result = result.filter(p => p.variants.some(v => v.color?.toLowerCase() === col))
    }

    if (filters.size) {
        const sz = filters.size.toLowerCase()
        result = result.filter(p => p.variants.some(v => v.size?.toLowerCase() === sz))
    }

    if (filters.sort === ProductSortBy.PriceAsc) {
        result = [...result].sort((a, b) => a.basePrice - b.basePrice)
    } else if (filters.sort === ProductSortBy.PriceDesc) {
        result = [...result].sort((a, b) => b.basePrice - a.basePrice)
    }
    // Newest and default: preserve server order

    return result
}

export function paginateProducts<T>(
    items: T[],
    page: number,
    pageSize: number,
): {
    items: T[]
    totalCount: number
    totalPages: number
    currentPage: number
} {
    const totalCount = items.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const currentPage = Math.min(Math.max(page, 1), totalPages)
    const start = (currentPage - 1) * pageSize
    return {
        items: items.slice(start, start + pageSize),
        totalCount,
        totalPages,
        currentPage,
    }
}

export function getUniqueMaterials(products: Product[]): string[] {
    const active = products.filter(p => p.status === ProductStatus.Active)
    const seen = new Set<string>()
    for (const p of active) {
        if (p.material) seen.add(p.material)
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b))
}

export function getUniqueColors(products: Product[]): string[] {
    const seen = new Set<string>()
    for (const p of products.filter(p => p.status === ProductStatus.Active)) {
        for (const v of p.variants) {
            if (v.color) seen.add(v.color)
        }
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b))
}

export function getUniqueSizes(products: Product[]): string[] {
    const seen = new Set<string>()
    for (const p of products.filter(p => p.status === ProductStatus.Active)) {
        for (const v of p.variants) {
            if (v.size) seen.add(v.size)
        }
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b))
}
