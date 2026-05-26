"use client"

import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import type { Product } from "@/types/product"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={ROUTES.SHOP.PRODUCT_DETAIL(product.id)} className="group block">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                    src="/placeholder.svg"
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {product.categoryName ?? ""}
                </p>
                <h3 className="font-serif text-xl transition-colors group-hover:text-muted-foreground">
                    {product.name}
                </h3>
                <p className="text-lg">
                    {product.basePrice.toLocaleString("vi-VN")}₫
                </p>
            </div>
        </Link>
    )
}
