import type { UserProfile } from '@/types/user'

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
