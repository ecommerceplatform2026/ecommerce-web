"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/Skeleton"

interface PointsBalanceCardProps {
    availablePoints: number
    pendingPoints: number
    isLoading?: boolean
    error?: string | null
}

function PointsBalanceCard({ availablePoints, pendingPoints, isLoading, error }: PointsBalanceCardProps) {
    if (isLoading) {
        return <Skeleton className="h-5 w-48" />
    }

    if (error) {
        return null
    }

    return (
        <p className="font-serif text-base font-medium tracking-tight text-muted-foreground">
            {availablePoints.toLocaleString()}
            {pendingPoints > 0 && (
                <span className="text-muted-foreground/60">
                    {" "}(+ {pendingPoints.toLocaleString()} pending)
                </span>
            )}
            {" "}pts
        </p>
    )
}

export { PointsBalanceCard }
