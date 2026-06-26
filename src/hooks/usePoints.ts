import { useQuery } from '@tanstack/react-query'
import { loyaltyService } from '@/services/loyaltyService'
import type { LoyaltyTransaction } from '@/types/loyalty'

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

export function useOrderLoyaltyTransactions(orderId: string, pageSize: number = 50) {
    return useQuery({
        queryKey: [...pointsKeys.all, 'order-transactions', orderId] as const,
        queryFn: async (): Promise<LoyaltyTransaction[]> => {
            const result = await loyaltyService.getTransactions({ page: 1, pageSize })
            return result.items.filter((txn) => txn.orderId === Number(orderId))
        },
        enabled: !!orderId,
    })
}
