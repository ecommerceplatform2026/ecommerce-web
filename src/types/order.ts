import { DeliveryStatus, OrderStatus, PaymentMethod } from '@/constants/enums'
import type { LoyaltyTransaction } from './loyalty'

export interface OrderItemResponse {
    id: string
    productVariantId: string
    quantity: number
    price: number
    productSnapshot: string
}

export interface OrderItemSnapshot {
    ProductId?: string
    ProductName?: string
    ProductDescription?: string | null
    Material?: string | null
    SKU?: {
        Value?: string
    } | string
    Color?: string | null
    Size?: string | null
    Price?: {
        Amount?: number
        Currency?: string
    } | number
    ProductImageUrl?: string | null
}

export interface TrackingInfo {
    trackingCode: string
    carrierCode: string
    status: DeliveryStatus
}

export interface OrderResponse {
    id: string
    orderCode: number
    totalAmount: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    createdAt: string
    items: OrderItemResponse[]
    tracking?: TrackingInfo | null
    loyaltyTransactions?: LoyaltyTransaction[]
}

export interface CheckoutRequest {
    paymentMethod: PaymentMethod
    redeemedPoints?: number | null
}

export interface CheckoutItemResponse {
    orderItemId: string
    productVariantId: string
    quantity: number
    price: number
    productSnapshot: string
}

export interface CheckoutResponse {
    orderId: string
    orderCode: number
    totalAmount: number
    discountAmount: number
    paidAmount: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    items: CheckoutItemResponse[]
    checkoutUrl?: string | null
    paymentLinkId?: string | null
}
