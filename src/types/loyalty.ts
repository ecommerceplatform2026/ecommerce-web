export interface LoyaltyBalanceResponse {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    lastUpdated: string
}

export interface LoyaltyTransaction {
    id: string
    type: 'earned' | 'redeemed'
    points: number
    description: string
    orderCode: number
    status: 'pending' | 'completed'
    createdAt: string
}

export interface PaginatedTransactions {
    items: LoyaltyTransaction[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
