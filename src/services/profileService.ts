import axiosInstance from '@/lib/axios'
import { USER_ENDPOINTS } from '@/constants/api'
import { UserRole, UserStatus } from '@/constants/enums'
import type { UserProfile, UpdateProfileRequest } from '@/types/user'

// ── Backend response shapes ────────────────────────────────────────────────
// Matches C# ApiResponse<T> { Success, Data, Errors }  (camelCase after serialisation)
interface BackendApiResponse<T> {
    success: boolean
    data: T
    errors: string[]
}

// Matches C# UserResponse DTO
interface BackendProfileResponse {
    id: string
    fullName: string
    email: string
    avatar: string | null          // backend field name is "avatar", not "avatarUrl"
    phoneNumber: string | null
    dateOfBirth: string | null     // ISO datetime string, e.g. "1999-12-31T00:00:00"
    address: ProfileAddress | null
}

// Matches C# ProfileAddressResponse DTO
export interface ProfileAddress {
    receiverName: string
    phoneNumber: string
    addressLine: string
    ward: string | null
    district: string | null
    province: string | null
}

export interface GetProfileResult {
    user: UserProfile
    address: ProfileAddress | null
}

// Matches C# UpdateUserRequest DTO
interface BackendUpdateRequest {
    fullName?: string
    avatar?: string
    phoneNumber?: string
    dateOfBirth?: string
}

// ── Mapper ─────────────────────────────────────────────────────────────────
function mapToUserProfile(
    data: BackendProfileResponse,
    existing?: Partial<UserProfile>,
): UserProfile {
    return {
        id: data.id,
        fullName: data.fullName,
        username: existing?.username ?? null,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatar,                              // backend "avatar" → frontend "avatarUrl"
        dateOfBirth: data.dateOfBirth?.split('T')[0] ?? null, // strip time component
        role: existing?.role ?? UserRole.User,               // not in profile endpoint; preserve from JWT
        status: existing?.status ?? UserStatus.Active,
        emailConfirmed: existing?.emailConfirmed ?? false,
    }
}

// ── Service ────────────────────────────────────────────────────────────────
export const profileService = {
    getProfile: async (existing?: Partial<UserProfile>): Promise<GetProfileResult> => {
        const res = await axiosInstance.get<BackendApiResponse<BackendProfileResponse>>(
            USER_ENDPOINTS.GET_PROFILE,
        )
        const raw = res.data.data
        return {
            user: mapToUserProfile(raw, existing),
            address: raw.address,
        }
    },

    updateProfile: async (
        payload: UpdateProfileRequest,
        existing?: Partial<UserProfile>,
    ): Promise<GetProfileResult> => {
        const body: BackendUpdateRequest = {
            ...(payload.fullName !== undefined && { fullName: payload.fullName }),
            avatar: payload.avatarUrl ?? undefined,          // frontend "avatarUrl" → backend "avatar"
            phoneNumber: payload.phoneNumber ?? undefined,
            dateOfBirth: payload.dateOfBirth ?? undefined,
            // note: "username" is not supported by backend UpdateUserRequest — omitted
        }
        const res = await axiosInstance.put<BackendApiResponse<BackendProfileResponse>>(
            USER_ENDPOINTS.UPDATE_PROFILE,
            body,
        )
        const raw = res.data.data
        return {
            user: mapToUserProfile(raw, existing),
            address: raw.address,
        }
    },

    uploadAvatar: async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('avatar', file)
        const res = await axiosInstance.post<BackendApiResponse<{ avatarUrl: string }>>(
            USER_ENDPOINTS.UPLOAD_AVATAR,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        return res.data.data.avatarUrl
    },
}