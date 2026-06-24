"use client"

import { useState } from "react"
import { ChevronDown, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/Skeleton"
import { PointsTransactionList } from "@/components/loyalty/PointsTransactionList"
import { usePointsBalance, usePointsTransactions } from "@/hooks/usePoints"

const faqs = [
    {
        question: "What are loyalty points?",
        answer: "Loyalty points are rewards you earn for shopping at ATELIER. Every completed order earns you points that can be redeemed for discounts on future purchases.",
    },
    {
        question: "How do I earn points?",
        answer: "You earn points on every completed order. Points are awarded once your order is delivered. The number of points you receive depends on your order total.",
    },
    {
        question: "How do I redeem points?",
        answer: "You can redeem your available points at checkout. Simply enter the number of points you'd like to use, and the discount will be applied instantly.",
    },
    {
        question: "Do points expire?",
        answer: "Points are valid for 12 months from the date they are earned. Any unused points will expire after this period.",
    },
    {
        question: "Can I return items bought with points?",
        answer: "Yes. If you return an item purchased with points, the points used for that purchase will be refunded back to your account once the return is processed.",
    },
]

function AccordionItem({ question, answer, open, onToggle }: {
    question: string
    answer: string
    open: boolean
    onToggle: () => void
}) {
    return (
        <div className="border-b border-border">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between py-5 text-left min-h-[44px]"
            >
                <span className="font-medium text-sm">{question}</span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    open ? "pb-5" : "h-0",
                )}
            >
                <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

const mockBalance = { availablePoints: 25000, pendingPoints: 5000, totalEarned: 75000, totalRedeemed: 45000 }

const mockTransactions = [
    { id: "mock_01", type: "earned" as const, points: 5000, description: "Order #ORD-12345", orderCode: 12345, status: "pending" as const, createdAt: "2026-06-23T10:00:00" },
    { id: "mock_02", type: "redeemed" as const, points: -10000, description: "Redeemed at checkout", orderCode: 12346, status: "completed" as const, createdAt: "2026-06-22T15:30:00" },
    { id: "mock_03", type: "earned" as const, points: 15000, description: "Order #ORD-12340", orderCode: 12340, status: "completed" as const, createdAt: "2026-06-20T09:00:00" },
]

export function LoyaltyPageContent() {
    const [openFaq, setOpenFaq] = useState<string | null>(null)
    const { data: balance, isLoading: isBalanceLoading } = usePointsBalance()
    const displayBalance = { ...mockBalance, ...(balance ?? {}) }
    const [txnPage, setTxnPage] = useState(1)
    const { data: txnData, isLoading: isTxnLoading, isError: isTxnError, error: txnError, refetch: refetchTxn } =
        usePointsTransactions({ page: txnPage, pageSize: 10 })

    const hasRealData = txnData && txnData.items?.length > 0
    const displayTransactions = hasRealData ? txnData!.items : mockTransactions
    const displayTotalPages = hasRealData ? txnData!.totalPages : 1
    const isLoadingDisplay = isTxnLoading
    const isErrorDisplay = isTxnError && !hasRealData && txnPage === 1

    return (
        <main className="flex-1">
            {/* Hero + Points History — side by side on desktop */}
            <section className="py-16 lg:py-20 px-4 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                        {/* Hero - left side */}
                        <div>
                            {isBalanceLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-16 mx-auto md:mx-0" />
                                    <Skeleton className="h-16 w-64" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 flex items-center justify-center border border-border rounded-full">
                                            <Award className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                            Loyalty Points
                                        </p>
                                    </div>
                                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4">
                                        {displayBalance.availablePoints.toLocaleString()}
                                        {displayBalance.pendingPoints > 0 && (
                                            <span className="text-muted-foreground/60 text-4xl md:text-5xl lg:text-6xl">
                                                {" "}(+ {displayBalance.pendingPoints.toLocaleString()} pending)
                                            </span>
                                        )}
                                        <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                                            points
                                        </span>
                                    </h1>
                                    <div className="flex gap-8 text-sm text-muted-foreground">
                                        <div>
                                            <p className="font-medium text-foreground">{displayBalance.totalEarned.toLocaleString()}</p>
                                            <p>Total earned</p>
                                        </div>
                                        <div className="w-px bg-border" />
                                        <div>
                                            <p className="font-medium text-foreground">{displayBalance.totalRedeemed.toLocaleString()}</p>
                                            <p>Total redeemed</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Points History - right side */}
                        <div>
                            <h2 className="font-serif text-2xl md:text-3xl mb-6 tracking-tight">
                                Points History
                            </h2>
                            <PointsTransactionList
                                transactions={displayTransactions}
                                totalPages={displayTotalPages}
                                currentPage={txnPage}
                                onPageChange={setTxnPage}
                                isLoading={isLoadingDisplay}
                                isError={isErrorDisplay}
                                error={(txnError as { message?: string })?.message}
                                onRetry={() => refetchTxn()}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 lg:py-20 px-4 lg:px-8 border-t border-border bg-muted/30">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="font-serif text-3xl md:text-4xl text-center mb-10 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="divide-y-0">
                        {faqs.map((faq) => (
                            <AccordionItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                                open={openFaq === faq.question}
                                onToggle={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
