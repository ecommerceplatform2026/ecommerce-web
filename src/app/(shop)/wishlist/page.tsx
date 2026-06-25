"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, AlertCircle, PackageX, PackageCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"
import { Toast } from "@/components/ui/Toast"
import { useWishlistQuery, useRemoveFromWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import { ROUTES } from "@/constants/routes"
import { formatPrice } from "@/utils/formatPrice"
import { getProductImage, useImageErrorFallback } from "@/utils/imageHelpers"
import type { WishlistItem } from "@/types/wishlist"

// ---------------------------------------------------------------------------
// Single wishlist card
// ---------------------------------------------------------------------------

function WishlistCard({ item }: { item: WishlistItem }) {
    const removeMutation = useRemoveFromWishlist()
    const { addItem } = useCart()

    const [imgSrc, onImgError] = useImageErrorFallback(
        getProductImage(item.productImageUrl),
    )

    async function handleAddToCart() {
        if (item.isOutOfStock) {
            Toast("This item is out of stock", "error")
            return
        }
        try {
            await addItem({
                productId: item.productId,
                variantId: item.productVariantId,
                sku: item.sku,
                name: item.productName,
                price: item.price,
                size: item.size ?? "",
                color: item.color ?? "",
                quantity: 1,
                stock: item.stock,
                isOutOfStock: item.isOutOfStock,
                isLowStock: item.isLowStock,
                imageUrl: item.productImageUrl,
            })
            Toast(`Added ${item.productName} to cart`)
        } catch {
            Toast("Could not add to cart", "error")
        }
    }

    function handleRemove(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        removeMutation.mutate(item.productVariantId)
    }

    const isRemoving = removeMutation.isPending

    return (
        <div className="group border border-border bg-card">
            {/* Product image */}
            <Link
                href={item.productId ? ROUTES.SHOP.PRODUCT_DETAIL(item.productId) : "#"}
                className="relative block aspect-[3/4] overflow-hidden bg-muted"
            >
                <Image
                    src={imgSrc}
                    alt={item.productName}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={onImgError}
                />

                {/* Out of stock overlay */}
                {item.isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <span className="border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Out of stock
                        </span>
                    </div>
                )}

                {/* Remove button — same styling as wishlist button in ProductCard */}
                <Button
                    id={`wishlist-remove-${item.productVariantId}`}
                    size="icon"
                    aria-label={`Remove ${item.productName} from wishlist`}
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="absolute right-3 top-3 min-h-[44px] min-w-[44px] border border-border bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground rounded-none disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </Link>

            {/* Product info */}
            <div className="space-y-3 p-4">
                <div className="space-y-1">
                    {/* Category-like label (reuse ProductCard pattern) */}
                    {(item.color || item.size) && (
                        <p className="text-xs tracking-widest text-muted-foreground uppercase">
                            {[item.color, item.size].filter(Boolean).join(" / ")}
                        </p>
                    )}

                    <Link
                        href={item.productId ? ROUTES.SHOP.PRODUCT_DETAIL(item.productId) : "#"}
                        className="block font-serif text-xl leading-snug hover:text-muted-foreground transition-colors line-clamp-2"
                    >
                        {item.productName}
                    </Link>

                    <p className="text-lg">{formatPrice(item.price)}</p>

                    {/* Stock status — same pattern as ProductDetails */}
                    <div className="flex items-center gap-1.5 text-xs pt-0.5">
                        {item.isOutOfStock ? (
                            <>
                                <PackageX className="h-3.5 w-3.5 text-destructive" />
                                <span className="text-destructive">Out of stock</span>
                            </>
                        ) : item.isLowStock ? (
                            <>
                                <PackageCheck className="h-3.5 w-3.5 text-amber-600" />
                                <span className="text-amber-600">Low stock ({item.stock} left)</span>
                            </>
                        ) : (
                            <>
                                <PackageCheck className="h-3.5 w-3.5 text-green-600" />
                                <span className="text-green-600">In stock</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Add to cart */}
                <Button
                    id={`wishlist-add-to-cart-${item.productVariantId}`}
                    className="w-full min-h-[44px] bg-background text-foreground hover:bg-background/90 border border-border rounded-none disabled:opacity-50 text-sm flex items-center gap-2"
                    disabled={item.isOutOfStock}
                    onClick={handleAddToCart}
                >
                    <ShoppingBag className="h-4 w-4 shrink-0" />
                    <span>{item.isOutOfStock ? "Out of stock" : "Add to cart"}</span>
                </Button>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Skeleton loader grid — same as orders/cart page pattern
// ---------------------------------------------------------------------------

function WishlistSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 lg:px-8">
            <div className="mb-8 border-b border-border pb-4">
                <Skeleton className="h-12 w-48 rounded-none mb-2" />
                <Skeleton className="h-4 w-32 rounded-none" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[3/4] w-full rounded-none" />
                        <Skeleton className="h-4 w-1/3 rounded-none" />
                        <Skeleton className="h-6 w-3/4 rounded-none" />
                        <Skeleton className="h-5 w-1/4 rounded-none" />
                        <Skeleton className="h-11 w-full rounded-none" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------

function WishlistContent() {
    const { data: items = [], isLoading, error, refetch } = useWishlistQuery()

    if (isLoading) {
        return <WishlistSkeleton />
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8 max-w-md text-center">
                <div className="border border-destructive/20 bg-destructive/5 p-8 space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h3 className="font-serif text-2xl text-destructive">Failed to Load Wishlist</h3>
                    <p className="text-sm text-muted-foreground">
                        An error occurred while fetching your wishlist.
                    </p>
                    <Button onClick={() => refetch()} className="rounded-none w-full">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <EmptyState
                    icon={<Heart className="h-10 w-10 text-muted-foreground opacity-40" />}
                    title="Your wishlist is empty"
                    description="Save items you love to your wishlist and revisit them anytime."
                    action={
                        <Button asChild className="rounded-none">
                            <Link href={ROUTES.SHOP.PRODUCTS}>Explore Products</Link>
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8">
            {/* Page header — same pattern as /orders */}
            <div className="mb-8 border-b border-border pb-4">
                <h1 className="font-serif text-4xl md:text-5xl">My Wishlist</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                    <WishlistCard key={item.id} item={item} />
                ))}
            </div>

            {/* CTA */}
            <div className="mt-12 flex justify-center">
                <Button asChild variant="outline" className="rounded-none bg-transparent">
                    <Link href={ROUTES.SHOP.PRODUCTS}>Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function WishlistPage() {
    return (
        <Suspense fallback={<WishlistSkeleton />}>
            <WishlistContent />
        </Suspense>
    )
}
