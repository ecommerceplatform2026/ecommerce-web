"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import { getProductImage, useImageErrorFallback } from "@/utils/imageHelpers"
import toast from "react-hot-toast"
import type { Product } from "@/types/product"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { toggleItem, isInWishlist } = useWishlist()
    const { addItem } = useCart()
    const inWishlist = isInWishlist(product.id)
    const [imgSrc, onImgError] = useImageErrorFallback(getProductImage(product.imageUrl))

    const firstVariant = product.variants?.[0]

    async function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        if (!firstVariant) return
        if (firstVariant.isOutOfStock || firstVariant.stock <= 0) {
            toast.error("Product is out of stock")
            return
        }

        try {
            await addItem({
                productId: product.id,
                variantId: firstVariant.id,
                sku: firstVariant.sku,
                name: product.name,
                price: firstVariant.price,
                size: firstVariant.size ?? "",
                color: firstVariant.color ?? "",
                quantity: 1,
                stock: firstVariant.stock,
                isLowStock: firstVariant.isLowStock,
                isOutOfStock: firstVariant.isOutOfStock,
                imageUrl: product.imageUrl ?? null,
            })
            toast.success(
                <div className="flex items-center gap-2">
                    <span>Added {product.name}</span>
                    <Link href={ROUTES.CART} className="ml-2 underline font-medium whitespace-nowrap">
                        View Cart
                    </Link>
                </div>,
                { duration: 4000 },
            )
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Unable to add product to cart.')
        }
    }

    function handleWishlist(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist")
    }

    return (
        <Link
            href={ROUTES.SHOP.PRODUCT_DETAIL(product.id)}
            className="group block"
        >
            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-muted">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                    onError={onImgError}
                />

                <Button
                    onClick={handleWishlist}
                    size="icon"
                    className={`absolute top-3 right-3 min-h-[44px] min-w-[44px] border border-border rounded-none ${inWishlist ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background text-foreground hover:bg-background/90"}`}
                >
                    <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                </Button>
                <div className="absolute bottom-4 left-0 right-0 flex px-6">
                    <Button
                        onClick={handleQuickAdd}
                        disabled={!firstVariant || firstVariant.isOutOfStock}
                        className="w-full min-h-[44px] bg-background text-foreground hover:bg-background/90 border border-border rounded-none disabled:opacity-50 text-sm flex items-center gap-2"
                    >
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        <span>Add to cart</span>
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {product.categoryName ?? ""}
                </p>
                <h3 className="font-serif text-xl truncate group-hover:text-muted-foreground transition-colors">
                    {product.name}
                </h3>
                <p className="text-lg">
                    {product.basePrice.toLocaleString("vi-VN")}₫
                </p>
            </div>
        </Link>
    )
}
