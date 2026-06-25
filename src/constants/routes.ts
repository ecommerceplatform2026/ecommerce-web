export const ROUTES = {

    // ============================================================
    // PUBLIC - no sign-in required
    // ============================================================

    HOME: '/',

    // ------ Auth (FR01) ------
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
    },

    // ------ Shop / Catalog (FR05, FR06) ------
    SHOP: {
        // Product list with filter, sort, pagination, and search
        PRODUCTS: '/products',

        // Product detail with images, variants, price, stock, and reviews
        PRODUCT_DETAIL: (id: string) => `/products/${id}`,

        // Search
        SEARCH: '/products/search',
    },

    // ============================================================
    // PROTECTED - sign-in required (middleware blocks guests)
    // ============================================================

    // ------ User Profile (FR02) ------
    PROFILE: {
        INDEX: '/profile',           // view personal information
        EDIT: '/profile/edit',      // update information
        CHANGE_PASSWORD: '/profile/password',  // change password
    },

    // ------ Loyalty / Points (US 6.2) ------
    LOYALTY: '/loyalty',

    // ------ Cart (FR10) ------
    CART: '/cart',

    // ------ Checkout (FR11, FR12) ------
    CHECKOUT: {
        INDEX: '/checkout',           // address form and payment selection
        SUCCESS: '/checkout/success',   // payment success
        FAILED: '/checkout/failed',    // payment failed
    },

    // ------ Orders (FR03, FR13) ------
    ORDERS: {
        INDEX: '/orders',                          // order history
        DETAIL: (id: string) => `/orders/${id}`,    // order detail
    },

    // ------ Wishlist (FR09 / ABC-210–213) ------
    WISHLIST: '/wishlist',

    // ============================================================
    // ADMIN - Admin role required (middleware blocks non-admin users)
    // ============================================================

    ADMIN: {
        // ------ Dashboard (FR15 → FR20) ------
        DASHBOARD: '/admin/dashboard',

        // ------ Products (FR05, FR06, FR07, FR09) ------
        PRODUCTS: {
            INDEX: '/admin/products',              // product list
            CREATE: '/admin/products/create',       // add new product
            EDIT: (id: string) => `/admin/products/${id}/edit`,   // edit product
            DETAIL: (id: string) => `/admin/products/${id}`,        // view detail
        },

        // ------ Categories (FR04) ------
        CATEGORIES: {
            INDEX: '/admin/categories',            // category list
            CREATE: '/admin/categories/create',     // add category
            EDIT: (id: string) => `/admin/categories/${id}/edit`,
        },

        // ------ Orders (FR13) ------
        ORDERS: {
            INDEX: '/admin/orders',                         // order list
            DETAIL: (id: string) => `/admin/orders/${id}`,   // detail and status update
        },

        // ------ Users (FR02) ------
        USERS: {
            INDEX: '/admin/users',                          // user list
            DETAIL: (id: string) => `/admin/users/${id}`,    // user detail
        },

        // ------ Reviews (FR08) ------
        REVIEWS: {
            INDEX: '/admin/reviews',   // pending review list
        },
    },

} as const

// ============================================================
// HELPER - checks whether a route requires auth
// Used in middleware.ts
// ============================================================

// Routes for signed-in users only
export const PROTECTED_ROUTES = [
    '/profile',
    '/checkout',
    '/orders',
    '/loyalty',
    '/wishlist',
] as const

// Routes for Admin only
export const ADMIN_ROUTES = [
    '/admin',
] as const

// Routes for guests only (signed-in users redirect home)
export const GUEST_ONLY_ROUTES = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
] as const
