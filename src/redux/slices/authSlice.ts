import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, UserProfile } from '@/types/user'

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(
            state,
            action: PayloadAction<{ user: UserProfile; accessToken: string }>,
        ) {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.isLoading = false
        },
        clearCredentials(state) {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            state.isLoading = false
        },
        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
    },
})

export const { setCredentials, clearCredentials, setAuthLoading } = authSlice.actions
export default authSlice.reducer
