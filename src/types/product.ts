import type { ProductStatus } from '@/constants/enums'

export interface ProductImage {
    id: string
    imageUrl: string
    productId?: string
    isMain?: boolean
}

// Matches C# ProductVariantResponse DTO
export interface ProductVariantResponse {
    id: string
    productId?: string
    sku: string
    color: string | null
    size: string | null
    stock: number
    lowStockThreshold?: number
    price: number
    stockStatus?: string
    isLowStock?: boolean
    isOutOfStock?: boolean
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
    imageUrl?: string | null
    minPrice?: number
    maxPrice?: number
    totalStock?: number
    stockStatus?: string
    averageRating?: number
    reviewCount?: number
    variants: ProductVariantResponse[]
}

export interface ProductDetail extends Product {
    price?: number
    images: ProductImage[]
}

export interface ProductFormValues {
    categoryId: string
    name: string
    description: string | null
    material: string | null
    basePrice: number
    status: ProductStatus
}

export interface ProductVariantFormValues {
    sku: string
    color: string | null
    size: string | null
    stock: number
    lowStockThreshold: number
    price: number
}

export interface WishlistState {
    items: Product[]
}
