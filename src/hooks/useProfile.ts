'use client'

import { useState, useEffect, useCallback } from 'react'
import { profileService } from '@/services/profileService'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCredentials } from '@/redux/slices/authSlice'
import { selectAuthUser } from '@/redux/slices/authSlice'
import type { ApiError } from '@/types/api'
import type { UpdateProfileRequest, UserProfile } from '@/types/user'
import type { ProfileAddress } from '@/types/profile'

export type { ProfileAddress }

export function useProfile() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectAuthUser)

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [address, setAddress] = useState<ProfileAddress | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [trigger, setTrigger] = useState(0)

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
                dispatch(setCredentials({ user: fetched }))
            })
            .catch((err: ApiError) => {
                if (cancelled) return
                setError(err.message ?? 'Không thể tải thông tin tài khoản.')
                setIsLoading(false)
            })

        return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger])
    // Intentionally omit user/dispatch — re-running on every auth state change
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
            dispatch(setCredentials({ user: updated }))
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
            dispatch(setCredentials({ user: updated }))
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
