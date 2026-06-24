"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import type { LoyaltyTransaction } from "@/types/loyalty"

interface PointsTransactionListProps {
    transactions: LoyaltyTransaction[]
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    isLoading?: boolean
    isError?: boolean
    error?: string | null
    onRetry?: () => void
}

const typeConfig = {
    Earn: { icon: ArrowUpRight, bg: "bg-green-100 text-green-700", textColor: "text-green-700", sign: "+" },
    Redeem: { icon: ArrowDownRight, bg: "bg-red-100 text-red-700", textColor: "text-red-700", sign: "−" },
    Expired: { icon: Clock, bg: "bg-amber-100 text-amber-700", textColor: "text-amber-700", sign: "−" },
} as const

function PointsTransactionList({
    transactions,
    totalPages,
    currentPage,
    onPageChange,
    isLoading,
    isError,
    error,
    onRetry,
}: PointsTransactionListProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Points History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Points History</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-3 py-8">
                    <p className="text-sm text-muted-foreground">
                        {error ?? "Failed to load transactions."}
                    </p>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry} className="bg-transparent">
                            <RefreshCw className="h-4 w-4 mr-1.5" />
                            Retry
                        </Button>
                    )}
                </CardContent>
            </Card>
        )
    }

    if (transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Points History</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        title="No transactions yet"
                        description="Points are earned when your orders are delivered."
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Points History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {transactions.map((txn) => {
                    const cfg = typeConfig[txn.type] ?? typeConfig.Earn
                    const Icon = cfg.icon
                    return (
                        <div
                            key={txn.id}
                            className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full",
                                        cfg.bg,
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{txn.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(txn.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn("text-sm font-semibold", cfg.textColor)}>
                                    {cfg.sign}
                                    {txn.points.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )
                })}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="min-w-[36px]"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export { PointsTransactionList }
