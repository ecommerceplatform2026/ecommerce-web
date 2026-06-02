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

export interface ProductImage {
    id: string
    productId?: string
    imageUrl: string
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

export interface ProductDetailVariant {
    id: string
    sku: string
    color: string | null
    size: string | null
    stock: number
    stockStatus: string
    price: number
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

export interface ProductDetail extends Omit<Product, 'variants'> {
    price: number
    minPrice: number
    maxPrice: number
    totalStock: number
    stockStatus: string
    images: ProductImage[]
    variants: ProductDetailVariant[]
}

export interface WishlistState {
    items: Product[]
}
