import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { useCart } from '@/hooks/useCart'
import type { CheckoutRequest } from '@/types/order'

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...orderKeys.lists(), params] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
}

export function useCheckout() {
    const queryClient = useQueryClient()
    const { clearCart } = useCart()

    return useMutation({
        mutationFn: (payload: CheckoutRequest) => orderService.checkout(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            clearCart()
        },
    })
}

export function useOrdersList(params?: { page?: number; pageSize?: number; status?: number }) {
    const safeParams = params ?? { page: 1, pageSize: 10 }
    return useQuery({
        queryKey: orderKeys.list(safeParams as Record<string, unknown>),
        queryFn: () => orderService.getOrders(safeParams),
    })
}

export function useOrderDetail(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
    })
}

export function useCancelOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
        },
    })
}
