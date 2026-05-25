"use client"

import { useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials, clearCredentials } from '@/redux/slices/authSlice'
import { tokenHelper } from '@/lib/axios'
import { UserRole, UserStatus } from '@/constants/enums'
import type { UserProfile } from '@/types/user'

// .NET JWT claim keys
interface JwtPayload {
    sub: string
    email: string
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
    exp: number
}

// Restores Redux auth state from cookie on app mount (persist across refreshes)
export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = tokenHelper.getAccess()
        if (!token) return

        try {
            const payload = jwtDecode<JwtPayload>(token)

            // Clear if token expired
            if (payload.exp * 1000 < Date.now()) {
                tokenHelper.clearTokens()
                dispatch(clearCredentials())
                return
            }

            const user: UserProfile = {
                id: payload.sub,
                fullName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                email: payload.email,
                role:
                    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
                        ? UserRole.Admin
                        : UserRole.User,
                username: null,
                phoneNumber: null,
                avatarUrl: null,
                dateOfBirth: null,
                status: UserStatus.Active,
                emailConfirmed: false,
            }

            dispatch(setCredentials({ user }))
        } catch {
            tokenHelper.clearTokens()
            dispatch(clearCredentials())
        }
    }, [dispatch])

    return <>{children}</>
}
