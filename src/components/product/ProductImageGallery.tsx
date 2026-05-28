'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ProductImage } from '@/types/product'

interface ProductImageGalleryProps {
    images: ProductImage[]
    productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    const sorted = [...images].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
    const activeUrl = sorted[activeIndex]?.imageUrl ?? '/placeholder.svg'

    return (
        <div className="mx-auto w-full max-w-[520px] space-y-3 lg:mx-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                    src={activeUrl}
                    alt={productName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-contain"
                    priority
                />
            </div>

            {sorted.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {sorted.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(i)}
                            className={`relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden border bg-secondary transition-colors sm:w-20 ${
                                activeIndex === i
                                    ? 'border-foreground'
                                    : 'border-border hover:border-muted-foreground'
                            }`}
                        >
                            <Image
                                src={img.imageUrl}
                                alt={`${productName} ${i + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
