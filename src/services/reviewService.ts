import axiosInstance from '@/lib/axios'
import { REVIEW_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { ReviewEligibilityResponse, ReviewListResult, ReviewRequest, ReviewResponse } from '@/types/review'

export const reviewService = {
    getByProduct: async (productId: string): Promise<ReviewListResult> => {
        const res = await axiosInstance.get<ApiResponse<ReviewListResult>>(
            REVIEW_ENDPOINTS.GET_BY_PRODUCT(productId),
        )
        return res.data.data
    },

    create: async (payload: ReviewRequest): Promise<ReviewResponse> => {
        const res = await axiosInstance.post<ApiResponse<ReviewResponse>>(
            REVIEW_ENDPOINTS.CREATE,
            payload,
        )
        return res.data.data
    },

    checkCanReview: async (productId: string): Promise<ReviewEligibilityResponse> => {
        const res = await axiosInstance.get<ApiResponse<ReviewEligibilityResponse>>(
            REVIEW_ENDPOINTS.CAN_REVIEW,
            { params: { productId } },
        )
        return res.data.data
    },
}
