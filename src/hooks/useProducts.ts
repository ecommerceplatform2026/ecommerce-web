import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { ProductSortBy } from '@/constants/enums'
import type { ProductSearchParams } from '@/types/product'
import type { ProductFilters } from '@/hooks/useProductFilters'

export const productKeys = {
    all:    ['products']                        as const,
    search: (params: ProductSearchParams) => ['products', 'search', params] as const,
    detail: (id: string) => ['products', id] as const,
}

export function useProducts() {
    return useQuery({
        queryKey: productKeys.all,
        queryFn:  productService.getAll,
    })
}

function mapSort(sort: ProductFilters['sort']): Pick<ProductSearchParams, 'sortBy' | 'sortDirection'> {
    if (sort === ProductSortBy.PriceAsc) {
        return { sortBy: 'price', sortDirection: 'asc' }
    }

    if (sort === ProductSortBy.PriceDesc) {
        return { sortBy: 'price', sortDirection: 'desc' }
    }

    if (sort === ProductSortBy.Newest || sort === '') {
        return { sortBy: 'createdAt', sortDirection: 'desc' }
    }

    return { sortBy: sort, sortDirection: 'desc' }
}

export function toProductSearchParams(filters: ProductFilters, pageSize: number): ProductSearchParams {
    return {
        search: filters.search,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        material: filters.material,
        color: filters.color,
        size: filters.size,
        page: filters.page,
        pageSize,
        ...mapSort(filters.sort),
    }
}

export function useProductSearch(filters: ProductFilters, pageSize: number) {
    const params = toProductSearchParams(filters, pageSize)

    return useQuery({
        queryKey: productKeys.search(params),
        queryFn: () => productService.search(params),
    })
}

export function useProductFacetProducts() {
    return useQuery({
        queryKey: productKeys.all,
        queryFn: productService.getAll,
    })
}

export function useProductDetail(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getDetail(id),
        enabled: !!id,
    })
}
