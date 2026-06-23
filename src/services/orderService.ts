import axiosInstance from '@/lib/axios'
import { CHECKOUT_ENDPOINTS, ORDER_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
    CheckoutRequest,
    CheckoutResponse,
    CreateOrderRequest,
    CheckoutResult,
    Order,
    OrderListResult,
    OrderQueryParams,
    OrderResponse,
} from '@/types/order'

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

    checkout: async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
        const res = await axiosInstance.post<ApiResponse<CheckoutResponse>>(
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

    getOrders: async (params?: { page?: number; pageSize?: number; status?: number }): Promise<PaginatedResponse<OrderResponse>['data']> => {
        const res = await axiosInstance.get<PaginatedResponse<OrderResponse>>(
            ORDER_ENDPOINTS.GET_ALL,
            { params },
        )
        return res.data.data
    },

    getById: async (id: string): Promise<Order> => {
        const res = await axiosInstance.get<ApiResponse<Order>>(
            ORDER_ENDPOINTS.GET_BY_ID(id),
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
}
