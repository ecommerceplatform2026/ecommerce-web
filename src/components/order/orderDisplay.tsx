import { Badge } from '@/components/ui/Badge'
import {
    ORDER_STATUS_COLOR,
    ORDER_STATUS_LABEL,
    PAYMENT_METHOD_LABEL,
    OrderStatus,
    type PaymentMethod,
} from '@/constants/enums'
import type { OrderItemSnapshot } from '@/types/order'

export const ORDER_STATUS_STEPS = [
    OrderStatus.Pending,
    OrderStatus.Confirmed,
    OrderStatus.Processing,
    OrderStatus.Shipping,
    OrderStatus.Delivered,
] as const

export function formatCurrency(value: number) {
    return `${value.toLocaleString('vi-VN')} VND`
}

export function formatOrderDate(value: string) {
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

export function parseProductSnapshot(snapshot: string): OrderItemSnapshot {
    try {
        const parsed = JSON.parse(snapshot) as OrderItemSnapshot
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

export function getSnapshotSku(snapshot: OrderItemSnapshot) {
    if (typeof snapshot.SKU === 'string') return snapshot.SKU
    return snapshot.SKU?.Value ?? null
}

export function getPaymentLabel(paymentMethod: PaymentMethod) {
    return PAYMENT_METHOD_LABEL[paymentMethod] ?? `Payment #${paymentMethod}`
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <Badge className={`border-transparent ${ORDER_STATUS_COLOR[status]}`}>
            {ORDER_STATUS_LABEL[status] ?? `Status #${status}`}
        </Badge>
    )
}

export function getOrderStatusTone(status: OrderStatus) {
    if (status === OrderStatus.Delivered) return 'border-green-200 bg-green-50'
    if (status === OrderStatus.Cancelled) return 'border-red-200 bg-red-50'
    if (status === OrderStatus.Returned) return 'border-gray-200 bg-gray-50'
    if (status === OrderStatus.Shipping) return 'border-indigo-200 bg-indigo-50'
    if (status === OrderStatus.Processing) return 'border-purple-200 bg-purple-50'
    if (status === OrderStatus.Confirmed) return 'border-blue-200 bg-blue-50'
    return 'border-yellow-200 bg-yellow-50'
}

export function getOrderProgressValue(status: OrderStatus) {
    if (status === OrderStatus.Cancelled || status === OrderStatus.Returned) return 100

    const index = ORDER_STATUS_STEPS.indexOf(status as (typeof ORDER_STATUS_STEPS)[number])
    if (index < 0) return 0

    return Math.round(((index + 1) / ORDER_STATUS_STEPS.length) * 100)
}
