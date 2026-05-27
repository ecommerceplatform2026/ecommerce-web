import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
    addItem,
    removeItem,
    toggleItem,
    selectWishlistItems,
    selectWishlistCount,
    selectIsInWishlist,
} from '@/redux/slices/wishlistSlice'
import type { Product } from '@/types/product'

export function useWishlist() {
    const dispatch = useAppDispatch()
    const items    = useAppSelector(selectWishlistItems)
    const count    = useAppSelector(selectWishlistCount)

    return {
        items,
        count,
        addItem:      (product: Product) => dispatch(addItem(product)),
        removeItem:   (id: string)       => dispatch(removeItem(id)),
        toggleItem:   (product: Product) => dispatch(toggleItem(product)),
        isInWishlist: (id: string)       => items.some(i => i.id === id),
    }
}

export { selectIsInWishlist }
