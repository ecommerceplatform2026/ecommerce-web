"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Minus, Plus, Star, Heart, AlertCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"
import { ProductStatus } from "@/constants/enums"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useProducts, useProductImages } from "@/hooks/useProducts"
import { ProductImageGallery } from "./ProductImageGallery"
import toast from "react-hot-toast"
import type { Product } from "@/types/product"

const mockReviews = [
    {
        id: 1,
        author: "Michael Nguyen",
        rating: 5,
        date: "2025-01-10",
        title: "Excellent quality",
        comment:
            "The material feels premium and the stitching is refined. Completely worth the price. I am very happy with this product.",
    },
    {
        id: 2,
        author: "Daniel Tran",
        rating: 5,
        date: "2025-01-08",
        title: "True to size and beautiful",
        comment:
            "I ordered my usual size and it fits perfectly. The fabric is soft and elegant. Delivery was on time and carefully packaged.",
    },
    {
        id: 3,
        author: "Kevin Pham",
        rating: 4,
        date: "2025-01-05",
        title: "Good product",
        comment:
            "Overall very satisfied. Delivery was slightly slower than expected, but the product is worth it.",
    },
    {
        id: 4,
        author: "Henry Le",
        rating: 5,
        date: "2025-01-02",
        title: "Premium experience",
        comment:
            "Everything from the packaging to the product feels polished. This is what premium fashion should feel like. I will buy again.",
    },
    {
        id: 5,
        author: "Thomas Vu",
        rating: 4,
        date: "2024-12-28",
        title: "Worth the investment",
        comment:
            "The price is a bit high, but the quality is worth it. Durable fabric with a classic yet modern look.",
    },
    {
        id: 6,
        author: "Brian Do",
        rating: 5,
        date: "2024-12-25",
        title: "A meaningful gift",
        comment:
            "I bought this as a birthday gift for my father. He loved it and praised the quality and refined design. Thank you, Atelier!",
    },
]

interface ProductDetailsProps {
    product: Product
}

