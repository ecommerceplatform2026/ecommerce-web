'use client'

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { CreditCard } from 'lucide-react'
import { PaymentMethod, PAYMENT_METHOD_LABEL } from '@/constants/enums'
import { formatPrice } from '@/utils/formatPrice'
import { ChartLegend } from '@/components/admin/dashboard/ChartLegend'
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
                <PieChart>
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
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <ChartLegend
                data={data.map((item, index) => ({
                    name: methodLabel(item.method),
                    value: item.count,
                    color: CHART_COLORS[index % CHART_COLORS.length],
                }))}
            />
        </div>
    )
}
