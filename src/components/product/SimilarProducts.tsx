"use client"

import { useSimilarProducts } from "@/hooks/useRecommendations"
import { ProductCard } from "@/components/product/ProductCard"
import { Skeleton } from "@/components/ui/Skeleton"

interface SimilarProductsProps {
    productId: string
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
    const { data: similarProducts = [], isLoading } = useSimilarProducts(productId)

    // Slice to show up to 4 similar products
    const similar = similarProducts.slice(0, 4)

    if (!isLoading && similar.length === 0) {
        return null
    }

    return (
        <section className="py-16 border-t border-border mt-16 px-4 lg:px-8" id="similar-products-section">
            <div className="container mx-auto">
                <div className="mb-12">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
                        More to explore
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl">Similar Products</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-3" data-testid="similar-skeleton">
                                <Skeleton className="aspect-[3/4] w-full" />
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))
                        : similar.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
