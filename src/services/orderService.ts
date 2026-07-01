import axiosInstance from '@/lib/axios'
import { CHECKOUT_ENDPOINTS, ORDER_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { CheckoutRequest, CheckoutResponse, OrderResponse } from '@/types/order'

export const orderService = {
    checkout: async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
        const res = await axiosInstance.post<ApiResponse<CheckoutResponse>>(
            CHECKOUT_ENDPOINTS.CREATE,
            payload,
        )
        return res.data.data
    },

    getOrders: async (params?: { page?: number; pageSize?: number; status?: number }): Promise<PaginatedResponse<OrderResponse>['data']> => {
        const res = await axiosInstance.get<PaginatedResponse<OrderResponse>>(
            ORDER_ENDPOINTS.GET_ALL,
            { params },
        )
        return res.data.data
    },

    getOrderById: async (id: string): Promise<OrderResponse> => {
        const res = await axiosInstance.get<ApiResponse<OrderResponse>>(
            ORDER_ENDPOINTS.GET_BY_ID(id),
        )
        return res.data.data
    },

    cancelOrder: async (id: string): Promise<void> => {
        await axiosInstance.post<ApiResponse<unknown>>(
            ORDER_ENDPOINTS.CANCEL(id),
        )
    },

    completeOrder: async (id: string): Promise<void> => {
        await axiosInstance.post<ApiResponse<unknown>>(
            ORDER_ENDPOINTS.COMPLETE(id),
        )
    },

    returnOrder: async (id: string): Promise<void> => {
        await axiosInstance.post<ApiResponse<unknown>>(
            ORDER_ENDPOINTS.RETURN(id),
        )
    },
}
