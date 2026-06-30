import { useQuery } from '@tanstack/react-query'
import { recommendationService } from '@/services/recommendationService'

export const recommendationKeys = {
    all: ['recommendations'] as const,
    popular: ['recommendations', 'popular'] as const,
    personalized: ['recommendations', 'personalized'] as const,
    similar: (productId: string) => ['recommendations', 'similar', productId] as const,
}

export function usePopularProducts() {
    return useQuery({
        queryKey: recommendationKeys.popular,
        queryFn: recommendationService.getPopular,
    })
}

export function usePersonalizedRecommendations(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: recommendationKeys.personalized,
        queryFn: recommendationService.getPersonalized,
        enabled: options?.enabled,
    })
}

export function useSimilarProducts(productId: string) {
    return useQuery({
        queryKey: recommendationKeys.similar(productId),
        queryFn: () => recommendationService.getSimilar(productId),
        enabled: !!productId,
    })
}
