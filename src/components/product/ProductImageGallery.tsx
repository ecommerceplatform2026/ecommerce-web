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
        <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                <Image
                    src={activeUrl}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {sorted.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {sorted.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(i)}
                            className={`relative flex-shrink-0 w-20 aspect-[3/4] bg-secondary overflow-hidden border-2 transition-colors ${
                                activeIndex === i
                                    ? 'border-foreground'
                                    : 'border-transparent hover:border-muted-foreground'
                            }`}
                        >
                            <Image
                                src={img.imageUrl}
                                alt={`${productName} ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
