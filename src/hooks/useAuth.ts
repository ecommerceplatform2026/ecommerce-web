import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials, clearCredentials, setAuthLoading } from '@/redux/slices/authSlice'
import { authService } from '@/services/authService'
import type { ApiError } from '@/types/api'

export function useAuth() {
    const dispatch = useAppDispatch()
    const { user, accessToken, isAuthenticated, isLoading } = useAppSelector(
        (state) => state.auth,
    )

    const login = async (email: string, password: string): Promise<void> => {
        dispatch(setAuthLoading(true))
        try {
            const result = await authService.login({ email, password })
            dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }))
        } catch (err) {
            dispatch(setAuthLoading(false))
            throw err as ApiError
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
            dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }))
        } catch (err) {
            dispatch(setAuthLoading(false))
            throw err as ApiError
        }
    }

    const logout = (): void => {
        authService.logout()
        dispatch(clearCredentials())
    }

    return { user, accessToken, isAuthenticated, isLoading, login, register, logout }
}
