import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { reviewService } from '@/services/reviewService'
import type { ReviewRequest } from '@/types/review'
import type { ApiError } from '@/types/api'

export const reviewKeys = {
    all: ['reviews'] as const,
    product: (productId: string) => ['reviews', 'product', productId] as const,
}

export function useProductReviews(productId: string) {
    return useQuery({
        queryKey: reviewKeys.product(productId),
        queryFn: () => reviewService.getByProduct(productId),
        enabled: !!productId,
    })
}

export function useSubmitReview(productId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ReviewRequest) => reviewService.create(productId, payload),
        onSuccess: () => {
            toast.success('Review submitted successfully.')
            queryClient.invalidateQueries({ queryKey: reviewKeys.product(productId) })
        },
        onError: (error: ApiError) => {
            toast.error(error.message ?? 'Failed to submit review.')
        },
    })
}
