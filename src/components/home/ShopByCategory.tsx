"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { useCategories } from "@/hooks/useCategories"
import { Skeleton } from "@/components/ui/Skeleton"

export function ShopByCategory() {
    const { data: categories = [], isLoading } = useCategories()

    return (
        <section className="py-24 px-4 lg:px-8 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl mb-4">Shop by Category</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore carefully curated collections
                    </p>
                </div>

                <div className="relative">
                    <div
                        id="categorySlider"
                        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="flex-shrink-0 w-72 h-96" />
                            ))
                            : categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`${ROUTES.SHOP.PRODUCTS}?categoryId=${category.id}`}
                                    className="group flex-shrink-0 w-72 relative overflow-hidden bg-secondary h-96"
                                >
                                    <Image
                                        src="/placeholder.svg"
                                        alt={category.name}
                                        fill
                                        sizes="288px"
                                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent group-hover:from-foreground/50 transition-colors duration-500" />

                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="space-y-3">
                                            <p className="text-background/80 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                Collection
                                            </p>
                                            <h3 className="font-serif text-background text-2xl leading-tight">
                                                {category.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-background/90 text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <span>Explore</span>
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                    <button
                        onClick={() => {
                            const slider = document.getElementById("categorySlider")
                            if (slider) slider.scrollBy({ left: -300, behavior: "smooth" })
                        }}
                        aria-label="Scroll left"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-foreground hover:bg-foreground/90 text-background p-2 rounded-full transition-all cursor-pointer"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={() => {
                            const slider = document.getElementById("categorySlider")
                            if (slider) slider.scrollBy({ left: 300, behavior: "smooth" })
                        }}
                        aria-label="Scroll right"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-foreground hover:bg-foreground/90 text-background p-2 rounded-full transition-all cursor-pointer"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </section>
    )
}
