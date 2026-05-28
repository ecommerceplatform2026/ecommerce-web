export interface CartItem {
    itemId?: string
    productId: string
    variantId: string
    sku?: string
    name: string
    price: number
    size: string
    color: string
    quantity: number
    stock: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    imageUrl: string | null
}

export interface CartState {
    items: CartItem[]
    isLoading: boolean
    error: string | null
    hydrated: boolean
    mode: 'guest' | 'user' | null
}
