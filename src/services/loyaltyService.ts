import axiosInstance from '@/lib/axios'
import { LOYALTY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { LoyaltyBalanceResponse, PaginatedTransactions } from '@/types/loyalty'

interface GetTransactionsParams {
    page: number
    pageSize?: number
    type?: string
    status?: string
}

export const loyaltyService = {
    getBalance: async (): Promise<LoyaltyBalanceResponse> => {
        const res = await axiosInstance.get<ApiResponse<LoyaltyBalanceResponse>>(
            LOYALTY_ENDPOINTS.BALANCE,
        )
        return res.data.data
    },

    getTransactions: async ({ page, pageSize, type, status }: GetTransactionsParams): Promise<PaginatedTransactions> => {
        const res = await axiosInstance.get<ApiResponse<PaginatedTransactions>>(
            LOYALTY_ENDPOINTS.TRANSACTIONS,
            { params: { page, pageSize, type, status } },
        )
        return res.data.data
    },
}
