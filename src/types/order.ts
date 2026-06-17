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
