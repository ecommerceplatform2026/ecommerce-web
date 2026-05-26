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
    const activeUrl = images[activeIndex]?.imageUrl ?? '/placeholder.svg'

    return (
        <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                    src={activeUrl}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden border-2 bg-secondary transition-colors ${
                                activeIndex === index
                                    ? 'border-foreground'
                                    : 'border-transparent hover:border-muted-foreground'
                            }`}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={`${productName} ${index + 1}`}
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
