"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

interface PointsBalanceCardProps {
    availablePoints: number
    pendingPoints: number
    totalEarned?: number
    isLoading?: boolean
    error?: string | null
}

function PointsBalanceCard({ availablePoints, pendingPoints, totalEarned, isLoading, error }: PointsBalanceCardProps) {
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
                    {availablePoints.toLocaleString()}
                    <span className="text-base font-normal text-muted-foreground ml-1.5">
                        points available
                    </span>
                </p>
                {pendingPoints > 0 && (
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {pendingPoints.toLocaleString()} points pending from recent orders
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export { PointsBalanceCard }
