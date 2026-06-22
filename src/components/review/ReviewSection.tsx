"use client"

import { useAuth } from "@/hooks/useAuth"
import { useProductReviews, useSubmitReview, useCanReviewProduct } from "@/hooks/useReviews"
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
    const { data: canReviewData } = useCanReviewProduct(productId)
    const submitMutation = useSubmitReview(productId)

    const hasExistingReview = data?.items.some(
        review => review.userId === user?.id,
    )

    async function handleSubmitReview(formData: Omit<ReviewRequest, 'productId' | 'orderId'>) {
        const orderId = canReviewData?.eligibleOrders[0]?.orderId
        if (!orderId) return

        await submitMutation.mutateAsync({
            ...formData,
            productId,
            orderId,
        })
    }

    function renderReviewFormArea() {
        if (!isAuthenticated) {
            return (
                <p className="mb-10 text-sm text-muted-foreground">
                    <a href="/login" className="underline underline-offset-2 hover:text-foreground">
                        Sign in
                    </a>{" "}
                    to leave a review.
                </p>
            )
        }

        if (hasExistingReview) {
            return (
                <p className="mb-10 text-sm text-muted-foreground">
                    You have already reviewed this product.
                </p>
            )
        }

        if (canReviewData && !canReviewData.isEligible) {
            return (
                <p className="mb-10 text-sm text-muted-foreground">
                    You must purchase this product before leaving a review.
                </p>
            )
        }

        return (
            <div className="mb-10 rounded-none border border-border p-6">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-widest">
                    Write a Review
                </h3>
                <ReviewForm
                    productId={productId}
                    onSubmit={handleSubmitReview}
                />
            </div>
        )
    }

    return (
        <section className="border-t border-border pt-10">
            <h2 className="mb-8 font-serif text-3xl">Reviews</h2>

            {renderReviewFormArea()}

            <ReviewList
                productId={productId}
                averageRating={averageRating}
                reviewCount={reviewCount}
            />
        </section>
    )
}
