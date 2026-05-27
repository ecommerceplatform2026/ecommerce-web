"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ProductDetails } from "@/components/product/ProductDetails"
import { useProductDetail } from "@/hooks/useProducts"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { data: product, isLoading, error } = useProductDetail(id)

    useEffect(() => {
        if (!isLoading && (error || !product)) {
            router.replace('/not-found')
        }
    }, [error, isLoading, product, router])

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (!product) return null

    return (
        <main className="min-h-screen">
            <ProductDetails key={product.id} product={product} />
        </main>
    )
}
