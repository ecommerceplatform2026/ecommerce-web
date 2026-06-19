'use client'

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
import { useMemo, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { PaymentMethod, PAYMENT_METHOD_LABEL } from '@/constants/enums'
import { formatPrice } from '@/utils/formatPrice'
import type { PaymentMethodSummary } from '@/types/dashboard'

interface PaymentMethodChartProps {
    data: PaymentMethodSummary[] | undefined
    isLoading: boolean
}

const CHART_COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
]

function methodLabel(method: string): string {
    const enumKey = method as keyof typeof PaymentMethod
    const enumValue = PaymentMethod[enumKey]
    if (enumValue !== undefined) {
        return PAYMENT_METHOD_LABEL[enumValue as PaymentMethod] ?? method
    }
    return method
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; payload: PaymentMethodSummary }[] }) {
    if (!active || !payload?.length) return null
    const item = payload[0].payload
    return (
        <div className="rounded-none border border-border bg-card px-3 py-2 text-sm shadow-none">
            <p className="font-medium text-foreground">{methodLabel(item.method)}</p>
            <p className="text-muted-foreground">Order count: {item.count}</p>
            <p className="text-muted-foreground">Total revenue: {formatPrice(item.revenue)}</p>
        </div>
    )
}

export function PaymentMethodChart({ data, isLoading }: PaymentMethodChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const total = useMemo(() => (data ?? []).reduce((s, d) => s + d.count, 0), [data])

    if (isLoading) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <Skeleton className="mb-4 h-5 w-44 rounded-none" />
                <Skeleton className="h-60 w-full rounded-none" />
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="rounded-none border border-border bg-card p-6">
                <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                    Payment Methods
                </p>
                <EmptyState
                    icon={<CreditCard />}
                    title="No data for this period"
                    className="py-12"
                />
            </div>
        )
    }

    return (
        <div className="rounded-none border border-border bg-card p-6">
            <p className="mb-4 font-heading text-lg tracking-tight text-foreground">
                Payment Methods
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart onClick={() => setActiveIndex(null)}>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                    >
                        {data.map((_, index) => (
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

            {activeIndex !== null && data && data[activeIndex] && (
                <div className="mt-4 rounded-none border border-border bg-secondary/50 px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">{methodLabel(data[activeIndex].method)}</p>
                    <p className="mt-1 text-muted-foreground">
                        {data[activeIndex].count} orders ({total > 0 ? ((data[activeIndex].count / total) * 100).toFixed(1) : 0}%)
                    </p>
                </div>
            )}
        </div>
    )
}
