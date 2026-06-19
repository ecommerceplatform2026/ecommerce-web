"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { AlertTriangle, Banknote, CreditCard, Loader2, PackageCheck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { PaymentMethod } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"
import { useCart } from "@/hooks/useCart"
import { orderService } from "@/services/orderService"
import type { ApiError } from "@/types/api"
import type { CheckoutFormValues } from "@/types/order"

const checkoutSchema = z.object({
    paymentMethod: z.nativeEnum(PaymentMethod),
})

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} VND`
}

function getErrorMessage(error: unknown) {
    const apiError = error as ApiError
    return apiError.message ?? apiError.errors?.[0] ?? "Unable to place order. Please try again."
}

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice, itemCount, isLoading, error, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const hasInvalidItems = items.some(item => item.isOutOfStock || item.stock <= 0 || item.quantity > item.stock)

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: PaymentMethod.COD,
        },
    })

    const selectedPayment = useWatch({ control, name: "paymentMethod" })
    const orderItems = useMemo(() => items, [items])

    async function onSubmit(values: CheckoutFormValues) {
        if (items.length === 0) {
            router.push(ROUTES.CART)
            return
        }

        if (hasInvalidItems) {
            toast.error("Review your cart before checkout. Some items are unavailable or exceed stock.")
            return
        }

        setIsSubmitting(true)
        try {
            const order = await orderService.create({
                paymentMethod: values.paymentMethod,
            })

            clearCart()

            const params = new URLSearchParams()
            params.set("orderId", order.orderId)
            params.set("orderCode", String(order.orderCode))
            params.set("totalAmount", String(order.totalAmount))
            params.set("paymentMethod", String(order.paymentMethod))
            if (order.checkoutUrl) params.set("checkoutUrl", order.checkoutUrl)

            router.push(`${ROUTES.CHECKOUT.SUCCESS}?${params.toString()}`)
        } catch (error) {
            const params = new URLSearchParams()
            params.set("reason", getErrorMessage(error))
            router.push(`${ROUTES.CHECKOUT.FAILED}?${params.toString()}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading && items.length === 0) {
        return (
            <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (items.length === 0) {
        return (
            <main className="container mx-auto px-4 py-24 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-5 text-center">
                    <PackageCheck className="mx-auto h-14 w-14 text-muted-foreground opacity-50" />
                    <h1 className="font-serif text-4xl md:text-5xl">Your cart is empty</h1>
                    <p className="text-muted-foreground">
                        Add items to your cart before starting checkout.
                    </p>
                    <Button asChild size="lg">
                        <Link href={ROUTES.SHOP.PRODUCTS}>Continue shopping</Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-10 lg:px-8 lg:py-14">
            <div className="mb-8 border-b border-border pb-6">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Secure checkout</p>
                <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                    Review your cart, choose a payment method, and place your order.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
                <div className="space-y-8">
                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <h2 className="font-serif text-2xl">Payment method</h2>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setValue("paymentMethod", PaymentMethod.COD, { shouldValidate: true })}
                                className={`min-h-28 rounded-md border p-4 text-left transition-colors ${
                                    selectedPayment === PaymentMethod.COD
                                        ? "border-foreground bg-secondary"
                                        : "border-border hover:border-muted-foreground"
                                }`}
                            >
                                <Banknote className="mb-3 h-5 w-5" />
                                <p className="font-medium">Cash on delivery</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Pay when your order arrives.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("paymentMethod", PaymentMethod.PayOS, { shouldValidate: true })}
                                className={`min-h-28 rounded-md border p-4 text-left transition-colors ${
                                    selectedPayment === PaymentMethod.PayOS
                                        ? "border-foreground bg-secondary"
                                        : "border-border hover:border-muted-foreground"
                                }`}
                            >
                                <CreditCard className="mb-3 h-5 w-5" />
                                <p className="font-medium">Online payment</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create the order and continue from the returned payment link.
                                </p>
                            </button>
                        </div>
                        {errors.paymentMethod && (
                            <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
                        )}
                    </section>
                </div>

                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="space-y-6 rounded-md border border-border p-5">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="font-serif text-2xl">Order summary</h2>
                            <span className="text-sm text-muted-foreground">{itemCount} item(s)</span>
                        </div>

                        <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
                            {orderItems.map(item => (
                                <div key={item.variantId} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                                        <Image
                                            src={item.imageUrl || "/placeholder.svg"}
                                            alt={item.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{item.name}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.size || "Size"} / {item.color || "Color"} x {item.quantity}
                                        </p>
                                        <p className="mt-2 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                        {(item.isOutOfStock || item.quantity > item.stock) && (
                                            <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                                                <AlertTriangle className="h-3 w-3" />
                                                Review stock before checkout.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-border pt-5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-4 text-base font-medium">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>

                        <div className="rounded-md bg-secondary p-3 text-xs text-muted-foreground">
                            <div className="flex gap-2">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>Your order will be created from the authenticated cart with the selected payment method.</p>
                            </div>
                        </div>

                        {/* Desktop: inline buttons */}
                        <div className="hidden lg:block space-y-3">
                            <Button
                                type="submit"
                                size="lg"
                                className="h-13 w-full text-base"
                                disabled={isSubmitting || hasInvalidItems}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Placing order...
                                    </>
                                ) : (
                                    "Place order"
                                )}
                            </Button>

                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href={ROUTES.CART}>Back to cart</Link>
                            </Button>
                        </div>
                    </div>
                </aside>
            </form>

            {/* Mobile: sticky bottom action bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 py-3 lg:hidden">
                <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-medium">{formatCurrency(totalPrice)}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            className="min-h-[44px] text-base"
                            disabled={isSubmitting || hasInvalidItems}
                            onClick={() => handleSubmit(onSubmit)()}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Place order"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
