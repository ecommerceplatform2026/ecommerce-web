// Matches C# WishlistItemResponse DTO
export interface WishlistItem {
    id: string
    productVariantId: string
    productId: string
    productName: string
    productImageUrl: string | null
    sku: string
    color: string | null
    size: string | null
    price: number
    stock: number
    isOutOfStock: boolean
    isLowStock: boolean
    stockStatus: string
}

export interface AddToWishlistRequest {
    productVariantId: string
}

export interface MergeWishlistRequest {
    guestVariantIds: string[]
}