function isVariantOutOfStock(variant: { stock: number; isOutOfStock?: boolean } | null | undefined) {
    return !variant || variant.isOutOfStock === true || variant.stock <= 0
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const variants = useMemo(() => product.variants ?? [], [product.variants])

    const uniqueSizes = useMemo(
        () => [...new Set(variants.map(v => v.size).filter((s): s is string => s !== null))],
        [variants],
    )
    const uniqueColors = useMemo(
        () => [...new Set(variants.map(v => v.color).filter((c): c is string => c !== null))],
        [variants],
    )

    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        const sizes = [...new Set(variants.map(v => v.size).filter((s): s is string => s !== null))]
        return sizes.length === 1 ? sizes[0] : null
    })
    const [selectedColor, setSelectedColor] = useState<string | null>(() => {
        const colors = [...new Set(variants.map(v => v.color).filter((c): c is string => c !== null))]
        return colors.length === 1 ? colors[0] : null
    })
    const [quantity, setQuantity] = useState(1)
    const [quantityInput, setQuantityInput] = useState("1")
    const [added, setAdded] = useState(false)
    const [currentReviewPage, setCurrentReviewPage] = useState(1)

    const selectedVariant = useMemo(() => {
        if (variants.length === 0) return null
        return (
            variants.find(v =>
                (uniqueSizes.length === 0 || v.size === selectedSize) &&
                (uniqueColors.length === 0 || v.color === selectedColor),
            ) ?? null
        )
    }, [variants, selectedSize, selectedColor, uniqueSizes.length, uniqueColors.length])

    const hasRequiredVariantSelection =
        (uniqueSizes.length === 0 || selectedSize !== null) &&
        (uniqueColors.length === 0 || selectedColor !== null)
    const hasUnavailableSelection = variants.length > 0 && hasRequiredVariantSelection && selectedVariant === null
    const displayPrice = selectedVariant?.price ?? product.basePrice
    const isOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : false
    const isLowStock = selectedVariant?.isLowStock ?? false
    const maxStock = selectedVariant?.stock ?? 0
    const needsVariantSelection = variants.length > 0 && !hasRequiredVariantSelection
    const isInactive = product.status === ProductStatus.Inactive

    const { addItem } = useCart()
    const { toggleItem, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product.id)
    const { data: images = [] } = useProductImages(product.id)
    const { data: allProducts = [] } = useProducts()
    const relatedProducts = allProducts
        .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4)
    const relatedImage = (item: Product) => item.imageUrl ?? "/placeholder.svg"

    const REVIEWS_PER_PAGE = 3
    const averageRating = (
        mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    ).toFixed(1)
    const totalReviewPages = Math.ceil(mockReviews.length / REVIEWS_PER_PAGE)
    const paginatedReviews = mockReviews.slice(
        (currentReviewPage - 1) * REVIEWS_PER_PAGE,
        currentReviewPage * REVIEWS_PER_PAGE,
    )

    function handleSizeSelect(size: string) {
        setQuantity(1)
        setQuantityInput("1")
        if (selectedSize === size) {
            setSelectedSize(null)
            return
        }

        setSelectedSize(size)
        if (
            selectedColor &&
            !variants.some(variant => variant.size === size && variant.color === selectedColor)
        ) {
            setSelectedColor(null)
        }
    }

    function handleColorSelect(color: string) {
        setQuantity(1)
        setQuantityInput("1")
        if (selectedColor === color) {
            setSelectedColor(null)
            return
        }

        setSelectedColor(color)
        if (
            selectedSize &&
            !variants.some(variant => variant.color === color && variant.size === selectedSize)
        ) {
            setSelectedSize(null)
        }
    }

    function handleQuantityInput(value: string) {
        if (!/^\d*$/.test(value)) return

        const maxAllowed = Math.max(1, maxStock)
        if (value === "") {
            setQuantityInput("")
            return
        }

        const nextQuantity = Number(value)
        if (!Number.isFinite(nextQuantity)) return

        if (nextQuantity > maxAllowed) {
            setQuantity(maxAllowed)
            setQuantityInput(String(maxAllowed))
            toast.error(`Only ${maxAllowed} item(s) available for this variant.`)
            return
        }

        const clampedQuantity = Math.max(1, nextQuantity)
        setQuantity(clampedQuantity)
        setQuantityInput(String(clampedQuantity))
    }

    function handleQuantityBlur() {
        if (quantityInput === "") {
            setQuantity(1)
            setQuantityInput("1")
        }
    }

    function setSelectedQuantity(nextQuantity: number) {
        const maxAllowed = Math.max(1, maxStock)
        const clampedQuantity = Math.max(1, Math.min(nextQuantity, maxAllowed))
        setQuantity(clampedQuantity)
        setQuantityInput(String(clampedQuantity))
    }

    const handleAddToCart = async () => {
        if (needsVariantSelection) {
            const missingSize = uniqueSizes.length > 0 && !selectedSize
            const missingColor = uniqueColors.length > 0 && !selectedColor
            if (missingSize && missingColor) toast.error('Please select size and color')
            else if (missingSize) toast.error('Please select size')
            else toast.error('Please select color')
            return
        }
        if (hasUnavailableSelection) {
            toast.error('Selected size and color combination is unavailable')
            return
        }
        if (!selectedVariant) {
            toast.error('Please select a valid product variant')
            return
        }
        if (isOutOfStock) {
            toast.error('Product is out of stock')
            return
        }
        const finalQty = Math.min(quantity, maxStock)
        try {
            await addItem({
                productId: product.id,
                variantId: selectedVariant.id,
                sku: selectedVariant.sku,
                name: product.name,
                price: displayPrice,
                size: selectedSize ?? '',
                color: selectedColor ?? '',
                quantity: finalQty,
                stock: selectedVariant.stock,
                isLowStock: selectedVariant.isLowStock,
                isOutOfStock: selectedVariant.isOutOfStock,
                imageUrl: images[0]?.imageUrl ?? product.imageUrl ?? null,
            })
            toast.success(`Added ${finalQty} x ${product.name} to cart`)
            setAdded(true)
            setTimeout(() => setAdded(false), 2000)
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Unable to add product to cart.')
        }
    }

    const handleWishlist = () => {
        toggleItem(product)
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist")
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:px-8 lg:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">

                {/* Image Gallery */}
                <div className="lg:sticky lg:top-24">
                    <ProductImageGallery images={images} productName={product.name} />
                </div>

                {/* Details */}
                <div className="mx-auto w-full max-w-xl space-y-6 lg:mx-0 lg:py-2">
                    <div>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
                            {product.categoryName ?? ""}
                        </p>
                        <h1 className="mb-4 font-serif text-3xl leading-tight md:text-4xl">{product.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-2xl font-medium">{displayPrice.toLocaleString("vi-VN")}₫</p>
                            {product.status === ProductStatus.Inactive && (
                                <span className="text-xs px-2 py-1 border border-destructive text-destructive uppercase tracking-wide">
                                    Discontinued
                                </span>
                            )}
                        </div>
                    </div>

                    {product.description && (
                        <p className="border-y border-border py-5 text-base leading-7 text-muted-foreground">
                            {product.description}
                        </p>
                    )}

                    {/* Size selector */}
                    {uniqueSizes.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium tracking-wide">
                                SIZE
                                {selectedSize && (
                                    <span className="ml-2 font-normal text-muted-foreground">
                                        {selectedSize}
                                    </span>
                                )}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueSizes.map(size => {
                                    const matchingVariants = variants.filter(
                                        vr => vr.size === size &&
                                            (uniqueColors.length === 0 || selectedColor === null || vr.color === selectedColor),
                                    )
                                    const unavailable = matchingVariants.length === 0 || matchingVariants.every(isVariantOutOfStock)
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeSelect(size)}
                                            className={`px-4 py-2 text-sm border transition-colors ${
                                                selectedSize === size
                                                    ? 'border-foreground bg-foreground text-background'
                                                    : unavailable
                                                    ? 'border-border text-muted-foreground line-through opacity-50 hover:border-muted-foreground'
                                                    : 'border-border hover:border-foreground cursor-pointer'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Color selector */}
                    {uniqueColors.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium tracking-wide">
                                COLOR
                                {selectedColor && (
                                    <span className="ml-2 font-normal text-muted-foreground">
                                        {selectedColor}
                                    </span>
                                )}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueColors.map(color => {
                                    const matchingVariants = variants.filter(
                                        vr => vr.color === color &&
                                            (uniqueSizes.length === 0 || selectedSize === null || vr.size === selectedSize),
                                    )
                                    const unavailable = matchingVariants.length === 0 || matchingVariants.every(isVariantOutOfStock)
                                    return (
                                        <button
                                            key={color}
                                            onClick={() => handleColorSelect(color)}
                                            className={`px-4 py-2 text-sm border transition-colors ${
                                                selectedColor === color
                                                    ? 'border-foreground bg-foreground text-background'
                                                    : unavailable
                                                    ? 'border-border text-muted-foreground line-through opacity-50 hover:border-muted-foreground'
                                                    : 'border-border hover:border-foreground cursor-pointer'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Stock status */}
                    {selectedVariant && (
                        <div>
                            {isOutOfStock ? (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Out of stock</span>
                                </div>
                            ) : isLowStock ? (
                                <div className="flex items-center gap-2 text-amber-600 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Low stock - {selectedVariant.stock} left</span>
                                </div>
                            ) : (
                                <p className="text-sm text-green-600">In stock ({selectedVariant.stock})</p>
                            )}
                        </div>
                    )}

                    {hasUnavailableSelection && (
                        <p className="text-sm text-destructive">
                            Selected size and color combination is unavailable.
                        </p>
                    )}

                    {/* Variant selection prompt */}
                    {needsVariantSelection && (
                        <p className="text-sm text-amber-600">
                            {!selectedSize && uniqueSizes.length > 0 && !selectedColor && uniqueColors.length > 0
                                ? 'Please select size and color to continue'
                                : !selectedSize && uniqueSizes.length > 0
                                ? 'Please select size to continue'
                                : 'Please select color to continue'}
                        </p>
                    )}

                    {/* Quantity */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium tracking-wide">QUANTITY</p>
                        <div className="flex items-center border border-border w-fit">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedQuantity(quantity - 1)}
                                disabled={quantity <= 1}
                                className="h-12 w-12 rounded-none hover:bg-muted cursor-pointer"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="w-16 h-12 flex items-center justify-center border-x border-border">
                                <input
                                    value={quantityInput}
                                    onChange={event => handleQuantityInput(event.target.value)}
                                    onBlur={handleQuantityBlur}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    aria-label="Quantity"
                                    className="h-full w-full bg-transparent text-center text-base font-medium outline-none"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedQuantity(quantity + 1)}
                                disabled={quantity >= maxStock}
                                className="h-12 w-12 rounded-none hover:bg-muted cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="space-y-3">
                        <Button
                            size="lg"
                            className="h-[52px] w-full cursor-pointer text-base"
                            onClick={handleAddToCart}
                            disabled={added || isOutOfStock || isInactive}
                        >
                            {added ? (
                                <>
                                    <Check className="mr-2 h-5 w-5" />
                                    Added to cart
                                </>
                            ) : isInactive ? (
                                'Discontinued'
                            ) : isOutOfStock ? (
                                'Out of stock'
                            ) : (
                                'Add to cart'
                            )}
                        </Button>

                        {/* Wishlist */}
                        <Button
                            variant="outline"
                            size="lg"
                            className={`h-12 w-full cursor-pointer gap-2 ${
                                inWishlist ? "border-primary text-primary" : ""
                            }`}
                            onClick={handleWishlist}
                        >
                            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                            {inWishlist ? "Added to wishlist" : "Add to wishlist"}
                        </Button>
                    </div>

                    {/* Product Details */}
                    <div className="border-t border-border pt-6 space-y-4">
                        <h3 className="text-sm font-medium tracking-wide">PRODUCT DETAILS</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {product.material && <li>Material: {product.material}</li>}
                            <li>Expert craftsmanship with attention to every detail</li>
                            <li>Free shipping for orders from 2,000,000 VND</li>
                            <li>30-day returns</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-16 border-t border-border pt-12 lg:mt-20 lg:pt-14">
                <div className="max-w-3xl">
                    <div className="mb-10">
                        <h2 className="mb-4 font-serif text-3xl">Customer Reviews</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.floor(Number.parseFloat(averageRating))
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-medium">{averageRating} / 5</span>
                            <span className="text-sm text-muted-foreground">
                                ({mockReviews.length} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {paginatedReviews.map((review) => (
                            <div key={review.id} className="pb-8 border-b border-border last:border-b-0">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-lg">{review.title}</h3>
                                        <p className="text-sm text-muted-foreground">{review.author}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(review.date).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < review.rating
                                                    ? "fill-primary text-primary"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {totalReviewPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentReviewPage(prev => Math.max(1, prev - 1))}
                                disabled={currentReviewPage === 1}
                                className="cursor-pointer"
                            >
                                Previous
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={currentReviewPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentReviewPage(page)}
                                        className="w-10 cursor-pointer"
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentReviewPage(prev => Math.min(totalReviewPages, prev + 1))}
                                disabled={currentReviewPage === totalReviewPages}
                                className="cursor-pointer"
                            >
                                Sau
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 border-t border-border pt-12 lg:mt-20 lg:pt-14">
                    <h2 className="mb-10 font-serif text-3xl">Related Products</h2>
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:gap-6">
                        {relatedProducts.map((p) => (
                            <Link
                                key={p.id}
                                href={ROUTES.SHOP.PRODUCT_DETAIL(p.id)}
                                className="group"
                            >
                                <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-secondary">
                                    <Image
                                        src={relatedImage(p)}
                                        alt={p.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 260px"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mb-1 line-clamp-2 text-sm font-medium tracking-wide transition-colors group-hover:text-muted-foreground">
                                    {p.name}
                                </h3>
                                <p className="text-sm font-medium md:text-base">
                                    {p.basePrice.toLocaleString("vi-VN")}₫
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
