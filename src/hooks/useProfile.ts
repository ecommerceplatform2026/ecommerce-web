'use client'

import { useState, useEffect, useCallback } from 'react'
import { profileService } from '@/services/profileService'
import type { ProfileAddress } from '@/services/profileService'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials } from '@/redux/slices/authSlice'
import type { ApiError } from '@/types/api'
import type { UpdateProfileRequest, UserProfile } from '@/types/user'

export type { ProfileAddress }

export function useProfile() {
    const dispatch = useAppDispatch()
    const { user, accessToken } = useAppSelector((state) => state.auth)

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [address, setAddress] = useState<ProfileAddress | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [trigger, setTrigger] = useState(0)

    // Pass current Redux user so role/status from JWT are preserved in the mapped profile
    useEffect(() => {
        let cancelled = false

        profileService
            .getProfile(user ?? undefined)
            .then(({ user: fetched, address: fetchedAddr }) => {
                if (cancelled) return
                setProfile(fetched)
                setAddress(fetchedAddr)
                setError(null)
                setIsLoading(false)
                if (accessToken) {
                    dispatch(setCredentials({ user: fetched, accessToken }))
                }
            })
            .catch((err: ApiError) => {
                if (cancelled) return
                setError(err.message ?? 'Không thể tải thông tin tài khoản.')
                setIsLoading(false)
            })

        return () => {
            cancelled = true
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger])
    // Intentionally omit user/accessToken/dispatch — re-running on every auth state change
    // causes an infinite loop (fetch → dispatch setCredentials → user changes → fetch again).
    // trigger is the only intentional dependency for manual refetch.

    const refetch = useCallback(() => {
        setIsLoading(true)
        setError(null)
        setTrigger((n) => n + 1)
    }, [])

    const updateProfile = async (payload: UpdateProfileRequest): Promise<void> => {
        setIsUpdating(true)
        try {
            const { user: updated, address: updatedAddr } = await profileService.updateProfile(
                payload,
                profile ?? user ?? undefined,
            )
            setProfile(updated)
            setAddress(updatedAddr)
            if (accessToken) {
                dispatch(setCredentials({ user: updated, accessToken }))
            }
        } finally {
            setIsUpdating(false)
        }
    }

    const uploadAvatar = async (file: File): Promise<void> => {
        setIsUploadingAvatar(true)
        try {
            const avatarUrl = await profileService.uploadAvatar(file)
            const base = profile ?? user
            if (!base) return
            const updated: UserProfile = { ...base, avatarUrl }
            setProfile(updated)
            if (accessToken) {
                dispatch(setCredentials({ user: updated, accessToken }))
            }
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    return {
        profile: profile ?? user,
        address,
        isLoading,
        isUpdating,
        isUploadingAvatar,
        error,
        updateProfile,
        uploadAvatar,
        refetch,
    }
}