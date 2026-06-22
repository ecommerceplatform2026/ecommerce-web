import axiosInstance from '@/lib/axios'
import { CHECKOUT_ENDPOINTS, ORDER_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { CheckoutResult, CreateOrderRequest, Order, OrderListResult, OrderQueryParams } from '@/types/order'

function cleanParams(params: OrderQueryParams): Record<string, number> {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== '',
        ),
    ) as Record<string, number>
}

export const orderService = {
    create: async (payload: CreateOrderRequest): Promise<CheckoutResult> => {
        const res = await axiosInstance.post<ApiResponse<CheckoutResult>>(
            CHECKOUT_ENDPOINTS.CREATE,
            payload,
        )
        return res.data.data
    },

    getMyOrders: async (params: OrderQueryParams): Promise<OrderListResult> => {
        const res = await axiosInstance.get<PaginatedResponse<Order>>(
            ORDER_ENDPOINTS.GET_ALL,
            { params: cleanParams(params) },
        )
        return res.data.data
    },

    getById: async (id: string): Promise<Order> => {
        const res = await axiosInstance.get<ApiResponse<Order>>(
            ORDER_ENDPOINTS.GET_BY_ID(id),
        )
        return res.data.data
    },
}
