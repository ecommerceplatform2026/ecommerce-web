import axiosInstance, { tokenHelper } from '@/lib/axios'
import { AUTH_ENDPOINTS } from '@/constants/api'
import { UserRole, UserStatus } from '@/constants/enums'
import { jwtDecode } from 'jwt-decode'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '@/types/user'

// ── Raw shape returned by backend ──────────────────────────────────────────
interface BackendAuthData {
    token: string
    fullName: string
    email: string
    role: string   // "User" | "Admin"
}

// ── .NET JWT claim keys ────────────────────────────────────────────────────
interface JwtPayload {
    sub: string
    email: string
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
    exp: number
}

function buildUserProfile(data: BackendAuthData): UserProfile {
    let id = ''
    try {
        const payload = jwtDecode<JwtPayload>(data.token)
        id = payload.sub
    } catch { /* token undecodable — id stays empty */ }

    return {
        id,
        fullName: data.fullName,
        username: null,
        email: data.email,
        phoneNumber: null,
        avatarUrl: null,
        dateOfBirth: null,
        role: data.role === 'Admin' ? UserRole.Admin : UserRole.User,
        status: UserStatus.Active,
        emailConfirmed: false,
    }
}

export const authService = {
    login: async (payload: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post<ApiResponse<BackendAuthData>>(
            AUTH_ENDPOINTS.LOGIN,
            payload,
        )
        const data = res.data.data
        tokenHelper.setTokens(data.token)
        return { accessToken: data.token, user: buildUserProfile(data) }
    },

    register: async (payload: Omit<RegisterRequest, 'confirmPassword'>): Promise<AuthResponse> => {
        const res = await axiosInstance.post<ApiResponse<BackendAuthData>>(
            AUTH_ENDPOINTS.REGISTER,
            payload,
        )
        const data = res.data.data
        tokenHelper.setTokens(data.token)
        return { accessToken: data.token, user: buildUserProfile(data) }
    },

    logout: (): void => {
        tokenHelper.clearTokens()
    },
}
