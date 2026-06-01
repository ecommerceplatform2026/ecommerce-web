import type { OrderStatus, PaymentMethod } from '@/constants/enums'

export interface CheckoutFormValues {
    paymentMethod: PaymentMethod
}

export interface CreateOrderRequest {
    paymentMethod: PaymentMethod
}

export interface CheckoutItem {
    orderItemId: string
    productVariantId: string
    quantity: number
    price: number
    productSnapshot: string
}

export interface CheckoutResult {
    orderId: string
    orderCode: number
    totalAmount: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    items: CheckoutItem[]
    checkoutUrl?: string | null
    paymentLinkId?: string | null
}

export interface OrderQueryParams {
    page?: number
    pageSize?: number
    status?: OrderStatus
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
}

export interface OrderItem {
    id: string
    productVariantId: string
    quantity: number
    price: number
    productSnapshot: string
}

export interface Order {
    id: string
    orderCode: number
    totalAmount: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    createdAt: string
    items: OrderItem[]
}

export interface OrderListResult {
    items: Order[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
