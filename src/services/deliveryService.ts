import axiosInstance from '@/lib/axios'
import { DELIVERY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { CreateDeliveryRequest, DeliveryListData, DeliveryListFilters, DeliveryListItem } from '@/types/delivery'

export const deliveryService = {
    getDeliveries: async (params?: DeliveryListFilters): Promise<DeliveryListData> => {
        const res = await axiosInstance.get<PaginatedResponse<DeliveryListItem>>(
            DELIVERY_ENDPOINTS.GET_ALL,
            { params },
        )
        return res.data.data
    },

    createDelivery: async (payload: CreateDeliveryRequest): Promise<void> => {
        await axiosInstance.post<ApiResponse<unknown>>(
            DELIVERY_ENDPOINTS.CREATE,
            payload,
        )
    },

    retryDelivery: async (deliveryId: string): Promise<void> => {
        await axiosInstance.post<ApiResponse<unknown>>(
            DELIVERY_ENDPOINTS.RETRY,
            { deliveryId },
        )
    },
}
