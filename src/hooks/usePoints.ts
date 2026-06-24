import { useQuery } from '@tanstack/react-query'
import { pointsService } from '@/services/pointsService'

export function usePointsBalance() {
    return useQuery({
        queryKey: ['loyalty', 'balance'],
        queryFn: () => pointsService.getBalance(),
    })
}

export function usePointsTransactions(params?: { page?: number; pageSize?: number }) {
    return useQuery({
        queryKey: ['loyalty', 'transactions', params],
        queryFn: () => pointsService.getTransactions(params),
    })
}
