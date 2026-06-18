import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials, clearCredentials, setAuthLoading } from '@/redux/slices/authSlice'
import { selectAuthUser, selectIsAuthenticated, selectAuthIsLoading } from '@/redux/slices/authSlice'
import { hydrateCart, mergeStoredGuestCart, resetCartHydration } from '@/redux/slices/cartSlice'
import { authService } from '@/services/authService'

export function useAuth() {
    const dispatch = useAppDispatch()
    const user            = useAppSelector(selectAuthUser)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const isLoading       = useAppSelector(selectAuthIsLoading)

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

    const login = async (email: string, password: string) => {
        dispatch(setAuthLoading(true))
        try {
            const result = await authService.login({ email, password })
            await mergeStoredCartAfterAuth()
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
