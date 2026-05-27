import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { CartItem, CartState } from '@/types/cart'
import { cartService } from '@/services/cartService'

const initialState: CartState = {
    items: [],
    isLoading: false,
}

// ── Async thunks ───────────────────────────────────────────────────────────

// Gọi khi user đăng nhập — load cart từ server về Redux
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await cartService.getCart()
        } catch (err) {
            return rejectWithValue(err)
        }
    },
)

// Gọi ngay sau fetchCart nếu có guest cart — gộp local cart vào server cart
export const mergeGuestCart = createAsyncThunk(
    'cart/merge',
    async (items: CartItem[], { rejectWithValue }) => {
        try {
            return await cartService.mergeGuestCart(items)
        } catch (err) {
            return rejectWithValue(err)
        }
    },
)

// ── Slice ──────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<CartItem>) {
            const existing = state.items.find(i => i.variantId === action.payload.variantId)
            if (existing) {
                existing.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i.variantId !== action.payload)
        },
        updateQuantity(state, action: PayloadAction<{ variantId: string; quantity: number }>) {
            const item = state.items.find(i => i.variantId === action.payload.variantId)
            if (item) item.quantity = action.payload.quantity
        },
        clearCart(state) {
            state.items = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending,   (state) => { state.isLoading = true })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false
                state.items = action.payload
            })
            .addCase(fetchCart.rejected,  (state) => { state.isLoading = false })

            .addCase(mergeGuestCart.pending,   (state) => { state.isLoading = true })
            .addCase(mergeGuestCart.fulfilled, (state, action) => {
                state.isLoading = false
                state.items = action.payload
            })
            .addCase(mergeGuestCart.rejected,  (state) => { state.isLoading = false })
    },
})

// ── Selectors ──────────────────────────────────────────────────────────────

export const selectCartItems     = (state: RootState) => state.cart.items
export const selectCartIsLoading = (state: RootState) => state.cart.isLoading
export const selectCartCount     = (state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotal     = (state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
