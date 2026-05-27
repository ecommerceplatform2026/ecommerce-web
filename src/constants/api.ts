// ------ Base ------

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// Helper tạo full URL (dùng trong axios baseURL)
export const buildUrl = (path: string) => `${API_BASE_URL}${path}`

// ============================================================
// AUTH  (FR01)
// ============================================================

export const AUTH_ENDPOINTS = {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
} as const

// ============================================================
// USER / PROFILE  (FR02, FR03)
// ============================================================

export const USER_ENDPOINTS = {
    // Profile — backend route: [Route("api/profile")]
    GET_PROFILE: '/api/profile',
    UPDATE_PROFILE: '/api/profile',
    UPLOAD_AVATAR: '/api/profile/avatar',

    // Order history (xem lịch sử mua hàng của chính mình)
    GET_ORDER_HISTORY: '/api/users/orders',

    // Admin — quản lý users
    ADMIN_GET_ALL: '/api/users',
    ADMIN_GET_BY_ID: (id: string) => `/api/users/${id}`,
    ADMIN_UPDATE_STATUS: (id: string) => `/api/users/${id}/status`,
} as const

// ============================================================
// CATEGORIES  (FR04)
// ============================================================

export const CATEGORY_ENDPOINTS = {
    // Public
    GET_ALL: '/api/categories',
    GET_BY_ID: (id: string) => `/api/categories/${id}`,

    // Admin
    ADMIN_CREATE: '/api/categories',
    ADMIN_UPDATE: (id: string) => `/api/categories/${id}`,
    ADMIN_DELETE: (id: string) => `/api/categories/${id}`,
} as const

// ============================================================
// PRODUCTS  (FR05, FR06, FR07)
// ============================================================

export const PRODUCT_ENDPOINTS = {
    // Public — browse & search
    GET_ALL: '/api/products',              // filter, sort, pagination
    GET_BY_ID: (id: string) => `/api/products/${id}`,
    GET_DETAIL: (id: string) => `/api/products/${id}/detail`,
    SEARCH: '/api/products/search',

    // Images
    GET_IMAGES: (productId: string) => `/api/products/${productId}/images`,

    // Variants
    GET_VARIANTS: (productId: string) => `/api/products/${productId}/variants`,
    GET_VARIANT_BY_ID: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,

    // Admin — quản lý sản phẩm
    ADMIN_GET_ALL: '/api/products',
    ADMIN_CREATE: '/api/products',
    ADMIN_UPDATE: (id: string) => `/api/products/${id}`,
    ADMIN_DELETE: (id: string) => `/api/products/${id}`,

    // Admin — quản lý variants
    ADMIN_CREATE_VARIANT: (productId: string) => `/api/products/${productId}/variants`,
    ADMIN_UPDATE_VARIANT: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,
    ADMIN_DELETE_VARIANT: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,

    // Admin — quản lý images
    ADMIN_UPLOAD_IMAGE: (productId: string) => `/api/products/${productId}/images`,
    ADMIN_DELETE_IMAGE: (productId: string, imageId: string) =>
        `/api/products/${productId}/images/${imageId}`,
} as const

// ============================================================
// CART  (FR10)
// ============================================================
// TODO: backend chưa implement

export const CART_ENDPOINTS = {
    // Authenticated user cart (server-side)
    GET: '/api/cart',
    ADD_ITEM: '/api/cart/items',
    UPDATE_ITEM: (itemId: string) => `/api/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/api/cart/items/${itemId}`,
    CLEAR: '/api/cart/clear',

    // Merge guest cart vào user cart sau khi login
    MERGE: '/api/cart/merge',
} as const

// ============================================================
// ORDERS  (FR11, FR13, FR14)
// ============================================================
// TODO: backend chưa implement

export const ORDER_ENDPOINTS = {
    // User
    CREATE: '/api/orders',                           // POST — checkout
    GET_ALL: '/api/orders',                           // GET — lịch sử đơn hàng
    GET_BY_ID: (id: string) => `/api/orders/${id}`,     // GET — chi tiết đơn

    // Admin
    ADMIN_GET_ALL: '/api/orders',
    ADMIN_GET_BY_ID: (id: string) => `/api/orders/${id}`,
    ADMIN_UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    ADMIN_CANCEL: (id: string) => `/api/orders/${id}/cancel`,
} as const

// ============================================================
// PAYMENT  (FR12)
// ============================================================
// TODO: backend chưa implement

export const PAYMENT_ENDPOINTS = {
    // Khởi tạo thanh toán online
    CREATE: '/api/payments/create',

    // Webhook / callback từ cổng thanh toán (BE xử lý, FE chỉ cần biết để redirect)
    PAYOS_CALLBACK: '/api/payments/payos/callback',
    MOMO_CALLBACK: '/api/payments/momo/callback',
    ZALOPAY_CALLBACK: '/api/payments/zalopay/callback',

    // Kiểm tra trạng thái thanh toán
    GET_STATUS: (orderCode: string) => `/api/payments/${orderCode}/status`,
} as const

// ============================================================
// REVIEWS  (FR08)
// ============================================================
// TODO: backend chưa implement

export const REVIEW_ENDPOINTS = {
    // Public
    GET_BY_PRODUCT: (productId: string) => `/api/products/${productId}/reviews`,

    // Authenticated user
    CREATE: (productId: string) => `/api/products/${productId}/reviews`,

    // Admin — kiểm duyệt
    ADMIN_GET_ALL: '/api/reviews',
    ADMIN_APPROVE: (id: string) => `/api/reviews/${id}/approve`,
    ADMIN_DELETE: (id: string) => `/api/reviews/${id}`,
} as const

// ============================================================
// UPLOAD  (Sprint 2)
// ============================================================
// TODO: backend chưa implement

export const UPLOAD_ENDPOINTS = {
    IMAGE: '/api/upload/image',   // Cloudinary upload qua BE
} as const

// ============================================================
// ADMIN DASHBOARD  (FR15 → FR20)
// ============================================================

export const DASHBOARD_ENDPOINTS = {
    // FR15 — Overview KPIs
    OVERVIEW: '/api/dashboard',

    // FR16 — Sales & Revenue
    REVENUE: '/api/dashboard/revenue',

    // FR17 — Product Performance
    PRODUCT_PERFORMANCE: '/api/dashboard/products',

    // FR18 — Customer Analytics
    CUSTOMER_ANALYTICS: '/api/dashboard/customers',

    // FR19 — Order & Inventory Insights
    ORDER_INSIGHTS: '/api/dashboard/orders',

    // FR20 — Charts data
    CHARTS: '/api/dashboard/charts',
} as const
