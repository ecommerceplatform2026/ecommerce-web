import axiosInstance from '@/lib/axios'
import { CART_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, ApiResponseNoData } from '@/types/api'
import type { CartItem } from '@/types/cart'

// ── Backend shapes ─────────────────────────────────────────────────────────

interface ServerCartItem {
    itemId: string
    productId: string
    variantId: string
    name: string
    price: number
    size: string
    color: string
    quantity: number
    imageUrl: string | null
}

interface ServerCart {
    items: ServerCartItem[]
}

function mapServerItem(item: ServerCartItem): CartItem {
    return {
        itemId:    item.itemId,
        productId: item.productId,
        variantId: item.variantId,
        name:      item.name,
        price:     item.price,
        size:      item.size,
        color:     item.color,
        quantity:  item.quantity,
        imageUrl:  item.imageUrl,
    }
}

// ── Service ────────────────────────────────────────────────────────────────

export const cartService = {
    getCart: async (): Promise<CartItem[]> => {
        const res = await axiosInstance.get<ApiResponse<ServerCart>>(CART_ENDPOINTS.GET)
        return res.data.data.items.map(mapServerItem)
    },

    addItem: async (variantId: string, quantity: number): Promise<void> => {
        await axiosInstance.post<ApiResponse<ServerCartItem>>(
            CART_ENDPOINTS.ADD_ITEM,
            { variantId, quantity },
        )
    },

    updateItem: async (itemId: string, quantity: number): Promise<void> => {
        await axiosInstance.put<ApiResponse<ServerCartItem>>(
            CART_ENDPOINTS.UPDATE_ITEM(itemId),
            { quantity },
        )
    },

    removeItem: async (itemId: string): Promise<void> => {
        await axiosInstance.delete<ApiResponseNoData>(CART_ENDPOINTS.REMOVE_ITEM(itemId))
    },

    clearCart: async (): Promise<void> => {
        await axiosInstance.delete<ApiResponseNoData>(CART_ENDPOINTS.CLEAR)
    },

    mergeGuestCart: async (items: CartItem[]): Promise<CartItem[]> => {
        const res = await axiosInstance.post<ApiResponse<ServerCart>>(
            CART_ENDPOINTS.MERGE,
            { items },
        )
        return res.data.data.items.map(mapServerItem)
    },
}
