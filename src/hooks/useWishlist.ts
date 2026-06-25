import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
    addItem as reduxAddItem,
    removeItem as reduxRemoveItem,
    toggleItem as reduxToggleItem,
    selectWishlistItems,
    selectWishlistCount,
    selectIsInWishlist,
} from '@/redux/slices/wishlistSlice'
import { wishlistService } from '@/services/wishlistService'
import { useAuth } from '@/hooks/useAuth'
import { Toast } from '@/components/ui/Toast'
import type { Product } from '@/types/product'
import type { WishlistItem } from '@/types/wishlist'

export const wishlistKeys = {
    all: ['wishlist'] as const,
    items: () => [...wishlistKeys.all, 'items'] as const,
}

// -------------------------------------------------------------------
// Server wishlist query (authenticated users only)
// -------------------------------------------------------------------

export function useWishlistQuery() {
    const { isAuthenticated } = useAuth()
    return useQuery({
        queryKey: wishlistKeys.items(),
        queryFn: () => wishlistService.getWishlist(),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

// -------------------------------------------------------------------
// Add/remove mutations with optimistic update
// -------------------------------------------------------------------

export function useAddToWishlist() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variantId: string) => wishlistService.addItem(variantId),
        onMutate: async (variantId: string) => {
            await queryClient.cancelQueries({ queryKey: wishlistKeys.items() })
            const previous = queryClient.getQueryData<WishlistItem[]>(wishlistKeys.items())

            // Optimistic: add a stub item immediately
            queryClient.setQueryData<WishlistItem[]>(wishlistKeys.items(), (old = []) => {
                const exists = old.some(i => i.productVariantId === variantId)
                if (exists) return old
                const stub: WishlistItem = {
                    id: `optimistic-${variantId}`,
                    productVariantId: variantId,
                    productId: '',
                    productName: '',
                    productImageUrl: null,
                    sku: '',
                    color: null,
                    size: null,
                    price: 0,
                    stock: 0,
                    isOutOfStock: false,
                    isLowStock: false,
                    stockStatus: '',
                }
                return [...old, stub]
            })
            return { previous }
        },
        onError: (_err, _variantId, context) => {
            // Rollback
            if (context?.previous) {
                queryClient.setQueryData(wishlistKeys.items(), context.previous)
            }
            Toast('Failed to add to wishlist', 'error')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.items() })
        },
    })
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variantId: string) => wishlistService.removeItem(variantId),
        onMutate: async (variantId: string) => {
            await queryClient.cancelQueries({ queryKey: wishlistKeys.items() })
            const previous = queryClient.getQueryData<WishlistItem[]>(wishlistKeys.items())

            // Optimistic: remove immediately
            queryClient.setQueryData<WishlistItem[]>(wishlistKeys.items(), (old = []) =>
                old.filter(i => i.productVariantId !== variantId),
            )
            return { previous }
        },
        onSuccess: () => {
            Toast('Removed from wishlist')
            queryClient.invalidateQueries({ queryKey: wishlistKeys.items() })
        },
        onError: (_err, _variantId, context) => {
            // Rollback
            if (context?.previous) {
                queryClient.setQueryData(wishlistKeys.items(), context.previous)
            }
            Toast('Failed to remove from wishlist', 'error')
        },
    })
}

// -------------------------------------------------------------------
// Move to cart mutation — atomically moves item from wishlist to cart
// -------------------------------------------------------------------

export function useMoveToCart() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
            wishlistService.moveToCart(variantId, quantity),
        onMutate: async ({ variantId }) => {
            await queryClient.cancelQueries({ queryKey: wishlistKeys.items() })
            const previous = queryClient.getQueryData<WishlistItem[]>(wishlistKeys.items())

            // Optimistic: remove from wishlist immediately
            queryClient.setQueryData<WishlistItem[]>(wishlistKeys.items(), (old = []) =>
                old.filter(i => i.productVariantId !== variantId),
            )
            return { previous }
        },
        onSuccess: () => {
            Toast('Moved to cart')
            queryClient.invalidateQueries({ queryKey: wishlistKeys.items() })
            // Also invalidate the cart so it refetches
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (_err, _vars, context) => {
            // Rollback wishlist
            if (context?.previous) {
                queryClient.setQueryData(wishlistKeys.items(), context.previous)
            }
            Toast('Failed to move item to cart', 'error')
        },
    })
}

// -------------------------------------------------------------------
// Main hook — backward-compatible API for ProductCard & ProductDetails
// Uses server state when authenticated, falls back to Redux for guests
// -------------------------------------------------------------------

export function useWishlist() {
    const { isAuthenticated } = useAuth()
    const dispatch = useAppDispatch()

    // Redux local state (guest / fallback)
    const reduxItems = useAppSelector(selectWishlistItems)
    const reduxCount = useAppSelector(selectWishlistCount)

    // Server state (authenticated)
    const { data: serverItems = [] } = useWishlistQuery()
    const addMutation    = useAddToWishlist()
    const removeMutation = useRemoveFromWishlist()

    // Pick which source is active
    const items = isAuthenticated ? serverItems : reduxItems
    const count = isAuthenticated ? serverItems.length : reduxCount

    function isInWishlist(productId: string): boolean {
        if (isAuthenticated) {
            return serverItems.some(i => i.productId === productId)
        }
        return reduxItems.some(i => i.id === productId)
    }

    /**
     * Toggle wishlist for a product.
     * - Authenticated: calls server with first variant id, optimistic update.
     * - Guest: updates Redux local state only.
     *
     * NOTE: ProductCard/ProductDetails pass a Product object.
     * We use the first variant's id for the server call.
     */
    function toggleItem(product: Product) {
        if (!isAuthenticated) {
            dispatch(reduxToggleItem(product))
            return
        }

        const firstVariantId = product.variants?.[0]?.id
        if (!firstVariantId) {
            Toast('This product has no variant', 'error')
            return
        }

        const alreadyIn = isInWishlist(product.id)
        if (alreadyIn) {
            // Find the variant currently in the wishlist for this product
            const wishlistItem = serverItems.find(i => i.productId === product.id)
            const variantId = wishlistItem?.productVariantId ?? firstVariantId
            removeMutation.mutate(variantId)
        } else {
            addMutation.mutate(firstVariantId)
        }
    }

    function addItem(product: Product) {
        if (!isAuthenticated) {
            dispatch(reduxAddItem(product))
            return
        }
        const firstVariantId = product.variants?.[0]?.id
        if (firstVariantId) addMutation.mutate(firstVariantId)
    }

    function removeItem(productId: string) {
        if (!isAuthenticated) {
            dispatch(reduxRemoveItem(productId))
            return
        }
        const wishlistItem = serverItems.find(i => i.productId === productId)
        if (wishlistItem) removeMutation.mutate(wishlistItem.productVariantId)
    }

    return {
        items,
        count,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        isLoading: addMutation.isPending || removeMutation.isPending,
    }
}

export { selectIsInWishlist }
