import { useQuery } from '@tanstack/react-query'
import { loyaltyService } from '@/services/loyaltyService'

export const pointsKeys = {
    all: ['points'] as const,
    balance: () => [...pointsKeys.all, 'balance'] as const,
    transactions: (page: number, type?: string, status?: string) =>
        [...pointsKeys.all, 'transactions', { page, type, status }] as const,
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
