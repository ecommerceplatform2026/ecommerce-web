'use client'

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { BarChart3 } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import type { TopSellingProduct } from '@/types/dashboard'

interface TopProductsChartProps {
    data: TopSellingProduct[] | undefined
    isLoading: boolean
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-none border border-border bg-card px-3 py-2 text-sm shadow-none">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-muted-foreground">Sold: {payload[0].value}</p>
            {payload[1] && (
                <p className="text-muted-foreground">Revenue: {formatPrice(payload[1].value)}</p>
            )}
        </div>
    )
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-40 rounded-none" />
                <Skeleton className="h-60 w-full rounded-none" />
            </div>
        )
    }

    const chartData = data?.map((p) => ({
        name: p.productName,
        sold: p.totalQuantitySold,
        revenue: p.totalRevenueGenerated,
    }))

    if (!chartData?.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                    Top Products
                </p>
                <EmptyState
                    icon={<BarChart3 />}
                    title="No data for this period"
                    className="py-12"
                />
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                Top Products
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-border)' }}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sold" fill="var(--color-chart-2)" radius={[0, 0, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
