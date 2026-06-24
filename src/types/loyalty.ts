export interface LoyaltyBalanceResponse {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    lastUpdated: string
}

export interface LoyaltyTransaction {
    id: string
    date: string
    type: "Earn" | "Redeem" | "Expired"
    points: number
    orderId: number
    description: string
}

export interface PaginatedTransactions {
    items: LoyaltyTransaction[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
