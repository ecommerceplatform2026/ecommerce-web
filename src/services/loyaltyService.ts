import axiosInstance from '@/lib/axios'
import { LOYALTY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { LoyaltyBalanceResponse } from '@/types/loyalty'

export const loyaltyService = {
    getBalance: async (): Promise<LoyaltyBalanceResponse> => {
        const res = await axiosInstance.get<ApiResponse<LoyaltyBalanceResponse>>(
            LOYALTY_ENDPOINTS.BALANCE,
        )
        return res.data.data
    },
}
