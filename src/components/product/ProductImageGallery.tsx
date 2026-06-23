"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { useImageErrorFallback } from "@/utils/imageHelpers"
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
    const [imgSrc, onImgError] = useImageErrorFallback(src)
    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
            loading={priority ? "eager" : undefined}
            onError={onImgError}
        />
    )
}

function EmptyImageState() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <ImageIcon className="h-12 w-12" aria-hidden="true" />
        </div>
    )
}

function CrossfadeLayer({
    url,
    alt,
    active,
    priority,
    onFadeOutComplete,
}: {
    url: string
    alt: string
    active: boolean
    priority?: boolean
    onFadeOutComplete?: () => void
}) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setLoaded(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <div
            className={`absolute inset-0 transition-opacity duration-600 ${active ? (loaded ? 'opacity-100' : 'opacity-0') : 'opacity-0'}`}
            onTransitionEnd={() => { if (!active) onFadeOutComplete?.() }}
        >
            <ProductImageFrame src={url} alt={alt} priority={priority} />
        </div>
    )
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const validImages = images.filter(image => image.imageUrl?.trim())
    const [activeIndex, setActiveIndex] = useState(0)

    const safeActiveIndex = validImages.length > 0
        ? Math.min(activeIndex, validImages.length - 1)
        : 0

    const [displayUrls, setDisplayUrls] = useState<string[]>(() =>
        validImages.length > 0 ? [validImages[0].imageUrl] : []
    )

    const handleThumbnailClick = useCallback((index: number) => {
        if (index === safeActiveIndex) return
        setActiveIndex(index)
        const newUrl = validImages[index].imageUrl
        setDisplayUrls(prev => [newUrl, prev[0]])
    }, [safeActiveIndex, validImages])

    const handleFadeOut = useCallback((url: string) => {
        setDisplayUrls(prev => prev.filter(u => u !== url))
    }, [])

    return (
        <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {validImages.length === 0 ? (
                    <EmptyImageState />
                ) : (
                    displayUrls.map((url, i) => (
                        <CrossfadeLayer
                            key={url}
                            url={url}
                            alt={productName}
                            active={i === 0}
                            priority={i === 0}
                            onFadeOutComplete={() => handleFadeOut(url)}
                        />
                    ))
                )}
            </div>

            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {validImages.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative aspect-[3/4] overflow-hidden border bg-muted transition-colors min-h-[44px] ${
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