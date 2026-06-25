// ------ Base ------

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// Helper for building full URLs (used with axios baseURL)
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

    // Order history for the current user
    GET_ORDER_HISTORY: '/api/users/orders',

    // Admin user management
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

    // Admin product management
    ADMIN_GET_ALL: '/api/products',
    ADMIN_CREATE: '/api/products',
    ADMIN_UPDATE: (id: string) => `/api/products/${id}`,
    ADMIN_DELETE: (id: string) => `/api/products/${id}`,

    // Admin variant management
    ADMIN_CREATE_VARIANT: (productId: string) => `/api/products/${productId}/variants`,
    ADMIN_UPDATE_VARIANT: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,
    ADMIN_DELETE_VARIANT: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,

    // Admin image management
    ADMIN_UPLOAD_IMAGE: (productId: string) => `/api/products/${productId}/images`,
    ADMIN_DELETE_IMAGE: (productId: string, imageId: string) =>
        `/api/products/${productId}/images/${imageId}`,
} as const

// ============================================================
// CART  (FR10)
// ============================================================

export const CART_ENDPOINTS = {
    // Authenticated user cart (server-side)
    GET: '/api/cart',
    ADD_ITEM: '/api/cart/items',
    UPDATE_ITEM: (variantId: string) => `/api/cart/items/${variantId}`,
    REMOVE_ITEM: (variantId: string) => `/api/cart/items/${variantId}`,

    // Merge guest cart into the user cart after sign-in
    MERGE: '/api/cart/merge',
} as const

// ============================================================
// CHECKOUT (FR11, FR12)
// ============================================================

export const CHECKOUT_ENDPOINTS = {
    CREATE: '/api/checkout',                          // POST — create/checkout
} as const

// ============================================================
// ORDERS  (FR13, FR14)
// ============================================================

export const ORDER_ENDPOINTS = {
    // User
    GET_ALL: '/api/orders',                           // GET - order history
    GET_BY_ID: (id: string) => `/api/orders/${id}`,     // GET - order detail
    CANCEL: (id: string) => `/api/orders/${id}/cancel`, // POST - cancel order

    // Admin
    ADMIN_GET_ALL: '/api/orders',
    ADMIN_GET_BY_ID: (id: string) => `/api/orders/${id}`,
    ADMIN_UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    ADMIN_CANCEL: (id: string) => `/api/orders/${id}/cancel`,
} as const

// ============================================================
// PAYMENT  (FR12)
// ============================================================
// TODO: backend not implemented yet

export const PAYMENT_ENDPOINTS = {
    // Initialize online payment
    CREATE: '/api/payments/create',

    // Webhook / callback from payment gateway (BE handles it, FE only needs redirect awareness)
    PAYOS_CALLBACK: '/api/payments/payos/callback',
    MOMO_CALLBACK: '/api/payments/momo/callback',
    ZALOPAY_CALLBACK: '/api/payments/zalopay/callback',

    // Check payment status
    GET_STATUS: (orderCode: string) => `/api/payments/${orderCode}/status`,
} as const

// ============================================================
// REVIEWS  (FR08)
// ============================================================
// TODO: backend not implemented yet

export const REVIEW_ENDPOINTS = {
    // Public
    GET_BY_PRODUCT: (productId: string) => `/api/products/${productId}/reviews`,

    // Authenticated user
    CREATE: '/api/reviews',
    CAN_REVIEW: '/api/reviews/eligibility',

    // Admin moderation
    ADMIN_GET_ALL: '/api/reviews',
    ADMIN_APPROVE: (id: string) => `/api/reviews/${id}/approve`,
    ADMIN_DELETE: (id: string) => `/api/reviews/${id}`,
} as const

// ============================================================
// UPLOAD  (Sprint 2)
// ============================================================
// TODO: backend not implemented yet

export const UPLOAD_ENDPOINTS = {
    IMAGE: '/api/upload/image',   // Cloudinary upload via BE
} as const

// ============================================================
// WISHLIST  (FR09 / ABC-210–213)
// ============================================================

export const WISHLIST_ENDPOINTS = {
    GET: '/api/wishlist',
    ADD_ITEM: '/api/wishlist/items',
    REMOVE_ITEM: (variantId: string) => `/api/wishlist/items/${variantId}`,
    MERGE: '/api/wishlist/merge',
} as const

// ============================================================
// ADMIN DASHBOARD  (FR15 → FR20)
// ============================================================

export const DASHBOARD_ENDPOINTS = {
    SUMMARY: '/api/admin/dashboard/summary',
    REVENUE_TREND: '/api/admin/dashboard/revenue-trend',
    PAYMENT_METHODS: '/api/admin/dashboard/payment-methods',
} as const
