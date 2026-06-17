import type { ReviewRating, ReviewStatus } from '@/constants/enums'

export interface ReviewRequest {
    productId: string
    orderId: string
    rating: ReviewRating
    comment: string
}

export interface EligibleOrderDto {
    orderId: string
    orderCode: number
    createdAt: string
    status: string
}

export interface ReviewEligibilityResponse {
    isEligible: boolean
    eligibleOrders: EligibleOrderDto[]
}

export interface ReviewResponse {
    id: string
    productId: string
    userId: string
    userName: string
    fullName?: string
    rating: ReviewRating
    comment: string
    status: ReviewStatus
    createdAt: string
}

export interface ReviewListResult {
    items: ReviewResponse[]
    averageRating: number
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
}
