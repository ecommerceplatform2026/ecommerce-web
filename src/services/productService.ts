import axiosInstance from '@/lib/axios'
import { PRODUCT_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type {
    Product,
    ProductDetail,
    ProductFormValues,
    ProductImage,
    ProductVariantFormValues,
    ProductVariantResponse,
} from '@/types/product'

type ProductVariantApiPayload = {
    SKU: string
    Color: string | null
    Size: string | null
    Stock: number
    LowStockThreshold: number
    Price: number
}

function toProductVariantApiPayload(payload: ProductVariantFormValues): ProductVariantApiPayload {
    return {
        SKU: payload.sku,
        Color: payload.color,
        Size: payload.size,
        Stock: payload.stock,
        LowStockThreshold: payload.lowStockThreshold,
        Price: payload.price,
    }
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            PRODUCT_ENDPOINTS.GET_ALL,
        )
        return res.data.data
    },

    getAdminAll: async (): Promise<Product[]> => {
        const res = await axiosInstance.get<ApiResponse<Product[]>>(
            PRODUCT_ENDPOINTS.ADMIN_GET_ALL,
        )
        return res.data.data
    },

    getById: async (id: string): Promise<Product> => {
        const res = await axiosInstance.get<ApiResponse<Product>>(
            PRODUCT_ENDPOINTS.GET_BY_ID(id),
        )
        return res.data.data
    },

    getDetail: async (id: string): Promise<ProductDetail> => {
        const res = await axiosInstance.get<ApiResponse<ProductDetail>>(
            PRODUCT_ENDPOINTS.GET_DETAIL(id),
        )
        return res.data.data
    },

    getImages: async (productId: string): Promise<ProductImage[]> => {
        const detail = await productService.getDetail(productId)
        return detail.images
    },

    create: async (payload: ProductFormValues): Promise<Product> => {
        const res = await axiosInstance.post<ApiResponse<Product>>(
            PRODUCT_ENDPOINTS.ADMIN_CREATE,
            payload,
        )
        return res.data.data
    },

    update: async (id: string, payload: ProductFormValues): Promise<Product> => {
        const res = await axiosInstance.put<ApiResponse<Product>>(
            PRODUCT_ENDPOINTS.ADMIN_UPDATE(id),
            payload,
        )
        return res.data.data
    },

    delete: async (id: string): Promise<boolean> => {
        const res = await axiosInstance.delete<ApiResponse<boolean>>(
            PRODUCT_ENDPOINTS.ADMIN_DELETE(id),
        )
        return res.data.data
    },

    getVariants: async (productId: string): Promise<ProductVariantResponse[]> => {
        const res = await axiosInstance.get<ApiResponse<ProductVariantResponse[]>>(
            PRODUCT_ENDPOINTS.GET_VARIANTS(productId),
        )
        return res.data.data
    },

    createVariant: async (
        productId: string,
        payload: ProductVariantFormValues,
    ): Promise<ProductVariantResponse> => {
        const res = await axiosInstance.post<ApiResponse<ProductVariantResponse>>(
            PRODUCT_ENDPOINTS.ADMIN_CREATE_VARIANT(productId),
            toProductVariantApiPayload(payload),
        )
        return res.data.data
    },

    updateVariant: async (
        productId: string,
        variantId: string,
        payload: ProductVariantFormValues,
    ): Promise<ProductVariantResponse> => {
        const res = await axiosInstance.put<ApiResponse<ProductVariantResponse>>(
            PRODUCT_ENDPOINTS.ADMIN_UPDATE_VARIANT(productId, variantId),
            toProductVariantApiPayload(payload),
        )
        return res.data.data
    },

    deleteVariant: async (productId: string, variantId: string): Promise<boolean> => {
        const res = await axiosInstance.delete<ApiResponse<boolean>>(
            PRODUCT_ENDPOINTS.ADMIN_DELETE_VARIANT(productId, variantId),
        )
        return res.data.data
    },

    uploadImage: async (productId: string, image: File): Promise<ProductImage> => {
        const formData = new FormData()
        formData.append('image', image)

        const res = await axiosInstance.post<ApiResponse<ProductImage>>(
            PRODUCT_ENDPOINTS.ADMIN_UPLOAD_IMAGE(productId),
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        return res.data.data
    },

    deleteImage: async (productId: string, imageId: string): Promise<boolean> => {
        const res = await axiosInstance.delete<ApiResponse<boolean>>(
            PRODUCT_ENDPOINTS.ADMIN_DELETE_IMAGE(productId, imageId),
        )
        return res.data.data
    },
}
