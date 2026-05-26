import axiosInstance from '@/lib/axios'
import { PRODUCT_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Product, ProductSearchParams } from '@/types/product'

function cleanParams(params: ProductSearchParams): Record<string, string | number> {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== '',
        ),
    ) as Record<string, string | number>
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            PRODUCT_ENDPOINTS.GET_ALL,
        )
        return res.data.data
    },

    search: async (params: ProductSearchParams): Promise<PaginatedResponse<Product>['data']> => {
        const res = await axiosInstance.get<PaginatedResponse<Product>>(
            PRODUCT_ENDPOINTS.SEARCH,
            { params: cleanParams(params) },
        )
        return res.data.data
    },

}
