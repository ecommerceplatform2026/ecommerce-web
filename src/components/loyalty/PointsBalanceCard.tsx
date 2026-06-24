"use client"

import * as React from "react"
import { Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"

interface PointsBalanceCardProps {
    balance: number
    discountEquivalent: number
    lastUpdated?: string
    isLoading?: boolean
    error?: string | null
}

function PointsBalanceCard({ balance, discountEquivalent, lastUpdated, isLoading, error }: PointsBalanceCardProps) {
    if (isLoading) {
        return (
            <Card>
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
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center gap-1.5 mb-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Loyalty Rewards
                    </p>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="font-serif text-4xl font-bold tracking-tight">
                            {balance.toLocaleString()}
                            <span className="text-base font-normal text-muted-foreground ml-1.5">
                                pts
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            ≈ {discountEquivalent.toLocaleString()} VND
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent shrink-0" asChild>
                        <a href="#how-points-work">
                            How points work <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </a>
                    </Button>
                </div>

                {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-3">
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
