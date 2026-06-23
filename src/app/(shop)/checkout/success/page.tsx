"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ExternalLink, PackageSearch, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { PaymentMethod, PAYMENT_METHOD_LABEL } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} VND`
}

function CheckoutSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const orderCode = searchParams.get("orderCode")
    const totalAmount = Number(searchParams.get("totalAmount"))
    const checkoutUrl = searchParams.get("checkoutUrl")
    const paymentMethodRaw = Number(searchParams.get("paymentMethod"))
    const paymentMethod = Number.isFinite(paymentMethodRaw)
        ? PAYMENT_METHOD_LABEL[paymentMethodRaw as PaymentMethod]
        : null

    return (
        <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
                <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Order placed</p>
                    <h1 className="font-serif text-4xl md:text-5xl">Checkout successful</h1>
                </div>
                <p className="text-muted-foreground">
                    Your order has been created. We will process it and update your order history shortly.
                </p>

                <div className="mx-auto max-w-md rounded-md border border-border p-4 text-left text-sm">
                    {orderCode && (
                        <div className="flex justify-between gap-4 py-2">
                            <span className="shrink-0 text-muted-foreground">Order code</span>
                            <span className="truncate font-medium">{orderCode}</span>
                        </div>
                    )}
                    {orderId && (
                        <div className="flex justify-between gap-4 py-2">
                            <span className="shrink-0 text-muted-foreground">Order ID</span>
                            <span className="truncate font-medium">{orderId}</span>
                        </div>
                    )}
                    {paymentMethod && (
                        <div className="flex justify-between gap-4 py-2">
                            <span className="shrink-0 text-muted-foreground">Payment</span>
                            <span className="truncate font-medium">{paymentMethod}</span>
                        </div>
                    )}
                    {Number.isFinite(totalAmount) && totalAmount > 0 && (
                        <div className="flex justify-between gap-4 py-2">
                            <span className="shrink-0 text-muted-foreground">Total</span>
                            <span className="truncate font-medium">{formatCurrency(totalAmount)}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {checkoutUrl && (
                        <Button asChild size="lg">
                            <a href={checkoutUrl} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Pay now
                            </a>
                        </Button>
                    )}
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

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Loading...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
