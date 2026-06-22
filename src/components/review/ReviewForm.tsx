"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { StarRating } from "@/components/review/StarRating"
import { ReviewRating } from "@/constants/enums"

const reviewSchema = z.object({
    rating: z
        .number()
        .min(1, "Please select a rating")
        .max(5, "Rating must be between 1 and 5"),
    comment: z
        .string()
        .min(10, "Review must be at least 10 characters")
        .max(2000, "Review must not exceed 2000 characters"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
    productId: string
    onSubmit: (data: ReviewFormData) => Promise<void>
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0 as unknown as ReviewRating,
            comment: "",
        },
    })

    const handleFormSubmit = async (data: ReviewFormData) => {
        setIsLoading(true)
        try {
            await onSubmit(data)
            reset()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
            <div>
                <div className="flex items-center gap-4">
                    <Label htmlFor="rating" className="shrink-0">Rating</Label>
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <StarRating
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading}
                            />
                        )}
                    />
                </div>
                {errors.rating && (
                    <p className="mt-2 text-sm text-destructive">{errors.rating.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <textarea
                    id="comment"
                    {...register("comment")}
                    disabled={isLoading}
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    className="flex w-full rounded-none border border-border bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-invalid={!!errors.comment}
                />
                {errors.comment && (
                    <p className="text-sm text-destructive">{errors.comment.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="h-11 w-full rounded-none text-sm uppercase tracking-widest"
                disabled={isLoading}
            >
                {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    )
}
