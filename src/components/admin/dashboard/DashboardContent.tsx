'use client'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react'
import { useDashboardSummary, useRevenueTrend, usePaymentMethods } from '@/hooks/useDashboard'
import { KpiCard } from '@/components/admin/dashboard/KpiCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { OrderStatusChart } from '@/components/admin/dashboard/OrderStatusChart'
import { PaymentMethodChart } from '@/components/admin/dashboard/PaymentMethodChart'
import { DateRangeFilter } from '@/components/admin/dashboard/DateRangeFilter'
import { TopProductsList } from '@/components/admin/dashboard/TopProductsList'
import { LowStockAlerts } from '@/components/admin/dashboard/LowStockAlerts'
import { DashboardSkeleton } from '@/components/admin/dashboard/DashboardSkeleton'
import { formatPrice } from '@/utils/formatPrice'
import type { DashboardRequest } from '@/types/dashboard'

export function DashboardContent() {
    const [startDate, setStartDate] = useState<string>(
        dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    )
    const [endDate, setEndDate] = useState<string>(
        dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    )

    const params = useMemo<DashboardRequest>(() => {
        const result: DashboardRequest = {}
        if (startDate) result.startDate = startDate
        if (endDate) result.endDate = endDate
        return result
    }, [startDate, endDate])

    const { data: summary, isLoading } = useDashboardSummary(params)
    const { data: revenueTrend, isLoading: isRevenueLoading } = useRevenueTrend(params)
    const { data: paymentMethods, isLoading: isPaymentLoading } = usePaymentMethods(params)

    const kpis = useMemo(() => {
        if (!summary) return null

        const totalOrders = summary.totalOrders
        const totalRevenue = summary.totalRevenue
        const aov = totalOrders > 0 ? formatPrice(totalRevenue / totalOrders) : '—'
        const topProductCount = summary.topSellingProducts.length

        return {
            totalOrders: totalOrders.toLocaleString(),
            totalRevenue: formatPrice(totalRevenue),
            aov,
            topProductCount: topProductCount.toString(),
        }
    }, [summary])

    if (isLoading) return <DashboardSkeleton />

    return (
        <div className="px-4 py-10 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Admin
                    </p>
                    <h1 className="mt-1 font-heading text-4xl tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="mt-1 font-body text-sm text-muted-foreground">
                        Overview of your store&apos;s performance
                    </p>
                </div>

                <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(s, e) => {
                        setStartDate(s ?? '')
                        setEndDate(e ?? '')
                    }}
                />

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        title="Total Orders"
                        value={kpis?.totalOrders ?? '—'}
                        icon={<ShoppingCart />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        title="Total Revenue"
                        value={kpis?.totalRevenue ?? '—'}
                        icon={<DollarSign />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        title="Average Order Value"
                        value={kpis?.aov ?? '—'}
                        icon={<TrendingUp />}
                        isLoading={isLoading}
                    />
                    <KpiCard
                        title="Top Products"
                        value={kpis?.topProductCount ?? '—'}
                        icon={<Package />}
                        isLoading={isLoading}
                    />
                </div>

                <div className="mb-8">
                    <RevenueChart
                        data={revenueTrend}
                        isLoading={isRevenueLoading}
                    />
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <OrderStatusChart
                        data={summary?.orderStatusSummary}
                        isLoading={isLoading}
                    />
                    <PaymentMethodChart
                        data={paymentMethods}
                        isLoading={isPaymentLoading}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <TopProductsList
                        data={summary?.topSellingProducts}
                        isLoading={isLoading}
                    />
                    <LowStockAlerts
                        data={summary?.lowStockVariants}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}
