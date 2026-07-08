export const LoyaltyTransactionType = { Earn: 0, Redeem: 1, Expired: 2 } as const
export const LoyaltyTransactionStatus = { Pending: 0, Completed: 1, Cancelled: 2 } as const

export interface LoyaltyBalanceResponse {
    balance: number
    pendingPoints: number
    discountEquivalent: number
    totalEarned: number
    totalRedeemed: number
    lastUpdated: string
}

export interface LoyaltyTransaction {
    id: string
    date: string
    type: number
    points: number
    orderId: string
    description: string
    status: number
}

export interface PaginatedTransactions {
    items: LoyaltyTransaction[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
