'use client'

import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import type { LowStockVariant } from '@/types/dashboard'

interface LowStockAlertsProps {
    data: LowStockVariant[] | undefined
    isLoading: boolean
}

function VariantInfo({ variant }: { variant: LowStockVariant }) {
    const parts: string[] = []
    if (variant.color) parts.push(variant.color)
    if (variant.size) parts.push(variant.size)
    const combo = parts.length > 0 ? ` (${parts.join(' / ')})` : ''

    return (
        <p className="text-xs text-muted-foreground">
            {variant.sku}{combo}
        </p>
    )
}

function StockBadge({ current, threshold }: { current: number; threshold: number }) {
    const isCritical = current <= Math.max(Math.floor(threshold / 2), 0)
    return (
        <span
            title={`Minimum threshold: ${threshold}`}
            className={cn(
                'shrink-0 text-xs font-semibold',
                isCritical ? 'text-destructive' : 'text-amber-600',
            )}
        >
            {current}
        </span>
    )
}

export function LowStockAlerts({ data, isLoading }: LowStockAlertsProps) {
    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-40 rounded-none" />
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-none" />
                    ))}
                </div>
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                    <p className="font-heading text-lg tracking-tight text-foreground">
                        Low Stock Alerts
                    </p>
                    <CheckCircle className="size-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 py-4">
                    <CheckCircle className="size-5 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">
                        All stock levels are healthy
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
                <p className="font-heading text-lg tracking-tight text-foreground">
                    Low Stock Alerts
                </p>
                <AlertTriangle className="size-4 text-amber-500" />
            </div>
            <div className="divide-y divide-border">
                {data.map((variant) => (
                    <Link
                        key={variant.variantId}
                        href={`${ROUTES.ADMIN.PRODUCTS.INDEX}?search=${encodeURIComponent(variant.productName)}`}
                        className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/50 first:pt-0 last:pb-0"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {variant.productName}
                            </p>
                            <VariantInfo variant={variant} />
                        </div>
                        <StockBadge
                            current={variant.currentStock}
                            threshold={variant.lowStockThreshold}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}
