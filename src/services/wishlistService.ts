import axiosInstance from '@/lib/axios'
import { WISHLIST_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { WishlistItem, AddToWishlistRequest, MergeWishlistRequest } from '@/types/wishlist'

export const wishlistService = {
    getWishlist: async (): Promise<WishlistItem[]> => {
        const res = await axiosInstance.get<ApiResponse<WishlistItem[]>>(
            WISHLIST_ENDPOINTS.GET,
        )
        return res.data.data
    },

    addItem: async (productVariantId: string): Promise<WishlistItem> => {
        const payload: AddToWishlistRequest = { productVariantId }
        const res = await axiosInstance.post<ApiResponse<WishlistItem>>(
            WISHLIST_ENDPOINTS.ADD_ITEM,
            payload,
        )
        return res.data.data
    },

    removeItem: async (variantId: string): Promise<void> => {
        await axiosInstance.delete<ApiResponse<unknown>>(
            WISHLIST_ENDPOINTS.REMOVE_ITEM(variantId),
        )
    },

    mergeWishlist: async (guestVariantIds: string[]): Promise<WishlistItem[]> => {
        const payload: MergeWishlistRequest = { guestVariantIds }
        const res = await axiosInstance.post<ApiResponse<WishlistItem[]>>(
            WISHLIST_ENDPOINTS.MERGE,
            payload,
        )
        return res.data.data
    },
}
