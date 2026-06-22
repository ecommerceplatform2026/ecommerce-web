import axiosInstance from '@/lib/axios'
import { DASHBOARD_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type {
    DashboardRequest,
    DashboardSummary,
    RevenueTrendPoint,
    PaymentMethodSummary,
} from '@/types/dashboard'

export const dashboardService = {
    getSummary: async (params?: DashboardRequest): Promise<DashboardSummary> => {
        const res = await axiosInstance.get<ApiResponse<DashboardSummary>>(
            DASHBOARD_ENDPOINTS.SUMMARY,
            { params },
        )
        return res.data.data
    },

    getRevenueTrend: async (params?: DashboardRequest): Promise<RevenueTrendPoint[]> => {
        const res = await axiosInstance.get<ApiResponse<RevenueTrendPoint[]>>(
            DASHBOARD_ENDPOINTS.REVENUE_TREND,
            { params },
        )
        return res.data.data
    },

    getPaymentMethods: async (params?: DashboardRequest): Promise<PaymentMethodSummary[]> => {
        const res = await axiosInstance.get<ApiResponse<PaymentMethodSummary[]>>(
            DASHBOARD_ENDPOINTS.PAYMENT_METHODS,
            { params },
        )
        return res.data.data
    },
}
