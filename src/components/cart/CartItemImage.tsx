"use client"

import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { getProductImage, useImageErrorFallback } from "@/utils/imageHelpers"
import type { CartItem } from "@/types/cart"

export function CartItemImage({ item }: { item: CartItem }) {
    const [imgSrc, onError] = useImageErrorFallback(getProductImage(item.imageUrl))
    return (
        <Link href={ROUTES.SHOP.PRODUCT_DETAIL(item.productId)} className="relative aspect-[3/4] w-full sm:w-28 overflow-hidden bg-muted">
            <Image src={imgSrc} alt={item.name} fill loading="lazy" sizes="(max-width: 640px) 100vw, 80px" className="object-cover" onError={onError} />
        </Link>
    )
}
