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
        <section className="bg-background px-4 py-24 lg:px-8">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 font-serif text-4xl md:text-5xl">Shop by Category</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Khám phá các bộ sưu tập được tuyển chọn kỹ lưỡng
                    </p>
                </div>

                <div className="relative">
                    <div
                        id="categorySlider"
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-96 w-72 flex-shrink-0" />
                            ))
                            : categories.map(category => (
                                <Link
                                    key={category.id}
                                    href={`${ROUTES.SHOP.PRODUCTS}?categoryId=${category.id}`}
                                    className="group relative h-96 w-72 flex-shrink-0 overflow-hidden bg-secondary"
                                >
                                    <Image
                                        src="/placeholder.svg"
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent transition-colors duration-500 group-hover:from-foreground/50" />

                                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                                        <div className="space-y-3">
                                            <p className="text-xs uppercase tracking-widest text-background/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                Bộ sưu tập
                                            </p>
                                            <h3 className="font-serif text-2xl leading-tight text-background">
                                                {category.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-background/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                <span>Khám phá</span>
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const slider = document.getElementById("categorySlider")
                            if (slider) slider.scrollBy({ left: -300, behavior: "smooth" })
                        }}
                        aria-label="Cuộn trái"
                        className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-foreground p-2 text-background transition-all hover:bg-foreground/90 lg:-translate-x-6"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const slider = document.getElementById("categorySlider")
                            if (slider) slider.scrollBy({ left: 300, behavior: "smooth" })
                        }}
                        aria-label="Cuộn phải"
                        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-foreground p-2 text-background transition-all hover:bg-foreground/90 lg:translate-x-6"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </section>
    )
}
