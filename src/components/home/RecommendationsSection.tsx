"use client"

import { useAuth } from "@/hooks/useAuth"
import { usePopularProducts, usePersonalizedRecommendations } from "@/hooks/useRecommendations"
import { ProductCard } from "@/components/product/ProductCard"
import { Skeleton } from "@/components/ui/Skeleton"

export function RecommendationsSection() {
    const { isAuthenticated } = useAuth()

    // Parallel fetching of recommendations
    const { data: popularProducts = [], isLoading: isPopularLoading } = usePopularProducts()
    const { data: personalizedProducts = [], isLoading: isPersonalizedLoading } = usePersonalizedRecommendations({
        enabled: isAuthenticated,
    })

    const popular = popularProducts.slice(0, 4)
    const personalized = personalizedProducts.slice(0, 4)

    return (
        <div className="space-y-16 lg:space-y-24 bg-background pb-16 lg:pb-24">
            {/* Recommended For You Section - Only visible to logged-in users */}
            {isAuthenticated && (
                <section className="px-4 lg:px-8" id="recommended-for-you-section">
                    <div className="container mx-auto">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
                                    Tailored for you
                                </p>
                                <h2 className="font-serif text-4xl md:text-5xl">Recommended For You</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {isPersonalizedLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="space-y-3" data-testid="personalized-skeleton">
                                        <Skeleton className="aspect-[3/4] w-full" />
                                        <Skeleton className="h-3 w-1/3" />
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))
                                : personalized.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            }
                        </div>
                    </div>
                </section>
            )}

            {/* Popular Right Now Section - Visible to any visitor */}
            <section className="px-4 lg:px-8" id="popular-now-section">
                <div className="container mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
                                What&apos;s trending
                            </p>
                            <h2 className="font-serif text-4xl md:text-5xl">Popular Right Now</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {isPopularLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-3" data-testid="popular-skeleton">
                                    <Skeleton className="aspect-[3/4] w-full" />
                                    <Skeleton className="h-3 w-1/3" />
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))
                            : popular.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}
