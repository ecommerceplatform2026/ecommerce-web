import type { CategoryStatus } from '@/constants/enums'

// Matches C# CategoryResponse DTO.
// `status` is optional because older backend responses do not include it.
export interface Category {
    id: string
    name: string
    createdAt: string
    status?: CategoryStatus | 0 | 1 | '0' | '1' | 'Active' | 'Inactive' | 'active' | 'inactive'
}
