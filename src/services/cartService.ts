import axiosInstance from '@/lib/axios'
import { CART_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { CartItem } from '@/types/cart'

type ServerCartItem = {
    id?: string
    itemId?: string
    productVariantId?: string
    variantId?: string
    productId?: string
    productName?: string
    name?: string
    productImageUrl?: string | null
    imageUrl?: string | null
    sku?: string
    color?: string | null
    size?: string | null
    price?: number
    quantity?: number
    stock?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
}

function mapServerItem(item: ServerCartItem): CartItem {
    return {
        itemId: item.id ?? item.itemId,
        productId: item.productId ?? '',
        variantId: item.productVariantId ?? item.variantId ?? '',
        sku: item.sku,
        name: item.productName ?? item.name ?? 'Product',
        price: item.price ?? 0,
        size: item.size ?? '',
        color: item.color ?? '',
        quantity: item.quantity ?? 1,
        stock: item.stock ?? 0,
        isLowStock: item.isLowStock,
        isOutOfStock: item.isOutOfStock,
        imageUrl: item.productImageUrl ?? item.imageUrl ?? null,
    }
}

function buildMergePayload(items: CartItem[]) {
    const grouped = new Map<string, { productVariantId: string; quantity: number; stock: number }>()

    for (const item of items) {
        if (!item.variantId || item.quantity <= 0 || item.isOutOfStock || item.stock <= 0) {
            continue
        }

        const existing = grouped.get(item.variantId)
        const nextQuantity = (existing?.quantity ?? 0) + item.quantity
        grouped.set(item.variantId, {
            productVariantId: item.variantId,
            quantity: Math.min(nextQuantity, item.stock),
            stock: item.stock,
        })
    }

    return Array.from(grouped.values()).map(({ productVariantId, quantity }) => ({
        productVariantId,
        quantity,
    }))
}

async function getCart(): Promise<CartItem[]> {
    const res = await axiosInstance.get<ApiResponse<ServerCartItem[]>>(CART_ENDPOINTS.GET)
    return res.data.data.map(mapServerItem)
}

export const cartService = {
    getCart,

    addItem: async (variantId: string, quantity: number): Promise<CartItem> => {
        const res = await axiosInstance.post<ApiResponse<ServerCartItem>>(
            CART_ENDPOINTS.ADD_ITEM,
            { productVariantId: variantId, quantity },
        )
        return mapServerItem(res.data.data)
    },

    updateItem: async (variantId: string, quantity: number): Promise<CartItem> => {
        const res = await axiosInstance.put<ApiResponse<ServerCartItem>>(
            CART_ENDPOINTS.UPDATE_ITEM(variantId),
            { quantity },
        )
        return mapServerItem(res.data.data)
    },

    removeItem: async (variantId: string): Promise<boolean> => {
        const res = await axiosInstance.delete<ApiResponse<boolean>>(
            CART_ENDPOINTS.REMOVE_ITEM(variantId),
        )
        return res.data.data
    },

    mergeGuestCart: async (items: CartItem[]): Promise<CartItem[]> => {
        const mergeItems = buildMergePayload(items)
        if (mergeItems.length === 0) {
            return getCart()
        }

        const res = await axiosInstance.post<ApiResponse<ServerCartItem[]>>(
            CART_ENDPOINTS.MERGE,
            { items: mergeItems },
        )
        return res.data.data.map(mapServerItem)
    },
}
