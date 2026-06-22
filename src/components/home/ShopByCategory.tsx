"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { useCategories } from "@/hooks/useCategories"
import { Skeleton } from "@/components/ui/Skeleton"

const CARD_W = 288
const GAP = 24
const STEP = CARD_W + GAP

export function ShopByCategory() {
    const { data: categories = [], isLoading } = useCategories()
    const len = categories.length
    const items = [...categories, ...categories, ...categories]

    const [index, setIndex] = useState(() => (len > 0 ? len : 0))
    const [smooth, setSmooth] = useState(true)
    const [containerWidth, setContainerWidth] = useState(0)
    const viewportRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!viewportRef.current) return
        const el = viewportRef.current
        const observer = new ResizeObserver(entries => {
            setContainerWidth(entries[0].contentRect.width)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (len > 0) {
            const id = setTimeout(() => {
                setIndex(len)
                setSmooth(true)
            })
            return () => clearTimeout(id)
        }
    }, [len])

    const centeredOffset = containerWidth > 0 ? Math.max(0, (containerWidth - CARD_W) / 2) : 0
    const offsetX = -(index * STEP - centeredOffset)

    const goRight = useCallback(() => {
        setSmooth(true)
        setIndex(prev => prev + 1)
    }, [])

    const goLeft = useCallback(() => {
        setSmooth(true)
        setIndex(prev => prev - 1)
    }, [])

    const handleTransitionEnd = useCallback(() => {
        if (len === 0) return
        if (index >= len * 2) {
            setSmooth(false)
            setIndex(index - len)
        } else if (index < len) {
            setSmooth(false)
            setIndex(index + len)
        }
    }, [index, len])

    const isReady = !isLoading && len > 0

    return (
        <section className="py-16 lg:py-20 px-4 lg:px-8 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl mb-4">Shop by Category</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore carefully curated collections
                    </p>
                </div>

                <div className="relative" ref={containerRef}>
                    <div className="overflow-hidden" ref={viewportRef}>
                        <div
                            className="flex gap-6"
                            style={{
                                transform: isReady ? `translateX(${offsetX}px)` : undefined,
                                transition: isReady && smooth ? 'transform 500ms ease-in-out' : 'none',
                            }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="flex-shrink-0 w-72 h-96" />
                                ))
                                : items.map((category, idx) => (
                                    <Link
                                        key={`${category.id}-${idx}`}
                                        href={`${ROUTES.SHOP.PRODUCTS}?categoryId=${category.id}`}
                                        className="group flex-shrink-0 w-72 relative overflow-hidden bg-muted h-96"
                                    >
                                        <Image
                                            src="/placeholder.svg"
                                            alt={category.name}
                                            fill
                                            loading="lazy"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
                    </div>

                    {isReady && (
                        <button
                            onClick={goLeft}
                            aria-label="Scroll left"
                            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-foreground hover:bg-foreground/90 text-background items-center justify-center min-h-[44px] min-w-[44px] shadow-lg transition-all cursor-pointer"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {isReady && (
                        <button
                            onClick={goRight}
                            aria-label="Scroll right"
                            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-foreground hover:bg-foreground/90 text-background items-center justify-center min-h-[44px] min-w-[44px] shadow-lg transition-all cursor-pointer"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}