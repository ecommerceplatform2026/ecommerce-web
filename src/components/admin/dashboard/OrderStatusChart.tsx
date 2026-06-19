'use client'

import { useMemo, useState } from 'react'
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { PieChart as PieIcon } from 'lucide-react'
import { OrderStatus, ORDER_STATUS_LABEL } from '@/constants/enums'

interface OrderStatusChartProps {
    data: Record<string, number> | undefined
    isLoading: boolean
}

const CHART_COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
]

function statusLabel(key: string): string {
    const enumKey = key as keyof typeof OrderStatus
    const enumValue = OrderStatus[enumKey]
    if (enumValue !== undefined) {
        return ORDER_STATUS_LABEL[enumValue as OrderStatus] ?? key
    }
    return key
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-none border border-border bg-card px-3 py-2 text-sm shadow-none">
            <p className="font-medium text-foreground">{payload[0].name}</p>
            <p className="text-muted-foreground">Orders: {payload[0].value}</p>
        </div>
    )
}

export function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const chartData = useMemo(() => {
        if (!data) return []
        return Object.entries(data).map(([key, value]) => ({
            name: statusLabel(key),
            value,
        }))
    }, [data])

    const total = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData])

    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-36 rounded-none" />
                <Skeleton className="h-60 w-full rounded-none" />
            </div>
        )
    }

    if (!chartData.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                    Order Status
                </p>
                <EmptyState
                    icon={<PieIcon />}
                    title="No data for this period"
                    className="py-12"
                />
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                Order Status
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart onClick={() => setActiveIndex(null)}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                    >
                        {chartData.map((_, index) => (
                            <Cell
                                key={index}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                className="outline-none focus:outline-none"
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setActiveIndex(index) }}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span className="text-sm text-muted-foreground">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {activeIndex !== null && chartData[activeIndex] && (
                <div className="mt-4 rounded-none border border-border bg-secondary/50 px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">{chartData[activeIndex].name}</p>
                    <p className="mt-1 text-muted-foreground">
                        {chartData[activeIndex].value} orders ({total > 0 ? ((chartData[activeIndex].value / total) * 100).toFixed(1) : 0}%)
                    </p>
                </div>
            )}
        </div>
    )
}
