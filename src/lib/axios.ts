import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants/api'
import { ROUTES } from '@/constants/routes'
import type { ApiResponse, ApiError } from '@/types/api'
import type { AuthResponse } from '@/types/user'

type BackendErrorData = {
    errors?: unknown
    Errors?: unknown
    message?: string
    Message?: string
    title?: string
    Title?: string
}

function normalizeBackendErrors(errors: unknown): string[] | undefined {
    if (Array.isArray(errors)) {
        const messages = errors.filter((error): error is string => typeof error === 'string')
        return messages.length > 0 ? messages : undefined
    }

    if (typeof errors === 'object' && errors !== null) {
        const messages = Object.values(errors).flatMap(value => {
            if (Array.isArray(value)) {
                return value.filter((error): error is string => typeof error === 'string')
            }

            return typeof value === 'string' ? [value] : []
        })

        return messages.length > 0 ? messages : undefined
    }

    return undefined
}

// ============================================================
// COOKIE KEYS
// ============================================================

export const COOKIE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
} as const

// ============================================================
// TOKEN HELPERS
// ============================================================

export const tokenHelper = {
    getAccess: () =>
        Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null,

    getRefresh: () =>
        Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null,

    setTokens: (accessToken: string, refreshToken?: string) => {
        // Access token expires after 1 day
        Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        // Refresh token expires after 7 days
        if (refreshToken) {
            Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })
        }
    },

    clearTokens: () => {
        Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN)
        Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN)
    },
}

// ============================================================
// CREATE AXIOS INSTANCE
// ============================================================

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,  // 10 seconds - NF01 (low latency)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

// ============================================================
// REQUEST INTERCEPTOR
// Attach JWT token to every request
// ============================================================

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenHelper.getAccess()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error: AxiosError) => Promise.reject(error)
)

// ============================================================
// REFRESH TOKEN LOGIC
// Prevent multiple requests from refreshing at the same time (race condition)
// ============================================================

let isRefreshing = false
type PendingRequest = {
    resolve: (token: string) => void
    reject: (error: unknown) => void
}

let pendingRequests: PendingRequest[] = []

const processPendingRequests = (newToken: string) => {
    pendingRequests.forEach(p => p.resolve(newToken))
    pendingRequests = []
}

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = tokenHelper.getRefresh()

    if (!refreshToken) {
        throw new Error('No refresh token')
    }

    const response = await axios.post<ApiResponse<AuthResponse>>(
        `${process.env.NEXT_PUBLIC_API_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
        { refreshToken }
    )

    const { accessToken } = response.data.data
    tokenHelper.setTokens(accessToken)
    return accessToken
}

// ============================================================
// RESPONSE INTERCEPTOR
// Handle 401 errors by refreshing the token
// Normalize other errors into ApiError
// NF03: centralized error handling
// ============================================================

axiosInstance.interceptors.response.use(

    // ---- Success ----
    (response: AxiosResponse) => response,

    // ---- Failure ----
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        // ------ 401 Unauthorized - try refreshing token ------
        // Skip login endpoint because 401 means invalid credentials, not an expired token
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== AUTH_ENDPOINTS.LOGIN) {
            // Mark request as retried to avoid an infinite loop
            originalRequest._retry = true

            // If refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({
                        resolve: (newToken: string) => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`
                            resolve(axiosInstance(originalRequest))
                        },
                        reject,
                    })
                })
            }

            // Start refresh
            isRefreshing = true

            try {
                const newToken = await refreshAccessToken()
                processPendingRequests(newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(originalRequest)

            } catch (refreshError) {
                // Reject all queued requests
                pendingRequests.forEach(p => p.reject(refreshError))
                pendingRequests = []

                tokenHelper.clearTokens()

                if (typeof window !== 'undefined') {
                    window.location.href = ROUTES.AUTH.LOGIN
                }

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        // ------ Normalize BE errors ------
        const responseData = error.response?.data as BackendErrorData | undefined
        const backendErrors =
            normalizeBackendErrors(responseData?.errors) ??
            normalizeBackendErrors(responseData?.Errors)
        const firstError =
            backendErrors?.[0] ??
            responseData?.message ??
            responseData?.Message ??
            responseData?.title ??
            responseData?.Title ??
            null

        const apiError: ApiError = {
            success: false,
            message: firstError ?? 'Something went wrong. Please try again.',
            statusCode: error.response?.status ?? 500,
            errors: backendErrors,
        }

        // ------ 403 Forbidden - no permission ------
        if (error.response?.status === 403) {
            apiError.message = firstError ?? 'You do not have permission to perform this action.'
        }

        // ------ 404 Not Found ------
        if (error.response?.status === 404) {
            apiError.message = firstError ?? 'Data not found.'
        }

        // ------ 422 Unprocessable Entity - validation error from BE ------
        if (error.response?.status === 422) {
            apiError.message = firstError ?? 'Invalid data.'
        }

        // ------ 500 Server Error - do not expose internal errors to users ------
        if (error.response?.status === 500) {
            apiError.message = 'Server error. Please try again later.'
        }

        // ------ Network Error (cannot connect to BE) ------
        if (!error.response) {
            apiError.message = 'Cannot connect to the server. Please check your network connection.'
            apiError.statusCode = 0
        }

        return Promise.reject(apiError)
    }
)

export default axiosInstance
