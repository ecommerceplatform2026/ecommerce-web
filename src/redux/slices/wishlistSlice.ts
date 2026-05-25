import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Product, WishlistState } from '@/types/product'

const initialState: WishlistState = {
    items: [],
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<Product>) {
            const exists = state.items.some(i => i.id === action.payload.id)
            if (!exists) {
                state.items.push(action.payload)
            }
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i.id !== action.payload)
        },
        toggleItem(state, action: PayloadAction<Product>) {
            const index = state.items.findIndex(i => i.id === action.payload.id)
            if (index !== -1) {
                state.items.splice(index, 1)
            } else {
                state.items.push(action.payload)
            }
        },
        clearWishlist(state) {
            state.items = []
        },
    },
})

export const selectWishlistItems = (state: RootState) => state.wishlist.items
export const selectWishlistCount = (state: RootState) => state.wishlist.items.length
export const selectIsInWishlist  = (id: string) => (state: RootState) =>
    state.wishlist.items.some(i => i.id === id)

export const { addItem, removeItem, toggleItem, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
