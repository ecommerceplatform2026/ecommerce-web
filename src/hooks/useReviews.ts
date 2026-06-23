import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Toast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
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
        mutationFn: (payload: ReviewRequest) => reviewService.create(payload),
        onSuccess: () => {
            Toast('Review submitted successfully.')
            queryClient.invalidateQueries({ queryKey: reviewKeys.product(productId) })
        },
        onError: (error: ApiError) => {
            Toast(error.message ?? 'Failed to submit review.', 'error')
        },
    })
}

export function useCanReviewProduct(productId: string) {
    const { isAuthenticated } = useAuth()

    return useQuery({
        queryKey: ['reviews', 'can-review', productId] as const,
        queryFn: () => reviewService.checkCanReview(productId),
        enabled: !!productId && isAuthenticated,
    })
}
