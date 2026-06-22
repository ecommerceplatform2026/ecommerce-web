"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Check, Minus, PackageCheck, PackageX, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { ProductStatus } from "@/constants/enums"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { cartService } from "@/services/cartService"
import { formatPrice } from "@/utils/formatPrice"
import type { ApiError } from "@/types/api"
import type { CartItem } from "@/types/cart"
import type { ProductDetail, ProductDetailVariant } from "@/types/product"
import { ProductImageGallery } from "./ProductImageGallery"
import { ReviewSection } from "@/components/review/ReviewSection"

interface ProductDetailsProps {
    product: ProductDetail
}

function uniqueValues(values: Array<string | null | undefined>): string[] {
    return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))))
}

function variantHasStock(variant: ProductDetailVariant): boolean {
    return variant.stock > 0 && variant.stockStatus !== "OutOfStock"
}

function isInactiveStatus(status: ProductDetail["status"]): boolean {
    return status === ProductStatus.Inactive || String(status).toLowerCase() === "inactive"
}

function findVariant(
    variants: ProductDetailVariant[],
    size: string | null,
    color: string | null,
    hasSizes: boolean,
    hasColors: boolean,
) {
    if ((hasSizes && !size) || (hasColors && !color)) return null

    return variants.find(variant =>
        (!hasSizes || variant.size === size) &&
        (!hasColors || variant.color === color),
    ) ?? null
}

function hasVariantForSelection(
    variants: ProductDetailVariant[],
    size: string | null,
    color: string | null,
) {
    return variants.some(variant =>
        (!size || variant.size === size) &&
        (!color || variant.color === color),
    )
}

function hasStockForValue(
    variants: ProductDetailVariant[],
    key: "size" | "color",
    value: string,
) {
    return variants.some(variant => variant[key] === value && variantHasStock(variant))
}

function findFirstAvailableForColor(variants: ProductDetailVariant[], color: string) {
    return variants.find(variant => variant.color === color && variantHasStock(variant))
        ?? variants.find(variant => variant.color === color)
        ?? null
}

