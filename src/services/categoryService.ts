import axiosInstance from '@/lib/axios'
import { CATEGORY_ENDPOINTS } from '@/constants/api'
import { CategoryStatus } from '@/constants/enums'
import type { ApiResponse } from '@/types/api'
import type { Category } from '@/types/category'

function isActiveCategory(category: Category): boolean {
    if (category.status === undefined || category.status === null) {
        return true
    }

    const status = String(category.status).toLowerCase()
    return status === String(CategoryStatus.Active) || status === 'active'
}

export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        const res = await axiosInstance.get<ApiResponse<Category[]>>(CATEGORY_ENDPOINTS.GET_ALL)
        return res.data.data.filter(isActiveCategory)
    },
}
