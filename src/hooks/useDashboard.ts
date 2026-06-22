import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardRequest } from '@/types/dashboard'

export const dashboardKeys = {
    all: ['dashboard'] as const,
    summary: (params?: DashboardRequest) => ['dashboard', 'summary', params] as const,
    revenueTrend: (params?: DashboardRequest) => ['dashboard', 'revenue-trend', params] as const,
    paymentMethods: (params?: DashboardRequest) => ['dashboard', 'payment-methods', params] as const,
}

export function useDashboardSummary(params?: DashboardRequest) {
    return useQuery({
        queryKey: dashboardKeys.summary(params),
        queryFn: () => dashboardService.getSummary(params),
    })
}

export function useRevenueTrend(params?: DashboardRequest) {
    return useQuery({
        queryKey: dashboardKeys.revenueTrend(params),
        queryFn: () => dashboardService.getRevenueTrend(params),
    })
}

export function usePaymentMethods(params?: DashboardRequest) {
    return useQuery({
        queryKey: dashboardKeys.paymentMethods(params),
        queryFn: () => dashboardService.getPaymentMethods(params),
    })
}
