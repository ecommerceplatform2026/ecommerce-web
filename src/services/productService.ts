import axiosInstance from '@/lib/axios'
import { PRODUCT_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Product, ProductDetail, ProductImage, ProductSearchParams } from '@/types/product'

function cleanParams(params: ProductSearchParams): Record<string, string | number> {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== '',
        ),
    ) as Record<string, string | number>
}

function toProductDetailFallback(product: Product): ProductDetail {
    const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0)
    const variantPrices = product.variants.map(variant => variant.price)
    const prices = variantPrices.length > 0 ? variantPrices : [product.basePrice]

    return {
        ...product,
        price: Math.min(...prices),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        totalStock,
        stockStatus: totalStock > 0 ? 'InStock' : 'OutOfStock',
        images: [],
        variants: product.variants.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
            stockStatus: variant.isOutOfStock ? 'OutOfStock' : 'InStock',
            price: variant.price,
        })),
    }
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

    getById: async (id: string): Promise<Product> => {
        const res = await axiosInstance.get<ApiResponse<Product>>(
            PRODUCT_ENDPOINTS.GET_BY_ID(id),
        )
        return res.data.data
    },

    getDetail: async (id: string): Promise<ProductDetail> => {
        try {
            const res = await axiosInstance.get<ApiResponse<ProductDetail>>(
                PRODUCT_ENDPOINTS.GET_DETAIL(id),
            )
            return res.data.data
        } catch {
            const fallback = await axiosInstance.get<ApiResponse<Product>>(
                PRODUCT_ENDPOINTS.GET_BY_ID(id),
            )
            return toProductDetailFallback(fallback.data.data)
        }
    },

    getImages: async (productId: string): Promise<ProductImage[]> => {
        const res = await axiosInstance.get<ApiResponse<ProductImage[]>>(
            PRODUCT_ENDPOINTS.GET_IMAGES(productId),
        )
        return res.data.data
    },
}
