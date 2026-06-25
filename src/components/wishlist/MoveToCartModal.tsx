"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Modal"
import { getProductImage, useImageErrorFallback } from "@/utils/imageHelpers"
import { formatPrice } from "@/utils/formatPrice"
import type { WishlistItem } from "@/types/wishlist"

interface MoveToCartModalProps {
    item: WishlistItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (variantId: string, quantity: number) => void
    isPending: boolean
}

export function MoveToCartModal({
    item,
    open,
    onOpenChange,
    onConfirm,
    isPending,
}: MoveToCartModalProps) {
    const [quantity, setQuantity] = useState(1)
    const [imgSrc, onImgError] = useImageErrorFallback(
        getProductImage(item?.productImageUrl ?? null),
    )

    // Reset quantity when modal opens with a new item
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) setQuantity(1)
        onOpenChange(isOpen)
    }

    if (!item) return null

    const maxQty = Math.max(1, item.stock)

    function decrement() {
        setQuantity((q) => Math.max(1, q - 1))
    }

    function increment() {
        setQuantity((q) => Math.min(maxQty, q + 1))
    }

    function handleConfirm() {
        if (!item) return
        onConfirm(item.productVariantId, quantity)
    }

    const subtotal = (item?.price ?? 0) * quantity

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md rounded-none">
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl">Move to Cart</DialogTitle>
                    <DialogDescription>
                        Select the quantity you&apos;d like to add to your cart.
                    </DialogDescription>
                </DialogHeader>

                {/* Product summary */}
                <div className="flex gap-4 py-4 border-t border-b border-border">
                    {/* Thumbnail */}
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted">
                        <Image
                            src={imgSrc}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                            onError={onImgError}
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center gap-1 min-w-0">
                        <p className="font-medium text-sm leading-snug line-clamp-2">
                            {item.productName}
                        </p>
                        {(item.color || item.size) && (
                            <p className="text-xs text-muted-foreground">
                                {[item.color, item.size].filter(Boolean).join(" / ")}
                            </p>
                        )}
                        <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
                    </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">Quantity</span>
                    <div className="flex items-center border border-border">
                        <button
                            type="button"
                            onClick={decrement}
                            disabled={quantity <= 1 || isPending}
                            className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-medium tabular-nums">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={increment}
                            disabled={quantity >= maxQty || isPending}
                            className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Stock hint */}
                {item.isLowStock && (
                    <p className="text-xs text-amber-600">
                        Only {item.stock} left in stock
                    </p>
                )}

                {/* Subtotal + actions */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-none"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-none"
                            onClick={handleConfirm}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Moving…
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Move to Cart
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
