import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import type { OrderQueryParams } from '@/types/order'

export const orderKeys = {
    all: ['orders'] as const,
    list: (params: OrderQueryParams) => ['orders', 'list', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
}

export function useOrders(params: OrderQueryParams) {
    return useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => orderService.getMyOrders(params),
    })
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getById(id),
        enabled: !!id,
    })
}
