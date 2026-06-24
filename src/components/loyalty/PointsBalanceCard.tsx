"use client"

import * as React from "react"
import { Star, ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"

interface PointsBalanceCardProps {
    balance: number
    pendingPoints?: number
    discountEquivalent: number
    totalEarned?: number
    totalRedeemed?: number
    lastUpdated?: string
    isLoading?: boolean
    error?: string | null
}

function PointsBalanceCard({
    balance,
    pendingPoints = 0,
    discountEquivalent,
    totalEarned = 0,
    totalRedeemed = 0,
    lastUpdated,
    isLoading,
    error,
}: PointsBalanceCardProps) {
    if (isLoading) {
        return (
            <Card className="h-full">
                <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-32" />
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
        <Card className="h-full">
            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            Loyalty Rewards
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent shrink-0" asChild>
                        <a href="#how-points-work">
                            How points work <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </a>
                    </Button>
                </div>

                <div className="flex-1">
                    <p className="font-serif text-4xl font-bold tracking-tight">
                        {balance.toLocaleString()}
                        {pendingPoints > 0 && (
                            <span className="text-lg font-normal text-muted-foreground ml-1.5">
                                (+{pendingPoints.toLocaleString()})
                            </span>
                        )}
                        <span className="text-base font-normal text-muted-foreground ml-1.5">
                            pts
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        ≈ {discountEquivalent.toLocaleString()} VND
                    </p>

                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-600 shrink-0" />
                            <span className="text-muted-foreground">Total earned</span>
                            <span className="ml-auto font-medium text-green-700">
                                +{totalEarned.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingDown className="h-4 w-4 text-red-600 shrink-0" />
                            <span className="text-muted-foreground">Total redeemed</span>
                            <span className="ml-auto font-medium text-red-700">
                                −{totalRedeemed.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                        Last updated: {new Date(lastUpdated).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export { PointsBalanceCard }
