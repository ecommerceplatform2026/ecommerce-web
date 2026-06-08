import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
    hydrateCart,
    mergeGuestCart,
    selectCartItems,
    selectCartCount,
    selectCartTotal,
    selectCartIsLoading,
    selectCartError,
    selectCartHydrated,
    selectCartMode,
} from '@/redux/slices/cartSlice'
import { selectAuthIsLoading, selectIsAuthenticated } from '@/redux/slices/authSlice'
import type { CartItem } from '@/types/cart'

export function useCart() {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectCartItems)
    const itemCount = useAppSelector(selectCartCount)
    const totalPrice = useAppSelector(selectCartTotal)
    const isLoading = useAppSelector(selectCartIsLoading)
    const error = useAppSelector(selectCartError)
    const hydrated = useAppSelector(selectCartHydrated)
    const mode = useAppSelector(selectCartMode)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const authLoading = useAppSelector(selectAuthIsLoading)

    useEffect(() => {
        if (authLoading) return

        const expectedMode = isAuthenticated ? 'user' : 'guest'
        if (!hydrated || (mode !== null && mode !== expectedMode)) {
            dispatch(hydrateCart({ isAuthenticated }))
        }
    }, [authLoading, dispatch, hydrated, isAuthenticated, mode])

    return {
        items,
        itemCount,
        totalPrice,
        isLoading,
        error,
        hydrated,

        addItem: (item: CartItem) =>
            dispatch(addCartItem({ item, isAuthenticated })).unwrap(),
        removeItem: (variantId: string) =>
            dispatch(removeCartItem({ variantId, isAuthenticated })).unwrap(),
        updateQuantity: (variantId: string, quantity: number) =>
            dispatch(updateCartItemQuantity({ variantId, quantity, isAuthenticated })).unwrap(),
        clearCart: () => dispatch(clearCart()),
        fetchCart: () => dispatch(hydrateCart({ isAuthenticated: true })).unwrap(),
        mergeGuestCart: (guestItems: CartItem[]) => dispatch(mergeGuestCart(guestItems)).unwrap(),
    }
}
