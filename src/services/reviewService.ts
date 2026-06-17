import axiosInstance from '@/lib/axios'
import { REVIEW_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { ReviewListResult, ReviewRequest, ReviewResponse } from '@/types/review'

export const reviewService = {
    getByProduct: async (productId: string): Promise<ReviewListResult> => {
        const res = await axiosInstance.get<ApiResponse<ReviewListResult>>(
            REVIEW_ENDPOINTS.GET_BY_PRODUCT(productId),
        )
        return res.data.data
    },

    create: async (productId: string, payload: ReviewRequest): Promise<ReviewResponse> => {
        const res = await axiosInstance.post<ApiResponse<ReviewResponse>>(
            REVIEW_ENDPOINTS.CREATE(productId),
            payload,
        )
        return res.data.data
    },
}
