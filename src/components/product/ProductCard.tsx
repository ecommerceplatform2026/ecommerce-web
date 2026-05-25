"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import toast from "react-hot-toast"
import type { Product } from "@/types/product"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { toggleItem, isInWishlist } = useWishlist()
    const { addItem } = useCart()
    const inWishlist = isInWishlist(product.id)

    const firstVariant = product.variants?.[0]

    function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        if (!firstVariant) return
        addItem({
            productId: product.id,
            variantId: firstVariant.id,
            name: product.name,
            price: firstVariant.price,
            size: firstVariant.size ?? "",
            color: firstVariant.color ?? "",
            quantity: 1,
            imageUrl: null,
        })
        toast.success(`Đã thêm vào giỏ hàng`)
    }

    function handleWishlist(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
        toast.success(inWishlist ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích")
    }

    return (
        <Link
            href={ROUTES.SHOP.PRODUCT_DETAIL(product.id)}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-secondary">
                <Image
                    src="/placeholder.svg"
                    alt={product.name}
                    fill
                    className={`object-cover transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-100"}`}
                />

                <div
                    className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                >
                    <Button
                        onClick={handleQuickAdd}
                        disabled={!firstVariant || firstVariant.isOutOfStock}
                        className="flex-1 h-12 bg-background text-foreground hover:bg-background/90 border border-border rounded-none disabled:opacity-50"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Thêm vào giỏ
                    </Button>
                    <Button
                        onClick={handleWishlist}
                        size="icon"
                        className={`h-12 w-12 border border-border rounded-none ${
                            inWishlist
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-background text-foreground hover:bg-background/90"
                        }`}
                    >
                        <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {product.categoryName ?? ""}
                </p>
                <h3 className="font-serif text-xl group-hover:text-muted-foreground transition-colors">
                    {product.name}
                </h3>
                <p className="text-lg">
                    {product.basePrice.toLocaleString("vi-VN")}₫
                </p>
            </div>
        </Link>
    )
}
