import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'

export const productKeys = {
    all:    ['products']                        as const,
    adminAll: ['products', 'admin'] as const,
    detail: (id: string) => ['products', id]   as const,
    images: (id: string) => ['products', id, 'images'] as const,
    variants: (id: string) => ['products', id, 'variants'] as const,
}

export function useProducts() {
    return useQuery({
        queryKey: productKeys.all,
        queryFn:  productService.getAll,
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn:  () => productService.getDetail(id),
        enabled:  !!id,
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
        queryFn:  () => productService.getImages(productId),
        enabled:  !!productId,
    })
}

export function useProductVariants(productId: string) {
    return useQuery({
        queryKey: productKeys.variants(productId),
        queryFn: () => productService.getVariants(productId),
        enabled: !!productId,
    })
}
