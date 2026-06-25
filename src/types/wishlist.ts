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

export interface MoveToCartRequest {
    quantity: number
}

/** Response from POST /api/wishlist/items/{variantId}/move-to-cart */
export interface MoveToCartResponse {
    cartItemId?: string
    productVariantId: string
    quantity: number
}

