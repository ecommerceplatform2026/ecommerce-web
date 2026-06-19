"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/product/ProductCard"
import { Skeleton } from "@/components/ui/Skeleton"
import { ROUTES } from "@/constants/routes"
import { ProductStatus } from "@/constants/enums"

export function FeaturedProducts() {
    const { data: products = [], isLoading } = useProducts()

    const featured = products
        .filter(p => p.status === ProductStatus.Active)
        .slice(0, 4)

    return (
        <section className="py-16 lg:py-20 px-4 lg:px-8">
            <div className="container mx-auto">
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
                            Most loved
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl">Featured Products</h2>
                    </div>
                    <Link
                        href={ROUTES.SHOP.PRODUCTS}
                        className="hidden md:flex items-center gap-2 text-sm tracking-wide hover:text-muted-foreground transition-colors group"
                    >
                        View all
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-[3/4] w-full" />
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))
                        : featured.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>

                <div className="flex justify-center mt-12 md:hidden">
                    <Link
                        href={ROUTES.SHOP.PRODUCTS}
                        className="flex items-center gap-2 text-sm tracking-wide border border-foreground px-8 py-3 min-h-[44px] hover:bg-foreground hover:text-background transition-colors"
                    >
                        View all products
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
