"use client"

import { useAuth } from "@/hooks/useAuth"
import { useProductReviews, useSubmitReview } from "@/hooks/useReviews"
import { ReviewForm } from "@/components/review/ReviewForm"
import { ReviewList } from "@/components/review/ReviewList"
import type { ReviewRequest } from "@/types/review"

interface ReviewSectionProps {
    productId: string
    averageRating: number
    reviewCount: number
}

export function ReviewSection({ productId, averageRating, reviewCount }: ReviewSectionProps) {
    const { isAuthenticated, user } = useAuth()
    const { data } = useProductReviews(productId)
    const submitMutation = useSubmitReview(productId)

    const hasExistingReview = data?.items.some(
        review => review.userId === user?.id,
    )

    async function handleSubmitReview(formData: ReviewRequest) {
        await submitMutation.mutateAsync(formData)
    }

    return (
        <section className="border-t border-border pt-10">
            <h2 className="mb-8 font-serif text-3xl">Reviews</h2>

            {isAuthenticated && !hasExistingReview && (
                <div className="mb-10 rounded-none border border-border p-6">
                    <h3 className="mb-4 text-sm font-medium uppercase tracking-widest">
                        Write a Review
                    </h3>
                    <ReviewForm
                        productId={productId}
                        onSubmit={handleSubmitReview}
                    />
                </div>
            )}

            {!isAuthenticated && (
                <p className="mb-10 text-sm text-muted-foreground">
                    <a href="/login" className="underline underline-offset-2 hover:text-foreground">
                        Sign in
                    </a>{" "}
                    to leave a review.
                </p>
            )}

            <ReviewList
                productId={productId}
                averageRating={averageRating}
                reviewCount={reviewCount}
            />
        </section>
    )
}
