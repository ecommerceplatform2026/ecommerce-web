"use client"

import * as React from "react"
import { useState } from "react"
import { Gift, ShoppingBag, Clock, Info } from "lucide-react"
import { PointsBalanceCard } from "@/components/loyalty/PointsBalanceCard"
import { PointsTransactionList } from "@/components/loyalty/PointsTransactionList"
import { usePointsBalance, usePointsTransactions } from "@/hooks/usePoints"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function LoyaltyPage() {
    const [page, setPage] = useState(1)
    const { data: balance, isLoading: isBalanceLoading, error: balanceError } = usePointsBalance()
    const {
        data: txData,
        isLoading: isTxLoading,
        isError: isTxError,
        error: txError,
        refetch: refetchTx,
    } = usePointsTransactions(page)

    return (
        <div className="py-16 px-4 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <PointsBalanceCard
                            balance={balance?.balance ?? 0}
                            pendingPoints={balance?.pendingPoints ?? 0}
                            discountEquivalent={balance?.discountEquivalent ?? 0}
                            lastUpdated={balance?.lastUpdated}
                            isLoading={isBalanceLoading}
                            error={balanceError ? "Failed to load points" : null}
                        />
                    </div>
                    <div className="flex">
                        <Card id="how-points-work" className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Info className="h-4 w-4" />
                                    How points work
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <ShoppingBag className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Earn</p>
                                        <p className="text-muted-foreground">1 point per 10,000 VND spent</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Gift className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Redeem</p>
                                        <p className="text-muted-foreground">1 point = 100 VND discount (min 100 pts)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Expiry</p>
                                        <p className="text-muted-foreground">Points expire after 12 months</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <PointsTransactionList
                    transactions={txData?.items ?? []}
                    totalPages={txData?.totalPages ?? 0}
                    currentPage={txData?.page ?? page}
                    onPageChange={setPage}
                    isLoading={isTxLoading}
                    isError={isTxError}
                    error={txError ? "Failed to load transactions" : null}
                    onRetry={refetchTx}
                />
            </div>
        </div>
    )
}
