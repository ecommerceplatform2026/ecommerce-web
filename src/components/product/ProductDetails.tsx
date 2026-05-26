"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Check, Minus, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { ProductStatus } from "@/constants/enums"
import { useCart } from "@/hooks/useCart"
import type { ProductDetail, ProductDetailVariant } from "@/types/product"
import { ProductImageGallery } from "./ProductImageGallery"

interface ProductDetailsProps {
    product: ProductDetail
}

function uniqueValues(values: Array<string | null>): string[] {
    return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function variantMatches(
    variant: ProductDetailVariant,
    size: string | null,
    color: string | null,
    hasSizes: boolean,
    hasColors: boolean,
) {
    return (!hasSizes || variant.size === size) && (!hasColors || variant.color === color)
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const variants = product.variants ?? []
    const sizes = useMemo(() => uniqueValues(variants.map(variant => variant.size)), [variants])
    const colors = useMemo(() => uniqueValues(variants.map(variant => variant.color)), [variants])

    const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null)
    const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const { addItem } = useCart()

    const selectedVariant = useMemo(
        () =>
            variants.find(variant =>
                variantMatches(variant, selectedSize, selectedColor, sizes.length > 0, colors.length > 0),
            ) ?? null,
        [colors.length, selectedColor, selectedSize, sizes.length, variants],
    )

    const displayPrice = selectedVariant?.price ?? product.price ?? product.basePrice
    const isInactive = product.status === ProductStatus.Inactive
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.totalStock <= 0
    const needsVariant = variants.length > 0 && !selectedVariant
    const maxQuantity = Math.max(selectedVariant?.stock ?? product.totalStock ?? 1, 1)

    function hasAvailableVariant(size: string | null, color: string | null) {
        return variants.some(variant =>
            variantMatches(variant, size, color, sizes.length > 0, colors.length > 0) &&
            variant.stock > 0,
        )
    }

    function handleAddToCart() {
        if (needsVariant) {
            toast.error("Vui lòng chọn đầy đủ size và màu sắc")
            return
        }

        if (!selectedVariant || isOutOfStock || isInactive) {
            toast.error("Sản phẩm hiện không có sẵn")
            return
        }

        const finalQuantity = Math.min(quantity, maxQuantity)
        addItem({
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price: selectedVariant.price,
            size: selectedVariant.size ?? "",
            color: selectedVariant.color ?? "",
            quantity: finalQuantity,
            imageUrl: product.images[0]?.imageUrl ?? null,
        })
        toast.success(`Đã thêm ${finalQuantity} x ${product.name} vào giỏ hàng`)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <div className="container mx-auto px-4 py-16 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                <ProductImageGallery images={product.images} productName={product.name} />

                <div className="space-y-8">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                            {product.categoryName ?? ""}
                        </p>
                        <h1 className="mb-4 font-serif text-4xl md:text-5xl">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl">{displayPrice.toLocaleString("vi-VN")}₫</p>
                            {isInactive && (
                                <span className="border border-destructive px-2 py-1 text-xs uppercase tracking-wide text-destructive">
                                    Ngừng kinh doanh
                                </span>
                            )}
                        </div>
                    </div>

                    {product.description && (
                        <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                    )}

                    {sizes.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium tracking-wide">Kích cỡ</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map(size => {
                                    const available = hasAvailableVariant(size, selectedColor)
                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            disabled={!available}
                                            onClick={() => setSelectedSize(size)}
                                            className={`border px-4 py-2 text-sm transition-colors ${
                                                selectedSize === size
                                                    ? "border-foreground bg-foreground text-background"
                                                    : available
                                                    ? "border-border hover:border-foreground"
                                                    : "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {colors.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium tracking-wide">Màu sắc</p>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(color => {
                                    const available = hasAvailableVariant(selectedSize, color)
                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            disabled={!available}
                                            onClick={() => setSelectedColor(color)}
                                            className={`border px-4 py-2 text-sm transition-colors ${
                                                selectedColor === color
                                                    ? "border-foreground bg-foreground text-background"
                                                    : available
                                                    ? "border-border hover:border-foreground"
                                                    : "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="text-sm">
                        {needsVariant ? (
                            <p className="text-amber-600">Vui lòng chọn biến thể để xem tồn kho</p>
                        ) : isOutOfStock ? (
                            <p className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                Hết hàng
                            </p>
                        ) : (
                            <p className="text-green-600">Còn hàng ({selectedVariant?.stock ?? product.totalStock})</p>
                        )}
                    </div>

                    {product.material && (
                        <div className="border-t border-border pt-6 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Chất liệu:</span> {product.material}
                        </div>
                    )}

                    <div className="space-y-3">
                        <p className="text-sm font-medium tracking-wide">Số lượng</p>
                        <div className="flex w-fit items-center border border-border">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                                disabled={quantity <= 1}
                                className="h-12 w-12 rounded-none"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex h-12 w-16 items-center justify-center border-x border-border">
                                {quantity}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(prev => Math.min(prev + 1, maxQuantity))}
                                disabled={quantity >= maxQuantity}
                                className="h-12 w-12 rounded-none"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="h-14 w-full text-base"
                        onClick={handleAddToCart}
                        disabled={added || needsVariant || isOutOfStock || isInactive}
                    >
                        {added ? (
                            <>
                                <Check className="h-5 w-5" />
                                Đã thêm vào giỏ
                            </>
                        ) : isOutOfStock ? (
                            "Hết hàng"
                        ) : (
                            "Thêm vào giỏ hàng"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