function findFirstAvailableForSize(variants: ProductDetailVariant[], size: string) {
    return variants.find(variant => variant.size === size && variantHasStock(variant))
        ?? variants.find(variant => variant.size === size)
        ?? null
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const variants = useMemo(() => product.variants ?? [], [product.variants])
    const sizes = useMemo(() => uniqueValues(variants.map(variant => variant.size)), [variants])
    const colors = useMemo(() => uniqueValues(variants.map(variant => variant.color)), [variants])
    const hasSizes = sizes.length > 0
    const hasColors = colors.length > 0
    const firstAvailableVariant = useMemo(
        () => variants.find(variantHasStock) ?? variants[0] ?? null,
        [variants],
    )

    const [selectedSize, setSelectedSize] = useState<string | null>(firstAvailableVariant?.size ?? null)
    const [selectedColor, setSelectedColor] = useState<string | null>(firstAvailableVariant?.color ?? null)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const { items, addItem, removeItem, updateQuantity } = useCart()
    const { isAuthenticated } = useAuth()

    const selectedVariant = useMemo(
        () => findVariant(variants, selectedSize, selectedColor, hasSizes, hasColors),
        [hasColors, hasSizes, selectedColor, selectedSize, variants],
    )

    const selectedCombinationExists = hasVariantForSelection(variants, selectedSize, selectedColor)
    const needsVariantSelection = variants.length > 0 && !selectedVariant
    const isInactive = isInactiveStatus(product.status)
    const productStatusLabel = isInactive ? "Discontinued" : "Available"
    const stockQuantity = selectedVariant?.stock ?? product.totalStock ?? 0
    const isOutOfStock = selectedVariant ? !variantHasStock(selectedVariant) : stockQuantity <= 0
    const maxQuantity = Math.max(stockQuantity, 0)
    const safeQuantity = Math.max(1, Math.min(quantity, Math.max(maxQuantity, 1)))
    const displayPrice = selectedVariant?.price ?? product.price ?? product.basePrice
    const hasPriceRange = product.minPrice !== product.maxPrice
    const canAddToCart = Boolean(selectedVariant) && !isInactive && !isOutOfStock && !added && !isAdding

    function handleSizeSelect(size: string) {
        const nextSize = selectedSize === size ? null : size
        setSelectedSize(nextSize)

        if (nextSize && selectedColor && !hasVariantForSelection(variants, nextSize, selectedColor)) {
            const fallbackVariant = findFirstAvailableForSize(variants, nextSize)
            setSelectedColor(fallbackVariant?.color ?? null)
        }
    }

    function handleColorSelect(color: string) {
        const nextColor = selectedColor === color ? null : color
        setSelectedColor(nextColor)

        if (selectedSize && nextColor && !hasVariantForSelection(variants, selectedSize, nextColor)) {
            const fallbackVariant = findFirstAvailableForColor(variants, nextColor)
            setSelectedSize(fallbackVariant?.size ?? null)
        }
    }

    async function handleAddToCart() {
        if (needsVariantSelection) {
            toast.error("Please select size and color")
            return
        }

        if (!selectedVariant) {
            toast.error("This product has no available variant")
            return
        }

        if (isInactive || isOutOfStock) {
            toast.error("This product is not available")
            return
        }

        const finalQuantity = Math.min(safeQuantity, maxQuantity)
        const existingItem = items.find(item => item.variantId === selectedVariant.id)
        const cartItem: CartItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price: selectedVariant.price,
            size: selectedVariant.size ?? "",
            color: selectedVariant.color ?? "",
            quantity: finalQuantity,
            stock: maxQuantity,
            imageUrl: product.images[0]?.imageUrl ?? null,
        }

        addItem(cartItem)
        setIsAdding(true)

        try {
            if (isAuthenticated) {
                await cartService.addItem(selectedVariant.id, finalQuantity)
            }

            toast.success(`Added ${finalQuantity} x ${product.name} to cart`)
            setAdded(true)
            setTimeout(() => setAdded(false), 1500)
        } catch (error) {
            if (existingItem) {
                updateQuantity(selectedVariant.id, existingItem.quantity)
            } else {
                removeItem(selectedVariant.id)
            }

            const apiError = error as ApiError
            toast.error(apiError.message ?? "Could not add product to cart")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                <ProductImageGallery images={product.images} productName={product.name} />

                <section className="space-y-8">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                            {product.categoryName ?? "Product"}
                        </p>
                        <h1 className="mb-4 text-balance font-serif text-4xl md:text-5xl">
                            {product.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-2xl font-medium">{formatPrice(displayPrice)}</p>
                            {!selectedVariant && hasPriceRange && (
                                <p className="text-sm text-muted-foreground">
                                    {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
                                </p>
                            )}
                        </div>
                    </div>

                    {product.description && (
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>
                    )}

                    {colors.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium uppercase tracking-wide">
                                    Color
                                </p>
                                {selectedColor && (
                                    <p className="text-sm text-muted-foreground">{selectedColor}</p>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(color => {
                                    const disabled = selectedSize
                                        ? !variants.some(variant =>
                                            variant.color === color &&
                                            variant.size === selectedSize &&
                                            variantHasStock(variant),
                                        )
                                        : !hasStockForValue(variants, "color", color)

                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => handleColorSelect(color)}
                                            className={`border px-4 py-2 text-sm transition-colors ${
                                                selectedColor === color
                                                    ? "border-foreground bg-foreground text-background"
                                                    : disabled
                                                      ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                                                      : "border-border hover:border-foreground"
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {sizes.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium uppercase tracking-wide">
                                    Size
                                </p>
                                {selectedSize && (
                                    <p className="text-sm text-muted-foreground">{selectedSize}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
                                {sizes.map(size => {
                                    const disabled = selectedColor
                                        ? !variants.some(variant =>
                                            variant.size === size &&
                                            variant.color === selectedColor &&
                                            variantHasStock(variant),
                                        )
                                        : !hasStockForValue(variants, "size", size)

                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => handleSizeSelect(size)}
                                            className={`min-h-10 border px-4 py-2 text-sm transition-colors ${
                                                selectedSize === size
                                                    ? "border-foreground bg-foreground text-background"
                                                    : disabled
                                                      ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                                                      : "border-border hover:border-foreground"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="rounded-md border border-border p-4 text-sm">
                        {isInactive ? (
                            <p className="flex items-center gap-2 text-destructive">
                                <PackageX className="h-4 w-4" />
                                Product discontinued
                            </p>
                        ) : needsVariantSelection ? (
                            <p className="flex items-center gap-2 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                {selectedCombinationExists
                                    ? "Select size and color to view stock"
                                    : "This size and color combination is unavailable"}
                            </p>
                        ) : isOutOfStock ? (
                            <p className="flex items-center gap-2 text-destructive">
                                <PackageX className="h-4 w-4" />
                                Out of stock
                            </p>
                        ) : (
                            <p className="flex items-center gap-2 text-green-600">
                                <PackageCheck className="h-4 w-4" />
                                In stock ({stockQuantity})
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 border-y border-border py-6 text-sm sm:grid-cols-2">
                        <div>
                            <p className="text-muted-foreground">Material</p>
                            <p className="mt-1 font-medium">{product.material || "Updating"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="mt-1 font-medium">
                                {productStatusLabel}
                            </p>
                        </div>
                        {selectedVariant && (
                            <div className="sm:col-span-2">
                                <p className="text-muted-foreground">SKU</p>
                                <p className="mt-1 font-medium">{selectedVariant.sku}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-wide">Quantity</p>
                        <div className="flex w-fit items-center border border-border">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(Math.max(safeQuantity - 1, 1))}
                                disabled={safeQuantity <= 1 || !canAddToCart}
                                className="h-12 w-12 rounded-none"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex h-12 w-16 items-center justify-center border-x border-border">
                                {safeQuantity}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuantity(Math.min(safeQuantity + 1, maxQuantity))}
                                disabled={safeQuantity >= maxQuantity || !canAddToCart}
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
                        disabled={!canAddToCart}
                    >
                        {added ? (
                            <>
                                <Check className="h-5 w-5" />
                                Added to cart
                            </>
                        ) : isAdding ? (
                            "Adding..."
                        ) : needsVariantSelection ? (
                            "Select variant"
                        ) : isOutOfStock ? (
                            "Out of stock"
                        ) : (
                            "Add to cart"
                        )}
                    </Button>
                </section>
            </div>

            <ReviewSection
                productId={product.id}
                averageRating={product.averageRating ?? 0}
                reviewCount={product.reviewCount ?? 0}
            />
        </div>
    )
}
