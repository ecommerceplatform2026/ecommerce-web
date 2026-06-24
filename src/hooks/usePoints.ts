import { useQuery } from '@tanstack/react-query'
import { loyaltyService } from '@/services/loyaltyService'

export const pointsKeys = {
    all: ['points'] as const,
    balance: () => [...pointsKeys.all, 'balance'] as const,
}

export function usePointsBalance() {
    return useQuery({
        queryKey: pointsKeys.balance(),
        queryFn: () => loyaltyService.getBalance(),
    })
}
