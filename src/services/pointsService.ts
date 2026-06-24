import axiosInstance from '@/lib/axios'
import { LOYALTY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { LoyaltyBalanceResponse, LoyaltyTransaction } from '@/types/loyalty'

export const pointsService = {
    getBalance: async (): Promise<LoyaltyBalanceResponse> => {
        const res = await axiosInstance.get<ApiResponse<LoyaltyBalanceResponse>>(
            LOYALTY_ENDPOINTS.BALANCE,
        )
        return res.data.data
    },

    getTransactions: async (params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<LoyaltyTransaction>['data']> => {
        const res = await axiosInstance.get<PaginatedResponse<LoyaltyTransaction>>(
            LOYALTY_ENDPOINTS.TRANSACTIONS,
            { params },
        )
        return res.data.data
    },
}
