"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import type { ProductImage } from "@/types/product"

interface ProductImageGalleryProps {
    images: ProductImage[]
    productName: string
}

function ProductImageFrame({
    src,
    alt,
    priority = false,
}: {
    src: string
    alt: string
    priority?: boolean
}) {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
            loading={priority ? "eager" : undefined}
        />
    )
}

function EmptyImageState() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
            <ImageIcon className="h-12 w-12" aria-hidden="true" />
        </div>
    )
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const validImages = images.filter(image => image.imageUrl?.trim())
    const [activeIndex, setActiveIndex] = useState(0)
    const safeActiveIndex = validImages.length > 0
        ? Math.min(activeIndex, validImages.length - 1)
        : 0
    const activeImage = validImages[safeActiveIndex]

    return (
        <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                {activeImage ? (
                    <ProductImageFrame
                        src={activeImage.imageUrl}
                        alt={productName}
                        priority
                    />
                ) : (
                    <EmptyImageState />
                )}
            </div>

            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {validImages.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative aspect-[3/4] overflow-hidden border bg-secondary transition-colors ${
                                safeActiveIndex === index
                                    ? "border-foreground"
                                    : "border-border hover:border-muted-foreground"
                            }`}
                            aria-label={`View image ${index + 1} of ${productName}`}
                        >
                            <ProductImageFrame
                                src={image.imageUrl}
                                alt={`${productName} ${index + 1}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
