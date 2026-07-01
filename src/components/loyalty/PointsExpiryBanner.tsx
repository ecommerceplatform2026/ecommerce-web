"use client"

import * as React from "react"
import Link from "next/link"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"

interface PointsExpiryBannerProps {
    open: boolean
    onDismiss: () => void
}

function PointsExpiryBanner({ open, onDismiss }: PointsExpiryBannerProps) {
    if (!open) return null

    return (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
            <Clock className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1">
                <p className="font-medium text-amber-900">Points expiring soon</p>
                <p className="text-amber-700">
                    Your points will expire soon due to inactivity.{" "}
                    <Link href={ROUTES.SHOP.PRODUCTS} className="underline font-medium hover:text-amber-900">
                        Place an order
                    </Link>{" "}
                    to keep them.
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="shrink-0 h-6 w-6 text-amber-500 hover:text-amber-900 hover:bg-amber-100"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

export { PointsExpiryBanner }
