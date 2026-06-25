import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials, clearCredentials, setAuthLoading } from '@/redux/slices/authSlice'
import { selectAuthUser, selectIsAuthenticated, selectAuthIsLoading } from '@/redux/slices/authSlice'
import { hydrateCart, mergeStoredGuestCart, resetCartHydration } from '@/redux/slices/cartSlice'
import { selectWishlistItems, clearWishlist } from '@/redux/slices/wishlistSlice'
import { authService } from '@/services/authService'
import { wishlistService } from '@/services/wishlistService'
import { queryClient } from '@/lib/queryClient'

// Inline key to avoid circular dependency with useWishlist.ts (which imports useAuth.ts)
const WISHLIST_QUERY_KEY = ['wishlist', 'items'] as const

export function useAuth() {
    const dispatch = useAppDispatch()
    const user              = useAppSelector(selectAuthUser)
    const isAuthenticated   = useAppSelector(selectIsAuthenticated)
    const isLoading         = useAppSelector(selectAuthIsLoading)
    const guestWishlistItems = useAppSelector(selectWishlistItems)

    const mergeStoredCartAfterAuth = async () => {
        try {
            await dispatch(mergeStoredGuestCart()).unwrap()
        } catch {
            try {
                await dispatch(hydrateCart({ isAuthenticated: true })).unwrap()
            } catch {
                // Keep authentication successful. Cart state can retry synchronization later.
            }
        }
    }

    const mergeGuestWishlistAfterAuth = async () => {
        try {
            const guestItems = guestWishlistItems
            if (guestItems.length > 0) {
                const variantIds = guestItems
                    .flatMap(p => p.variants?.map(v => v.id) ?? [])
                    .filter(Boolean)
                if (variantIds.length > 0) {
                    await wishlistService.mergeWishlist(variantIds)
                }
                dispatch(clearWishlist())
            }
            // Refresh wishlist from server
            await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
        } catch {
            // Wishlist merge failure is non-critical — silently continue
        }
    }

    const login = async (email: string, password: string) => {
        dispatch(setAuthLoading(true))
        try {
            const result = await authService.login({ email, password })
            await mergeStoredCartAfterAuth()
            await mergeGuestWishlistAfterAuth()
            dispatch(setCredentials({ user: result.user }))
            return result.user
        } catch (err) {
            dispatch(setAuthLoading(false))
            throw err
        }
    }

    const register = async (data: {
        fullName: string
        email: string
        password: string
    }): Promise<void> => {
        dispatch(setAuthLoading(true))
        try {
            const result = await authService.register(data)
            await mergeStoredCartAfterAuth()
            await mergeGuestWishlistAfterAuth()
            dispatch(setCredentials({ user: result.user }))
        } catch (err) {
            dispatch(setAuthLoading(false))
            throw err
        }
    }

    const logout = (): void => {
        authService.logout()
        dispatch(clearCredentials())
        dispatch(resetCartHydration())
    }

    return { user, isAuthenticated, isLoading, login, register, logout }
}
