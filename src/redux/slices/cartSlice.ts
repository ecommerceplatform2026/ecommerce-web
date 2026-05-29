import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { CartItem, CartState } from '@/types/cart'
import { cartService } from '@/services/cartService'

const GUEST_CART_KEY = 'atelier_guest_cart'

const initialState: CartState = {
    items: [],
    isLoading: false,
    error: null,
    hydrated: false,
    mode: null,
}

function getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === 'string') return message
    }
    return 'Cart operation failed.'
}

function readGuestCart(): CartItem[] {
    if (typeof window === 'undefined') return []

    try {
        const raw = window.localStorage.getItem(GUEST_CART_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as CartItem[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeGuestCart(items: CartItem[]) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

function upsertGuestItem(items: CartItem[], item: CartItem): CartItem[] {
    if (item.quantity <= 0) throw new Error('Quantity must be greater than zero.')
    if (item.isOutOfStock || item.stock <= 0) throw new Error('Product is out of stock.')

    const existing = items.find(cartItem => cartItem.variantId === item.variantId)
    const nextQuantity = (existing?.quantity ?? 0) + item.quantity

    if (nextQuantity > item.stock) {
        throw new Error(`Insufficient stock available. Maximum available stock is ${item.stock}.`)
    }

    if (!existing) return [...items, item]

    return items.map(cartItem =>
        cartItem.variantId === item.variantId
            ? { ...cartItem, quantity: nextQuantity, stock: item.stock, isLowStock: item.isLowStock, isOutOfStock: item.isOutOfStock }
            : cartItem,
    )
}

function updateGuestItem(items: CartItem[], variantId: string, quantity: number): CartItem[] {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero.')

    return items.map(item => {
        if (item.variantId !== variantId) return item
        if (item.isOutOfStock || item.stock <= 0) throw new Error('Product is out of stock.')
        if (quantity > item.stock) {
            throw new Error(`Insufficient stock available. Maximum available stock is ${item.stock}.`)
        }
        return { ...item, quantity }
    })
}

export const hydrateCart = createAsyncThunk(
    'cart/hydrate',
    async ({ isAuthenticated }: { isAuthenticated: boolean }, { rejectWithValue }) => {
        try {
            if (isAuthenticated) {
                return { items: await cartService.getCart(), mode: 'user' as const }
            }

            return { items: readGuestCart(), mode: 'guest' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const addCartItem = createAsyncThunk(
    'cart/addCartItem',
    async (
        { item, isAuthenticated }: { item: CartItem; isAuthenticated: boolean },
        { getState, rejectWithValue },
    ) => {
        try {
            if (isAuthenticated) {
                await cartService.addItem(item.variantId, item.quantity)
                return { items: await cartService.getCart(), mode: 'user' as const }
            }

            const state = getState() as RootState
            const items = upsertGuestItem(state.cart.items, item)
            writeGuestCart(items)
            return { items, mode: 'guest' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async (
        { variantId, quantity, isAuthenticated }: { variantId: string; quantity: number; isAuthenticated: boolean },
        { getState, rejectWithValue },
    ) => {
        try {
            if (isAuthenticated) {
                await cartService.updateItem(variantId, quantity)
                return { items: await cartService.getCart(), mode: 'user' as const }
            }

            const state = getState() as RootState
            const items = updateGuestItem(state.cart.items, variantId, quantity)
            writeGuestCart(items)
            return { items, mode: 'guest' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (
        { variantId, isAuthenticated }: { variantId: string; isAuthenticated: boolean },
        { getState, rejectWithValue },
    ) => {
        try {
            if (isAuthenticated) {
                await cartService.removeItem(variantId)
                return { items: await cartService.getCart(), mode: 'user' as const }
            }

            const state = getState() as RootState
            const items = state.cart.items.filter(item => item.variantId !== variantId)
            writeGuestCart(items)
            return { items, mode: 'guest' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const mergeGuestCart = createAsyncThunk(
    'cart/merge',
    async (items: CartItem[], { rejectWithValue }) => {
        try {
            const merged = await cartService.mergeGuestCart(items)
            writeGuestCart([])
            return { items: merged, mode: 'user' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

export const mergeStoredGuestCart = createAsyncThunk(
    'cart/mergeStoredGuestCart',
    async (_, { rejectWithValue }) => {
        try {
            const guestItems = readGuestCart()
            if (guestItems.length === 0) {
                return { items: await cartService.getCart(), mode: 'user' as const }
            }

            const merged = await cartService.mergeGuestCart(guestItems)
            writeGuestCart([])
            return { items: merged, mode: 'user' as const }
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    },
)

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart(state) {
            state.items = []
            state.error = null
            if (state.mode === 'guest') writeGuestCart([])
        },
        resetCartHydration(state) {
            state.hydrated = false
            state.mode = null
        },
        setCartItems(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload
        },
    },
    extraReducers: (builder) => {
        const pending = (state: CartState) => {
            state.isLoading = true
            state.error = null
        }
        const rejected = (state: CartState, action: { payload: unknown }) => {
            state.isLoading = false
            state.hydrated = true
            state.error = typeof action.payload === 'string' ? action.payload : 'Cart operation failed.'
        }
        const fulfilled = (
            state: CartState,
            action: PayloadAction<{ items: CartItem[]; mode: 'guest' | 'user' }>,
        ) => {
            state.isLoading = false
            state.error = null
            state.hydrated = true
            state.mode = action.payload.mode
            state.items = action.payload.items
        }

        builder
            .addCase(hydrateCart.pending, pending)
            .addCase(hydrateCart.fulfilled, fulfilled)
            .addCase(hydrateCart.rejected, rejected)
            .addCase(addCartItem.pending, pending)
            .addCase(addCartItem.fulfilled, fulfilled)
            .addCase(addCartItem.rejected, rejected)
            .addCase(updateCartItemQuantity.pending, pending)
            .addCase(updateCartItemQuantity.fulfilled, fulfilled)
            .addCase(updateCartItemQuantity.rejected, rejected)
            .addCase(removeCartItem.pending, pending)
            .addCase(removeCartItem.fulfilled, fulfilled)
            .addCase(removeCartItem.rejected, rejected)
            .addCase(mergeGuestCart.pending, pending)
            .addCase(mergeGuestCart.fulfilled, fulfilled)
            .addCase(mergeGuestCart.rejected, rejected)
            .addCase(mergeStoredGuestCart.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.mode = 'user'
            })
            .addCase(mergeStoredGuestCart.fulfilled, fulfilled)
            .addCase(mergeStoredGuestCart.rejected, rejected)
    },
})

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartIsLoading = (state: RootState) => state.cart.isLoading
export const selectCartError = (state: RootState) => state.cart.error
export const selectCartHydrated = (state: RootState) => state.cart.hydrated
export const selectCartMode = (state: RootState) => state.cart.mode
export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const { clearCart, resetCartHydration, setCartItems } = cartSlice.actions
export default cartSlice.reducer
