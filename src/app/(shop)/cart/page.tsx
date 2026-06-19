"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"
import { useCart } from "@/hooks/useCart"
import type { CartItem } from "@/types/cart"

const ITEMS_PER_PAGE = 5
const FREE_SHIPPING_THRESHOLD = 2_000_000
const SHIPPING_COST = 30_000

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} VND`
}

function itemVariantLabel(item: CartItem) {
    const parts = [
        item.size ? `Size: ${item.size}` : null,
        item.color ? `Color: ${item.color}` : null,
        item.sku ? `SKU: ${item.sku}` : null,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(" / ") : "Selected variant"
}

export default function CartPage() {
    const { items, totalPrice, itemCount, isLoading, error, updateQuantity, removeItem } = useCart()
    const [currentPage, setCurrentPage] = useState(1)
    const [pendingVariantId, setPendingVariantId] = useState<string | null>(null)

    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const paginatedItems = useMemo(
        () => items.slice((safeCurrentPage - 1) * ITEMS_PER_PAGE, safeCurrentPage * ITEMS_PER_PAGE),
        [items, safeCurrentPage],
    )

    const shipping = items.length === 0 || totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = totalPrice + shipping

    async function handleQuantityChange(item: CartItem, quantity: number) {
        if (quantity < 1) return
        if (item.isOutOfStock || item.stock <= 0) {
            toast.error("This variant is out of stock.")
            return
        }
        if (quantity > item.stock) {
            toast.error(`Only ${item.stock} item(s) available for this variant.`)
            return
        }

        setPendingVariantId(item.variantId)
        try {
            await updateQuantity(item.variantId, quantity)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unable to update cart item.")
        } finally {
            setPendingVariantId(null)
        }
    }

    async function handleRemove(item: CartItem) {
        setPendingVariantId(item.variantId)
        try {
            await removeItem(item.variantId)
            toast.success("Removed from cart.")
            setCurrentPage(page => {
                const nextCount = Math.max(0, items.length - 1)
                const nextPages = Math.max(1, Math.ceil(nextCount / ITEMS_PER_PAGE))
                return Math.min(page, nextPages)
            })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unable to remove cart item.")
        } finally {
            setPendingVariantId(null)
        }
    }

    if (isLoading && items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-36 animate-pulse bg-secondary" />
                    ))}
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                    <h1 className="font-serif text-4xl md:text-5xl">Your cart is empty</h1>
                    <p className="text-lg text-muted-foreground">
                        Add products to your cart and review them here before checkout.
                    </p>
                    <Button asChild size="lg">
                        <Link href={ROUTES.SHOP.PRODUCTS}>Continue shopping</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <div className="mb-10 flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl">Cart</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {itemCount} item{itemCount === 1 ? "" : "s"} ready for review
                    </p>
                </div>
                {error && (
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6 pb-28 lg:pb-0">
                    {paginatedItems.map(item => {
                        const lineTotal = item.price * item.quantity
                        const isPending = pendingVariantId === item.variantId
                        const cannotIncrease = !!item.isOutOfStock || item.stock <= 0 || isPending
                        const isAtStockLimit = item.quantity >= item.stock

                        return (
                            <div
                                key={item.variantId}
                                className="flex flex-col sm:grid sm:grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-border pb-6"
                            >
                                <Link
                                    href={ROUTES.SHOP.PRODUCT_DETAIL(item.productId)}
                                    className="relative aspect-[3/4] w-full sm:w-28 overflow-hidden bg-secondary"
                                >
                                    <Image
                                        src={item.imageUrl || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 112px"
                                        className="object-cover"
                                    />
                                </Link>

                                <div className="min-w-0 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <Link
                                                href={ROUTES.SHOP.PRODUCT_DETAIL(item.productId)}
                                                className="font-serif text-xl transition-colors hover:text-muted-foreground"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {itemVariantLabel(item)}
                                            </p>
                                            {(item.isOutOfStock || item.quantity > item.stock) && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span>
                                                        {item.isOutOfStock
                                                            ? "This variant is out of stock."
                                                            : `Only ${item.stock} item(s) available.`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(item)}
                                            disabled={isPending}
                                            aria-label={`Remove ${item.name}`}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex w-fit items-center border border-border">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || isPending}
                                                className="min-h-[44px] min-w-[44px] rounded-none"
                                                aria-label={`Decrease ${item.name} quantity`}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="flex h-[44px] w-14 items-center justify-center border-x border-border text-sm font-medium">
                                                {item.quantity}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                disabled={cannotIncrease}
                                                aria-disabled={isAtStockLimit || cannotIncrease}
                                                className={`min-h-[44px] min-w-[44px] rounded-none ${
                                                    isAtStockLimit ? "opacity-50" : ""
                                                }`}
                                                aria-label={`Increase ${item.name} quantity`}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(item.price)} each
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatCurrency(lineTotal)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                disabled={safeCurrentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {safeCurrentPage} / {totalPages}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                disabled={safeCurrentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>

                <aside className="lg:sticky lg:top-24">
                    <div className="space-y-6 border border-border p-6">
                        <h2 className="font-serif text-2xl">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping fee</span>
                                <span className={shipping === 0 ? "font-medium text-green-600" : ""}>
                                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Free shipping for orders from {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
                                </p>
                            )}
                        </div>

                        <div className="border-y border-border py-5">
                            <div className="flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Button asChild size="lg" className="h-14 w-full text-base">
                            <Link href={ROUTES.CHECKOUT.INDEX}>Proceed to checkout</Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                            <Link href={ROUTES.SHOP.PRODUCTS}>Continue shopping</Link>
                        </Button>
                    </div>
                </aside>
            </div>

            {/* Mobile sticky checkout bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-4 lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{itemCount} item(s)</p>
                        <p className="text-lg font-medium">{formatCurrency(total)}</p>
                    </div>
                    <Button asChild size="lg" className="h-14 shrink-0 text-base">
                        <Link href={ROUTES.CHECKOUT.INDEX}>Proceed to checkout</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
