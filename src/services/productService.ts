import axiosInstance from '@/lib/axios'
import { PRODUCT_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/product'

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            PRODUCT_ENDPOINTS.GET_ALL,
        )
        return res.data.data
    },

    getById: async (id: string): Promise<Product> => {
        const res = await axiosInstance.get<ApiResponse<Product>>(
            PRODUCT_ENDPOINTS.GET_BY_ID(id),
        )
        return res.data.data
    },
}
