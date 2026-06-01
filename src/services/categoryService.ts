import axiosInstance from '@/lib/axios'
import { CATEGORY_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { Category, CategoryFormValues } from '@/types/category'

export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        const res = await axiosInstance.get<ApiResponse<Category[]>>(CATEGORY_ENDPOINTS.GET_ALL)
        return res.data.data
    },

    getAdminAll: async (): Promise<Category[]> => {
        const res = await axiosInstance.get<ApiResponse<Category[]>>(CATEGORY_ENDPOINTS.GET_ALL)
        return res.data.data
    },

    create: async (payload: CategoryFormValues): Promise<Category> => {
        const res = await axiosInstance.post<ApiResponse<Category>>(
            CATEGORY_ENDPOINTS.ADMIN_CREATE,
            payload,
        )
        return res.data.data
    },

    update: async (id: string, payload: CategoryFormValues): Promise<Category> => {
        const res = await axiosInstance.put<ApiResponse<Category>>(
            CATEGORY_ENDPOINTS.ADMIN_UPDATE(id),
            payload,
        )
        return res.data.data
    },

    delete: async (id: string): Promise<boolean> => {
        const res = await axiosInstance.delete<ApiResponse<boolean>>(
            CATEGORY_ENDPOINTS.ADMIN_DELETE(id),
        )
        return res.data.data
    },
}
