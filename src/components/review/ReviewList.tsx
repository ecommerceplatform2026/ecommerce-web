"use client"

import { Star, MessageSquare } from "lucide-react"
import { ReviewCard } from "@/components/review/ReviewCard"
import { useProductReviews } from "@/hooks/useReviews"
import type { ReviewListResult } from "@/types/review"

interface ReviewListProps {
    productId: string
    averageRating: number
    reviewCount: number
}

export function ReviewList({ productId, averageRating, reviewCount }: ReviewListProps) {
    const { data, isLoading, error } = useProductReviews(productId)

    const reviews = data?.items ?? []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-serif text-4xl tracking-tight">
                        {averageRating.toFixed(1)}
                    </span>
                    <Star className="h-5 w-5 fill-foreground text-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{reviewCount}</span>{" "}
                    {reviewCount === 1 ? "review" : "reviews"}
                </div>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse space-y-2 border-b border-border pb-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-secondary" />
                                <div className="space-y-1.5">
                                    <div className="h-3 w-24 rounded bg-secondary" />
                                    <div className="h-2.5 w-16 rounded bg-secondary" />
                                </div>
                            </div>
                            <div className="h-4 w-full rounded bg-secondary" />
                            <div className="h-4 w-3/4 rounded bg-secondary" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    Unable to load reviews. Please try again.
                </p>
            )}

            {!isLoading && !error && reviews.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                        No reviews yet. Be the first to share your thoughts.
                    </p>
                </div>
            )}

            {!isLoading && !error && reviews.length > 0 && (
                <div className="space-y-5">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    )
}
