import axiosInstance from '@/lib/axios'
import { CATEGORY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { Category } from '@/types/category'

export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        const res = await axiosInstance.get<ApiResponse<Category[]>>(CATEGORY_ENDPOINTS.GET_ALL)
        return res.data.data
    },
}
