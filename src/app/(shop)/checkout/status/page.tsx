"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Loader2, PackageSearch, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { buildUrl, PAYMENT_ENDPOINTS } from "@/constants/api"
import { ROUTES } from "@/constants/routes"

type PaymentStatus = "pending" | "completed" | "failed"

function extractOrderCode(params: URLSearchParams): string | null {
  function fromZaloPay(data: string | null): string | null {
    if (!data) return null
    try {
      const json = JSON.parse(decodeURIComponent(data))
      return json.app_trans_id?.split("_")[1] ?? null
    } catch {
      return null
    }
  }

  return (
    params.get("orderCode") ??
    params.get("vnp_TxnRef") ??
    (params.get("orderId")?.split("_")[0] ?? null) ??
    fromZaloPay(params.get("data"))
  )
}

function usePaymentStatus(orderCode: string | null) {
    const [status, setStatus] = useState<PaymentStatus>("pending")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!orderCode) return

        let cancelled = false
        let attempts = 0
        const MAX_ATTEMPTS = 30

        const poll = async () => {
            if (cancelled) return
            attempts++

            try {
                const res = await fetch(buildUrl(PAYMENT_ENDPOINTS.GET_STATUS(orderCode)))
                if (res.ok) {
                    const body = await res.json()
                    const paymentStatus = body.data?.status
                    if (paymentStatus === 1) {
                        if (!cancelled) setStatus("completed")
                        return
                    }
                    if (paymentStatus === 2) {
                        if (!cancelled) setStatus("failed")
                        return
                    }
                }
            } catch {
                // network error, retry
            }

            if (!cancelled) {
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(poll, 2000)
                } else {
                    setError("Payment result unavailable after multiple retries. Please check your orders.")
                }
            }
        }

        poll()

        return () => { cancelled = true }
    }, [orderCode])

    if (!orderCode) {
        return { status: "pending" as PaymentStatus, error: "No order code provided." }
    }

    return { status, error }
}

function CheckoutStatusContent() {
    const searchParams = useSearchParams()
    const orderCode = extractOrderCode(searchParams)
    const { status, error } = usePaymentStatus(orderCode)

    if (!orderCode) {
        return (
            <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-md text-center space-y-4">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <h1 className="font-serif text-2xl">Invalid payment link</h1>
                    <p className="text-sm text-muted-foreground">No order was specified.</p>
                    <Button asChild>
                        <Link href={ROUTES.ORDERS.INDEX}>View orders</Link>
                    </Button>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-md text-center space-y-4">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <h1 className="font-serif text-2xl">Something went wrong</h1>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button asChild>
                        <Link href={`${ROUTES.CHECKOUT.STATUS}?orderCode=${orderCode}`}>Retry</Link>
                    </Button>
                </div>
            </main>
        )
    }

    if (status === "pending") {
        return (
            <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-md text-center space-y-6">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Awaiting payment</p>
                        <h1 className="font-serif text-3xl">Waiting for payment confirmation</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        We are checking the payment status for order #{orderCode}. This page will update automatically.
                    </p>
                </div>
            </main>
        )
    }

    if (status === "completed") {
        return (
            <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Payment successful</p>
                        <h1 className="font-serif text-4xl md:text-5xl">Thank you for your purchase</h1>
                    </div>
                    <p className="text-muted-foreground">Your payment for order #{orderCode} has been confirmed.</p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button asChild size="lg">
                            <Link href={ROUTES.ORDERS.INDEX}>
                                <PackageSearch className="h-4 w-4" />
                                View orders
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={ROUTES.SHOP.PRODUCTS}>
                                <ShoppingBag className="h-4 w-4" />
                                Continue shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
                <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Payment failed</p>
                    <h1 className="font-serif text-4xl md:text-5xl">Payment could not be completed</h1>
                </div>
                <p className="text-muted-foreground">
                    Your payment for order #{orderCode} did not go through. Please try again or contact support.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild size="lg">
                        <Link href={ROUTES.CHECKOUT.INDEX}>Try checkout again</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href={ROUTES.ORDERS.INDEX}>
                            <PackageSearch className="h-4 w-4" />
                            View orders
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default function CheckoutStatusPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Loading...</div>}>
            <CheckoutStatusContent />
        </Suspense>
    )
}
