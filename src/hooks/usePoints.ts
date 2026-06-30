import { useQuery } from '@tanstack/react-query'
import { loyaltyService } from '@/services/loyaltyService'

import type { PaginatedTransactions } from '@/types/loyalty'

export const pointsKeys = {
    all: ['points'] as const,
    balance: () => [...pointsKeys.all, 'balance'] as const,
    transactions: (page: number, type?: string, status?: string) =>
        [...pointsKeys.all, 'transactions', { page, type, status }] as const,
    expiring: () => [...pointsKeys.all, 'expiring'] as const,
}

export function usePointsBalance() {
    return useQuery({
        queryKey: pointsKeys.balance(),
        queryFn: () => loyaltyService.getBalance(),
    })
}

export function usePointsTransactions(page: number, type?: string, status?: string) {
    return useQuery({
        queryKey: pointsKeys.transactions(page, type, status),
        queryFn: () => loyaltyService.getTransactions({ page, type, status }),
    })
}

export function useExpiringPoints() {
    return useQuery({
        queryKey: pointsKeys.expiring(),
        queryFn: () =>
            loyaltyService.getTransactions({ page: 1, pageSize: 1, type: 'Expired', status: 'Pending' }),
        refetchInterval: 5 * 60 * 1000,
        select: (data: PaginatedTransactions) => (data.items.length > 0 ? data.items[0] : null),
    })
}
