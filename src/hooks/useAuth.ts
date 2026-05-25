import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials, clearCredentials, setAuthLoading } from '@/redux/slices/authSlice'
import { selectAuthUser, selectIsAuthenticated, selectAuthIsLoading } from '@/redux/slices/authSlice'
import { authService } from '@/services/authService'

export function useAuth() {
    const dispatch = useAppDispatch()
    const user            = useAppSelector(selectAuthUser)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const isLoading       = useAppSelector(selectAuthIsLoading)

    const login = async (email: string, password: string): Promise<void> => {
        dispatch(setAuthLoading(true))
        try {
            const result = await authService.login({ email, password })
            dispatch(setCredentials({ user: result.user }))
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
            dispatch(setCredentials({ user: result.user }))
        } catch (err) {
            dispatch(setAuthLoading(false))
            throw err
        }
    }

    const logout = (): void => {
        authService.logout()
        dispatch(clearCredentials())
    }

    return { user, isAuthenticated, isLoading, login, register, logout }
}
