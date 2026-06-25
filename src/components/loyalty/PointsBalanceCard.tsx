"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

interface PointsBalanceCardProps {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    isLoading?: boolean
    error?: string | null
}

function PointsBalanceCard({ balance, pendingPoints, discountEquivalent, isLoading, error }: PointsBalanceCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-3 w-56" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return null
    }

    return (
        <Card>
            <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Loyalty Points
                </p>
                <p className="font-serif text-4xl font-bold tracking-tight">
                    {balance.toLocaleString()}
                    <span className="text-base font-normal text-muted-foreground ml-1.5">
                        pts
                    </span>
                </p>
                {pendingPoints > 0 && (
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {pendingPoints.toLocaleString()} pts pending
                    </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                    ≈ {discountEquivalent.toLocaleString()} VND
                </p>
            </CardContent>
        </Card>
    )
}

export { PointsBalanceCard }
