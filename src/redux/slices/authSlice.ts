import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { AuthState, UserProfile } from '@/types/user'

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: UserProfile }>) {
            state.user = action.payload.user
            state.isAuthenticated = true
            state.isLoading = false
        },
        clearCredentials(state) {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
        },
        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
    },
})

export const selectAuthUser          = (state: RootState) => state.auth.user
export const selectIsAuthenticated   = (state: RootState) => state.auth.isAuthenticated
export const selectAuthIsLoading     = (state: RootState) => state.auth.isLoading

export const { setCredentials, clearCredentials, setAuthLoading } = authSlice.actions
export default authSlice.reducer
