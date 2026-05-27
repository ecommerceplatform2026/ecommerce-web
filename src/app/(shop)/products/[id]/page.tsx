"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useProduct } from "@/hooks/useProducts"
import { ProductDetails } from "@/components/product/ProductDetails"
import { Loader2 } from "lucide-react"
export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const { data: product, isLoading, error } = useProduct(id)

    useEffect(() => {
        if (!isLoading && (error || !product)) {
            router.replace('/not-found')
        }
    }, [isLoading, error, product, router])

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (!product) {
        return null
    }

    return (
        <main className="min-h-screen">
            <ProductDetails product={product} />
        </main>
    )
}
