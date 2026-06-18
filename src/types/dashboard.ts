export interface DashboardRequest {
    startDate?: string
    endDate?: string
}

export interface DashboardSummary {
    totalOrders: number
    totalRevenue: number
    topSellingProducts: TopSellingProduct[]
    lowStockVariants: LowStockVariant[]
    orderStatusSummary: Record<string, number>
}

export interface TopSellingProduct {
    productId: string
    productName: string
    totalQuantitySold: number
    totalRevenueGenerated: number
}

export interface LowStockVariant {
    variantId: string
    sku: string
    productName: string
    color: string | null
    size: string | null
    currentStock: number
    lowStockThreshold: number
}

export interface RevenueTrendPoint {
    date: string
    revenue: number
    orders: number
}

export interface PaymentMethodSummary {
    method: string
    count: number
    revenue: number
}
