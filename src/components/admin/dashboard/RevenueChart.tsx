'use client'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { TrendingUp } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import type { RevenueTrendPoint } from '@/types/dashboard'

interface RevenueChartProps {
    data: RevenueTrendPoint[] | undefined
    isLoading: boolean
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-none border border-border bg-card px-3 py-2 text-sm shadow-none">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-muted-foreground">Revenue: {formatPrice(payload[0].value)}</p>
            {payload[1] && (
                <p className="text-muted-foreground">Orders: {payload[1].value}</p>
            )}
        </div>
    )
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-36 rounded-none" />
                <Skeleton className="h-60 w-full rounded-none" />
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                    Revenue Trend
                </p>
                <EmptyState
                    icon={<TrendingUp />}
                    title="No data for this period"
                    className="py-12"
                />
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                Revenue Trend
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-border)' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-border)' }}
                        tickFormatter={(v: number) => formatPrice(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, stroke: 'var(--color-chart-1)', fill: 'var(--color-card)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
