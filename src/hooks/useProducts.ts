import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'

export const productKeys = {
    all:    ['products']              as const,
    detail: (id: string) => ['products', id] as const,
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
        queryFn:  () => productService.getById(id),
        enabled:  !!id,
    })
}
