import { DeliveryStatus } from '@/constants/enums'

export interface DeliveryListItem {
    id: string
    orderId?: string | number | null
    orderCode?: number | null
    status?: DeliveryStatus | number | string | null
    carrier?: string | null
    trackingCode?: string | null
    createdAt?: string | null
    updatedAt?: string | null
}

export interface DeliveryListFilters {
    page?: number
    pageSize?: number
    status?: string | number
    orderId?: string
    startDate?: string
    endDate?: string
}

export interface CreateDeliveryRequest {
    orderId: string
    carrier?: string | null
}

export interface DeliveryListData {
    items: DeliveryListItem[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
