export interface CartItem {
    productId: string
    variantId: string       // unique per size+color — dùng làm key trong cart
    name: string
    price: number
    size: string
    color: string
    quantity: number
    imageUrl: string | null
}

export interface CartState {
    items: CartItem[]
    isLoading: boolean
}
