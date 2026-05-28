import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    fetchCart,
    mergeGuestCart,
    selectCartItems,
    selectCartCount,
    selectCartTotal,
    selectCartIsLoading,
} from '@/redux/slices/cartSlice'
import type { CartItem } from '@/types/cart'

export function useCart() {
    const dispatch   = useAppDispatch()
    const items      = useAppSelector(selectCartItems)
    const itemCount  = useAppSelector(selectCartCount)
    const totalPrice = useAppSelector(selectCartTotal)
    const isLoading  = useAppSelector(selectCartIsLoading)

    return {
        items,
        itemCount,
        totalPrice,
        isLoading,

        // Optimistic local operations - UI updates immediately without waiting for the server
        addItem:        (item: CartItem)        => dispatch(addItem(item)),
        removeItem:     (variantId: string)     => dispatch(removeItem(variantId)),
        updateQuantity: (variantId: string, quantity: number) =>
            dispatch(updateQuantity({ variantId, quantity })),
        clearCart:      ()                      => dispatch(clearCart()),

        // Server sync - call when the user signs in or the guest cart needs merging
        fetchCart:      ()                      => dispatch(fetchCart()),
        mergeGuestCart: (items: CartItem[])     => dispatch(mergeGuestCart(items)),
    }
}
