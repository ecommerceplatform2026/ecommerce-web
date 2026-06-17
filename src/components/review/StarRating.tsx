"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface InteractiveProps {
    value: number
    onChange: (rating: number) => void
    disabled?: boolean
}

interface ReadOnlyProps {
    value: number
    size?: "sm" | "md" | "lg"
}

type StarRatingProps = InteractiveProps | ReadOnlyProps

function isInteractive(props: StarRatingProps): props is InteractiveProps {
    return "onChange" in props
}

const sizeMap = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
}

export function StarRating(props: StarRatingProps) {
    if (isInteractive(props)) {
        return <InteractiveStarRating {...props} />
    }
    return <ReadOnlyStarRating {...props} />
}

function ReadOnlyStarRating({ value, size = "md" }: ReadOnlyProps) {
    return (
        <div className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={cn(
                        sizeMap[size],
                        "transition-colors",
                        star <= value
                            ? "fill-foreground text-foreground"
                            : "fill-none text-muted-foreground/30",
                    )}
                />
            ))}
        </div>
    )
}

function InteractiveStarRating({ value, onChange, disabled }: InteractiveProps) {
    const [hovered, setHovered] = useState(0)

    return (
        <div className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => {
                const active = star <= (hovered || value)

                return (
                    <button
                        key={star}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className={cn(
                            "rounded-none p-0.5 transition-colors",
                            disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:scale-110",
                        )}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                        <Star
                            className={cn(
                                sizeMap.md,
                                "transition-colors",
                                active
                                    ? "fill-foreground text-foreground"
                                    : "fill-none text-muted-foreground/30",
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}
