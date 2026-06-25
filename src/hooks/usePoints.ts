import { useQuery } from '@tanstack/react-query'
import { loyaltyService } from '@/services/loyaltyService'

export const pointsKeys = {
    all: ['points'] as const,
    balance: () => [...pointsKeys.all, 'balance'] as const,
    transactions: (page: number) => [...pointsKeys.all, 'transactions', page] as const,
}

export function usePointsBalance() {
    return useQuery({
        queryKey: pointsKeys.balance(),
        queryFn: () => loyaltyService.getBalance(),
    })
}

export function usePointsTransactions(page: number) {
    return useQuery({
        queryKey: pointsKeys.transactions(page),
        queryFn: () => loyaltyService.getTransactions(page),
    })
}
