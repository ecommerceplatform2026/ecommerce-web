import { useQuery } from '@tanstack/react-query'
import { ProductSortBy } from '@/constants/enums'
import { productService } from '@/services/productService'
import type { ProductFilters } from '@/hooks/useProductFilters'
import type { ProductSearchParams } from '@/types/product'

export const productKeys = {
    all: ['products'] as const,
    adminAll: ['products', 'admin'] as const,
    search: (params: ProductSearchParams) => ['products', 'search', params] as const,
    summary: (id: string) => ['products', 'summary', id] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    images: (id: string) => ['products', id, 'images'] as const,
    variants: (id: string) => ['products', id, 'variants'] as const,
}

export function useProducts() {
    return useQuery({
        queryKey: productKeys.all,
        queryFn: productService.getAll,
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.summary(id),
        queryFn: () => productService.getById(id),
        enabled: !!id,
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

export function useAdminProducts() {
    return useQuery({
        queryKey: productKeys.adminAll,
        queryFn: productService.getAdminAll,
    })
}

export function useProductImages(productId: string) {
    return useQuery({
        queryKey: productKeys.images(productId),
        queryFn: () => productService.getImages(productId),
        enabled: !!productId,
    })
}

export function useProductVariants(productId: string) {
    return useQuery({
        queryKey: productKeys.variants(productId),
        queryFn: () => productService.getVariants(productId),
        enabled: !!productId,
    })
}
