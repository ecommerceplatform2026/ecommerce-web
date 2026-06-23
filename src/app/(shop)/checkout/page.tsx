"use client"

import { useCart } from "@/hooks/useCart"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { ShoppingBag } from "lucide-react"

export default function CheckoutPage() {
    const { items, isLoading } = useCart()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <div className="mb-10">
                    <Skeleton className="h-12 w-64 rounded-none mb-2" />
                    <Skeleton className="h-4 w-40 rounded-none" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10">
                    <div className="space-y-6">
                        <Skeleton className="h-48 rounded-none w-full" />
                        <Skeleton className="h-72 rounded-none w-full" />
                    </div>
                    <Skeleton className="h-80 rounded-none w-full" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <EmptyState
                    icon={<ShoppingBag className="h-10 w-10 text-muted-foreground opacity-40" />}
                    title="Your cart is empty"
                    description="You must add items to your cart before you can check out."
                    action={
                        <Button asChild size="lg" className="rounded-none">
                            <Link href={ROUTES.SHOP.PRODUCTS}>Continue shopping</Link>
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-10">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
                <CheckoutForm />
                <OrderSummary />
            </div>
        </div>
    )
}
