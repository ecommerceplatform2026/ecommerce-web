'use client'

import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { formatPrice } from '@/utils/formatPrice'
import type { TopSellingProduct } from '@/types/dashboard'

interface TopProductsListProps {
    data: TopSellingProduct[] | undefined
    isLoading: boolean
}

const RANK_BADGES = [
    { className: 'bg-yellow-400 text-black', label: '1' },
    { className: 'bg-muted text-foreground', label: '2' },
    { className: 'bg-amber-600 text-white', label: '3' },
]

function RankBadge({ rank }: { rank: number }) {
    const badge = RANK_BADGES[rank]
    if (badge) {
        return (
            <span className={`flex size-6 shrink-0 items-center justify-center text-xs font-bold ${badge.className}`}>
                {badge.label}
            </span>
        )
    }
    return (
        <span className="flex size-6 shrink-0 items-center justify-center text-xs font-medium text-muted-foreground">
            {rank + 1}
        </span>
    )
}

export function TopProductsList({ data, isLoading }: TopProductsListProps) {
    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-40 rounded-none" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-none" />
                    ))}
                </div>
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                    Top Selling Products
                </p>
                <EmptyState
                    icon={<Package />}
                    title="No product data available"
                    className="py-8"
                />
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                Top Selling Products
            </p>
            <div className="divide-y divide-border">
                {data.map((product, index) => (
                    <Link
                        key={product.productId}
                        href={`${ROUTES.ADMIN.PRODUCTS.INDEX}?search=${encodeURIComponent(product.productName)}`}
                        className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/50 first:pt-0 last:pb-0"
                    >
                        <RankBadge rank={index} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {product.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {product.totalQuantitySold} sold
                            </p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-foreground">
                            {formatPrice(product.totalRevenueGenerated)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
