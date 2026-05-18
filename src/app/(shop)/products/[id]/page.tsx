"use client"

import { notFound, useParams } from "next/navigation"
import { useProduct } from "@/hooks/useProducts"
import { ProductDetails } from "@/components/product/ProductDetails"
import { Loader2 } from "lucide-react"

export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string
    const { data: product, isLoading, error } = useProduct(id)

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (error || !product) {
        notFound()
    }

    return (
        <main className="min-h-screen">
            <ProductDetails product={product} />
        </main>
    )
}
