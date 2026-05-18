import type { ProductStatus } from '@/constants/enums'

// Matches C# ProductResponse DTO
export interface Product {
    id: string
    categoryId: string
    categoryName: string | null
    name: string
    description: string | null
    material: string | null
    basePrice: number           // C# long → TS number
    status: ProductStatus
}

// Local product type — dùng cho mock data và hiển thị UI
export interface LocalProduct {
    id: string
    name: string
    category: string
    price: number
    description: string
    images: string[]
    sizes: string[]
    colors: string[]
    featured?: boolean
    stock: number
}

export interface WishlistState {
    items: Product[]
}
