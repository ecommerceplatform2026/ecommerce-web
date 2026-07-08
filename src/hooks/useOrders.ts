import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { useCart } from '@/hooks/useCart'
import { pointsKeys } from '@/hooks/usePoints'
import type { CheckoutRequest, OrderResponse } from '@/types/order'

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
            queryClient.invalidateQueries({ queryKey: pointsKeys.all })
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

export function useOrderDetail(
    id: string,
    options?: Omit<UseQueryOptions<OrderResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<OrderResponse, Error>({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
        ...options,
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

export function useCompleteOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderService.completeOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
        },
    })
}

export function useReturnOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderService.returnOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all })
        },
    })
}
