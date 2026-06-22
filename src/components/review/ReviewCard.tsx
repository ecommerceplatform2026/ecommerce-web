"use client"

import { StarRating } from "@/components/review/StarRating"
import type { ReviewResponse } from "@/types/review"
import { formatReviewDate } from "@/utils/formatReviewDate"

interface ReviewCardProps {
    review: ReviewResponse
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <article className="border-b border-border pb-5 last:border-b-0 last:pb-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                        {(review.userName ?? review.fullName)?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <p className="text-sm font-medium">{review.userName ?? review.fullName ?? 'Anonymous'}</p>
                        <time className="text-xs text-muted-foreground">
                            {formatReviewDate(review.createdAt)}
                        </time>
                    </div>
                </div>
                <StarRating value={review.rating} size="sm" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
                {review.comment}
            </p>
        </article>
    )
}
