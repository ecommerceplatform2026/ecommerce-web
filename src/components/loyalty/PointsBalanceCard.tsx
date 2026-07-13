"use client"

import * as React from "react"
import { Star, ArrowRight, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
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
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-16 w-full mt-4" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return null
    }

    return (
        <Card className="h-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-secondary/20 pointer-events-none" aria-hidden />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-secondary/15 pointer-events-none" aria-hidden />

            <CardContent className="p-6 flex flex-col h-full relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary text-primary-foreground">
                            <Star className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-sans">
                                Loyalty Rewards
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent shrink-0 text-xs h-8 px-3" asChild>
                        <a href="#how-points-work">
                            How it works <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                    </Button>
                </div>

                {/* Hero balance */}
                <div className="flex-1">
                    <div className="relative">
                        <p className="font-serif text-5xl md:text-6xl font-medium tracking-tight leading-none">
                            {balance.toLocaleString()}
                            <span className="text-lg font-sans font-normal text-muted-foreground ml-2 align-baseline">
                                pts
                            </span>
                        </p>
                        {pendingPoints > 0 && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>{pendingPoints.toLocaleString()} pending</span>
                            </p>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-sans">
                        <span className="font-medium text-foreground">{discountEquivalent.toLocaleString()} VND</span> in rewards available
                    </p>

                    {/* Stats block - editorial color-block style */}
                    <div className="mt-6 grid grid-cols-2 gap-px bg-border">
                        <div className="bg-secondary/30 p-4 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-secondary/20 pointer-events-none" aria-hidden />
                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 font-sans">
                                <TrendingUp className="h-3 w-3" />
                                Earned
                            </div>
                            <p className="font-serif text-xl font-medium relative">+{totalEarned.toLocaleString()}</p>
                        </div>
                        <div className="bg-secondary/30 p-4 relative overflow-hidden">
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-secondary/20 pointer-events-none" aria-hidden />
                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 font-sans">
                                <TrendingDown className="h-3 w-3" />
                                Redeemed
                            </div>
                            <p className="font-serif text-xl font-medium relative">−{totalRedeemed.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {lastUpdated && (
                    <p className="text-[11px] text-muted-foreground mt-4 pt-4 border-t border-border font-sans">
                        Last updated {new Date(lastUpdated).toLocaleDateString("en-GB", {
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
