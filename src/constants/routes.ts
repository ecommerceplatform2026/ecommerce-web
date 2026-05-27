export const ROUTES = {

    // ============================================================
    // PUBLIC — không cần đăng nhập
    // ============================================================

    HOME: '/',

    // ------ Auth (FR01) ------
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
    },

    // ------ Shop / Catalog (FR05, FR06) ------
    SHOP: {
        // Danh sách sản phẩm — có filter, sort, pagination, search
        PRODUCTS: '/products',

        // Chi tiết sản phẩm — ảnh, variant, giá, tồn kho, review
        PRODUCT_DETAIL: (id: string) => `/products/${id}`,

        // Tìm kiếm
        SEARCH: '/products/search',
    },

    // ============================================================
    // PROTECTED — cần đăng nhập  (middleware chặn nếu chưa login)
    // ============================================================

    // ------ User Profile (FR02) ------
    PROFILE: {
        INDEX: '/profile',           // xem thông tin cá nhân
        EDIT: '/profile/edit',      // cập nhật thông tin
        CHANGE_PASSWORD: '/profile/password',  // đổi mật khẩu
    },

    // ------ Cart (FR10) ------
    CART: '/cart',

    // ------ Checkout (FR11, FR12) ------
    CHECKOUT: {
        INDEX: '/checkout',           // form địa chỉ + chọn thanh toán
        SUCCESS: '/checkout/success',   // thanh toán thành công
        FAILED: '/checkout/failed',    // thanh toán thất bại
    },

    // ------ Orders (FR03, FR13) ------
    ORDERS: {
        INDEX: '/orders',                          // lịch sử đơn hàng
        DETAIL: (id: string) => `/orders/${id}`,    // chi tiết đơn hàng
    },

    // ============================================================
    // ADMIN — cần role Admin  (middleware chặn nếu không phải admin)
    // ============================================================

    ADMIN: {
        // ------ Dashboard (FR15 → FR20) ------
        DASHBOARD: '/admin/dashboard',

        // ------ Products (FR05, FR06, FR07, FR09) ------
        PRODUCTS: {
            INDEX: '/admin/products',              // danh sách sản phẩm
            CREATE: '/admin/products/create',       // thêm sản phẩm mới
            EDIT: (id: string) => `/admin/products/${id}/edit`,   // sửa sản phẩm
            DETAIL: (id: string) => `/admin/products/${id}`,        // xem chi tiết
        },

        // ------ Categories (FR04) ------
        CATEGORIES: {
            INDEX: '/admin/categories',            // danh sách danh mục
            CREATE: '/admin/categories/create',     // thêm danh mục
            EDIT: (id: string) => `/admin/categories/${id}/edit`,
        },

        // ------ Orders (FR13) ------
        ORDERS: {
            INDEX: '/admin/orders',                         // danh sách đơn hàng
            DETAIL: (id: string) => `/admin/orders/${id}`,   // chi tiết + cập nhật status
        },

        // ------ Users (FR02) ------
        USERS: {
            INDEX: '/admin/users',                          // danh sách người dùng
            DETAIL: (id: string) => `/admin/users/${id}`,    // chi tiết user
        },

        // ------ Reviews (FR08) ------
        REVIEWS: {
            INDEX: '/admin/reviews',   // danh sách review chờ duyệt
        },
    },

} as const

// ============================================================
// HELPER — kiểm tra route có cần auth không
// Dùng trong middleware.ts
// ============================================================

// Các route chỉ dành cho user đã đăng nhập
export const PROTECTED_ROUTES = [
    '/profile',
    '/cart',
    '/checkout',
    '/orders',
] as const

// Các route chỉ dành cho Admin
export const ADMIN_ROUTES = [
    '/admin',
] as const

// Các route chỉ dành cho guest (đã login thì redirect về home)
export const GUEST_ONLY_ROUTES = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
] as const