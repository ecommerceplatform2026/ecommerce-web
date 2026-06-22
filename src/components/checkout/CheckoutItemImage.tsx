"use client"

import Image from "next/image"
import { getProductImage, useImageErrorFallback } from "@/utils/imageHelpers"
import type { CartItem } from "@/types/cart"

export function CheckoutItemImage({ item }: { item: CartItem }) {
    const [imgSrc, onError] = useImageErrorFallback(getProductImage(item.imageUrl))
    return (
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            <Image src={imgSrc} alt={item.name} fill sizes="64px" className="object-cover" onError={onError} />
        </div>
    )
}
