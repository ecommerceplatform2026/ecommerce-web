"use client"

import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { ROUTES } from "@/constants/routes"
import { CheckoutItemImage } from "@/components/checkout/CheckoutItemImage"

const FREE_SHIPPING_THRESHOLD = 2_000_000
const SHIPPING_COST = 30_000

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} VND`
}

interface OrderSummaryProps {
    loyaltyDiscount?: number
    subtotalAfterDiscount?: number
}

export function OrderSummary({ loyaltyDiscount = 0, subtotalAfterDiscount }: OrderSummaryProps) {
    const { items, totalPrice, itemCount } = useCart()

    const shipping = items.length === 0 || totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const discountedSubtotal = Math.max(subtotalAfterDiscount ?? totalPrice, 0)
    const total = discountedSubtotal + shipping
    const hasLoyaltyDiscount = loyaltyDiscount > 0

    return (
        <div className="border border-border p-6 bg-card space-y-6">
            <h2 className="font-serif text-2xl border-b border-border pb-3">Order Summary</h2>

            {/* Items list */}
            <div className="max-h-80 overflow-y-auto space-y-4 divide-y divide-border pr-2 scrollbar-thin">
                {items.map((item, idx) => (
                    <div key={item.variantId} className={`flex gap-3 ${idx > 0 ? "pt-4" : ""}`}>
                        <div className="w-16 shrink-0">
                            <CheckoutItemImage item={item} />
                        </div>
                        <div className="flex-1 min-w-0 text-sm">
                            <Link
                                href={ROUTES.SHOP.PRODUCT_DETAIL(item.productId)}
                                className="font-serif font-medium hover:text-muted-foreground block truncate"
                            >
                                {item.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {[item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null]
                                    .filter(Boolean)
                                    .join(" / ")}
                            </p>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className="text-muted-foreground">Qty: {item.quantity}</span>
                                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-border pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
                {hasLoyaltyDiscount && (
                    <div className="flex justify-between text-emerald-700">
                        <span>Loyalty discount</span>
                        <span>-{formatCurrency(loyaltyDiscount)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>

                {shipping > 0 && (
                    <p className="text-[11px] text-muted-foreground italic">
                        Add {formatCurrency(FREE_SHIPPING_THRESHOLD - totalPrice)} more for free shipping.
                    </p>
                )}
            </div>

            {/* Total */}
            <div className="border-t border-border pt-4 flex justify-between items-end">
                <span className="font-medium text-base">Total</span>
                <span className="font-serif text-xl font-bold">{formatCurrency(total)}</span>
            </div>
        </div>
    )
}
