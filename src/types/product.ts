import type { ProductStatus } from '@/constants/enums'

export interface ProductSearchParams {
    search?: string
    categoryId?: string
    minPrice?: number | null
    maxPrice?: number | null
    material?: string
    color?: string
    size?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    page?: number
    pageSize?: number
}

// Matches C# ProductVariantResponse DTO
export interface ProductVariantResponse {
    id: string
    productId: string
    sku: string
    color: string | null
    size: string | null
    stock: number
    lowStockThreshold: number
    price: number
    isLowStock: boolean
    isOutOfStock: boolean
}

// Matches C# ProductResponse DTO
export interface Product {
    id: string
    categoryId: string
    categoryName: string | null
    name: string
    description: string | null
    material: string | null
    basePrice: number
    status: ProductStatus
    variants: ProductVariantResponse[]
}

export interface WishlistState {
    items: Product[]
}
