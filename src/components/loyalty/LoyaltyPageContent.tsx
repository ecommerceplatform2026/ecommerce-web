"use client"

import { useState } from "react"
import { Gift, ShoppingBag, TrendingUp, ChevronDown, Award } from "lucide-react"
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

export function LoyaltyPageContent() {
    const [openFaq, setOpenFaq] = useState<string | null>(null)
    const { data: balance, isLoading: isBalanceLoading } = usePointsBalance()
    const [txnPage, setTxnPage] = useState(1)
    const { data: txnData, isLoading: isTxnLoading, isError: isTxnError, error: txnError, refetch: refetchTxn } =
        usePointsTransactions({ page: txnPage, pageSize: 10 })

    return (
        <main className="flex-1">
            {/* Hero */}
            <section className="py-20 lg:py-24 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto max-w-3xl text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 flex items-center justify-center border border-border rounded-full">
                            <Award className="h-6 w-6" />
                        </div>
                    </div>
                    {isBalanceLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-16 w-72 mx-auto" />
                            <Skeleton className="h-5 w-48 mx-auto" />
                        </div>
                    ) : (
                        <>
                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4">
                                {(balance?.availablePoints ?? 0).toLocaleString()}
                                {(balance?.pendingPoints ?? 0) > 0 && (
                                    <span className="text-muted-foreground/60 text-4xl md:text-5xl lg:text-6xl">
                                        {" "}(+ {(balance?.pendingPoints ?? 0).toLocaleString()} pending)
                                    </span>
                                )}
                                <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                                    points
                                </span>
                            </h1>
                            <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
                                <div>
                                    <p className="font-medium text-foreground">{(balance?.totalEarned ?? 0).toLocaleString()}</p>
                                    <p>Total earned</p>
                                </div>
                                <div className="w-px bg-border" />
                                <div>
                                    <p className="font-medium text-foreground">{(balance?.totalRedeemed ?? 0).toLocaleString()}</p>
                                    <p>Total redeemed</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 lg:py-20 px-4 lg:px-8">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 tracking-tight">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-border rounded-full">
                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-sm tracking-wide">How to Earn</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Earn points on every completed order. The more you shop, the more you earn.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-border rounded-full">
                                <Gift className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-sm tracking-wide">How to Redeem</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Use your points at checkout for instant discounts on your purchases.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-border rounded-full">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-sm tracking-wide">Points Value</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                1 point = 1,000 VND. Simple and transparent.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 lg:py-20 px-4 lg:px-8 border-y border-border bg-muted/30">
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

            {/* Points History */}
            <section className="py-16 lg:py-20 px-4 lg:px-8">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="font-serif text-3xl md:text-4xl mb-10 tracking-tight">
                        Points History
                    </h2>
                    <PointsTransactionList
                        transactions={txnData?.items ?? []}
                        totalPages={txnData?.totalPages ?? 1}
                        currentPage={txnPage}
                        onPageChange={setTxnPage}
                        isLoading={isTxnLoading}
                        isError={isTxnError}
                        error={(txnError as { message?: string })?.message}
                        onRetry={() => refetchTxn()}
                    />
                </div>
            </section>
        </main>
    )
}
