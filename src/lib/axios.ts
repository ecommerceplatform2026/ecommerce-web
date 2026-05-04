import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'

import { AUTH_ENDPOINTS } from '@/constants/api'
import { ROUTES } from '@/constants/routes'
import type { ApiResponse, ApiError } from '@/types/api'
import type { AuthResponse } from '@/types/user'

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
        // Access token: hết hạn sau 1 ngày
        Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        // Refresh token: hết hạn sau 7 ngày
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
// TẠO AXIOS INSTANCE
// ============================================================

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,  // 10 giây — NF01 (low latency)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

// ============================================================
// REQUEST INTERCEPTOR
// Gắn JWT token vào mọi request
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
// Tránh nhiều request cùng refresh cùng lúc (race condition)
// ============================================================

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

const processPendingRequests = (newToken: string) => {
    pendingRequests.forEach(callback => callback(newToken))
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
// Xử lý lỗi 401 → tự refresh token
// Xử lý lỗi khác → chuẩn hoá thành ApiError
// NF03: centralized error handling
// ============================================================

axiosInstance.interceptors.response.use(

    // ---- Thành công ----
    (response: AxiosResponse) => response,

    // ---- Thất bại ----
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        // ------ 401 Unauthorized → thử refresh token ------
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Đánh dấu request đã retry để tránh loop vô tận
            originalRequest._retry = true

            // Nếu đang refresh rồi → xếp hàng chờ
            if (isRefreshing) {
                return new Promise(resolve => {
                    pendingRequests.push((newToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        resolve(axiosInstance(originalRequest))
                    })
                })
            }

            // Bắt đầu refresh
            isRefreshing = true

            try {
                const newToken = await refreshAccessToken()
                processPendingRequests(newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(originalRequest)

            } catch {
                // Refresh thất bại → xoá token, về trang login
                pendingRequests = []
                tokenHelper.clearTokens()

                // Chỉ redirect ở phía client
                if (typeof window !== 'undefined') {
                    window.location.href = ROUTES.AUTH.LOGIN
                }

                return Promise.reject(error)

            } finally {
                isRefreshing = false
            }
        }

        // ------ Chuẩn hoá lỗi từ BE ------
        const apiError: ApiError = {
            success: false,
            message: error.response?.data?.message ?? 'Đã xảy ra lỗi, vui lòng thử lại.',
            statusCode: error.response?.status ?? 500,
            errors: error.response?.data?.errors,
        }

        // ------ 403 Forbidden → không có quyền ------
        if (error.response?.status === 403) {
            apiError.message = 'Bạn không có quyền thực hiện thao tác này.'
        }

        // ------ 404 Not Found ------
        if (error.response?.status === 404) {
            apiError.message = error.response?.data?.message ?? 'Không tìm thấy dữ liệu.'
        }

        // ------ 422 Unprocessable Entity → lỗi validation từ BE ------
        if (error.response?.status === 422) {
            apiError.message = error.response?.data?.message ?? 'Dữ liệu không hợp lệ.'
        }

        // ------ 500 Server Error ------
        if (error.response?.status === 500) {
            apiError.message = 'Lỗi máy chủ, vui lòng thử lại sau.'
        }

        // ------ Network Error (không kết nối được BE) ------
        if (!error.response) {
            apiError.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
            apiError.statusCode = 0
        }

        return Promise.reject(apiError)
    }
)

export default axiosInstance