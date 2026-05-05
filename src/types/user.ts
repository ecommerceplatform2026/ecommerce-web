// ------ Enums ------

import { UserRole, UserStatus } from '@/constants/enums'


// ------ Core User ------

export interface User {
    id: string                  // Guid
    fullName: string            // Nvarchar(150)
    username: string | null     // Nvarchar(100) — optional theo SRS
    email: string               // Nvarchar(150) — unique
    phoneNumber: string | null  // Nvarchar(20)
    avatarUrl: string | null    // Nvarchar(500)
    dateOfBirth: string | null  // Date — dạng ISO string từ API
    role: UserRole              // 0 = Admin, 1 = User
    status: UserStatus          // 0 = Inactive, 1 = Active, 2 = Banned
    emailConfirmed: boolean     // Bit — default false

    // Audit fields (BaseEntity)
    createdAt: string
    createdBy: string
    updatedAt: string | null
    updatedBy: string | null
    isDeleted: boolean
    deletedAt: string | null
    deletedBy: string | null
}

// ------ Auth ------

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    phoneNumber?: string
}

export interface AuthResponse {
    accessToken: string
    user: UserProfile
}

// ------ Profile (subset — FE dùng để hiển thị, không lộ sensitive fields) ------

export interface UserProfile {
    id: string
    fullName: string
    username: string | null
    email: string
    phoneNumber: string | null
    avatarUrl: string | null
    dateOfBirth: string | null
    role: UserRole
    status: UserStatus
    emailConfirmed: boolean
}

export interface UpdateProfileRequest {
    fullName?: string
    username?: string
    phoneNumber?: string
    dateOfBirth?: string   // ISO string: "1999-12-31"
    avatarUrl?: string
}

// ------ Redux Auth State ------

export interface AuthState {
    user: UserProfile | null
    accessToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
}