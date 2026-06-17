import axiosInstance from '@/lib/axios'
import { CHECKOUT_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { CheckoutResult, CreateOrderRequest } from '@/types/order'

export const orderService = {
    create: async (payload: CreateOrderRequest): Promise<CheckoutResult> => {
        const res = await axiosInstance.post<ApiResponse<CheckoutResult>>(
            CHECKOUT_ENDPOINTS.CREATE,
            payload,
        )
        return res.data.data
    },
}
