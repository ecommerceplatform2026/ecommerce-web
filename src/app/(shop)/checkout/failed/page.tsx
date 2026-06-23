"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"

function CheckoutFailedContent() {
    const searchParams = useSearchParams()
    const reason = searchParams.get("reason")

    return (
        <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
                <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Checkout failed</p>
                    <h1 className="font-serif text-4xl md:text-5xl">We could not place your order</h1>
                </div>
                <p className="text-muted-foreground">
                    {reason || "Please review your cart and shipping details, then try again."}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild size="lg">
                        <Link href={ROUTES.CHECKOUT.INDEX}>Try checkout again</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href={ROUTES.CART}>
                            <ShoppingCart className="h-4 w-4" />
                            Review cart
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default function CheckoutFailedPage() {
    return (
        <Suspense fallback={null}>
            <CheckoutFailedContent />
        </Suspense>
    )
}
