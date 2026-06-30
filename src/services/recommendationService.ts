import axiosInstance from '@/lib/axios'
import { RECOMMENDATION_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/product'

export const recommendationService = {
    getPopular: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            RECOMMENDATION_ENDPOINTS.POPULAR
        )
        return res.data.data
    },

    getPersonalized: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            RECOMMENDATION_ENDPOINTS.FOR_YOU
        )
        return res.data.data
    },

    getSimilar: async (productId: string): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            RECOMMENDATION_ENDPOINTS.SIMILAR(productId)
        )
        return res.data.data
    },
}
