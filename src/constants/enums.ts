// Bảng Users — cột Role
// SRS: 0 = Admin, 1 = User
export enum UserRole {
    Admin = 0,
    User = 1,
}

// Bảng Users — cột Status
// SRS: Inactive = 0, Active = 1, Banned = 2
export enum UserStatus {
    Inactive = 0,
    Active = 1,
    Banned = 2,
}

// ============================================================
// CATEGORY
// ============================================================

// Bảng Categories — cột Status
// SRS: Inactive = 0, Active = 1
export enum CategoryStatus {
    Inactive = 0,
    Active = 1,
}

// ============================================================
// PRODUCT
// ============================================================

// Bảng Products — cột Status
// SRS: Inactive = 0, Active = 1
export enum ProductStatus {
    Inactive = 0,
    Active = 1,
}

// Bảng ProductVariants — cột Size
// SRS: Size (S, M, L, XL, XXL...)
export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}

// ============================================================
// ORDER
// ============================================================

// Bảng Orders — cột Status
// SRS: 0=Pending, 1=Confirmed, 2=Processing, 3=Shipping,
//      4=Delivered, 5=Cancelled, 6=Returned
export enum OrderStatus {
    Pending = 0,
    Confirmed = 1,
    Processing = 2,
    Shipping = 3,
    Delivered = 4,
    Cancelled = 5,
    Returned = 6,
}

// ============================================================
// PAYMENT
// ============================================================

// Bảng Orders — cột PaymentMethod
// SRS: 0 = COD, 1 = MoMo, 2 = ZaloPay, 3 = PayOS
export enum PaymentMethod {
    COD = 0,
    MoMo = 1,
    ZaloPay = 2,
    PayOS = 3,
}

// Trạng thái thanh toán — dùng trong Payment flow (FR12)
export enum PaymentStatus {
    Pending = 0,
    Paid = 1,
    Failed = 2,
    Cancelled = 3,
    Refunded = 4,
}

// ============================================================
// REVIEW
// ============================================================

// Bảng Reviews — cột Rating
// SRS: 1 to 5 stars
export enum ReviewRating {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}

// Trạng thái review — dùng cho Admin moderation (Sprint 4)
export enum ReviewStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

// ============================================================
// SORT & FILTER (dùng cho Product listing — FR05)
// ============================================================

export enum SortOrder {
    Asc = 'asc',
    Desc = 'desc',
}

export enum ProductSortBy {
    Newest = 'createdAt',
    PriceAsc = 'price_asc',
    PriceDesc = 'price_desc',
    Popular = 'popular',
}

// ============================================================
// DASHBOARD (FR15 → FR20)
// ============================================================

// Filter theo khoảng thời gian — Admin Dashboard
export enum DateRangeFilter {
    Today = 'today',
    Last7Days = 'last_7_days',
    Last30Days = 'last_30_days',
    Monthly = 'monthly',
    Yearly = 'yearly',
    Custom = 'custom',
}

// ============================================================
// LABEL MAPS
// Dùng để hiển thị text tiếng Việt ra UI — tránh hardcode ở component
// ============================================================

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'Chờ xác nhận',
    [OrderStatus.Confirmed]: 'Đã xác nhận',
    [OrderStatus.Processing]: 'Đang xử lý',
    [OrderStatus.Shipping]: 'Đang giao hàng',
    [OrderStatus.Delivered]: 'Đã giao hàng',
    [OrderStatus.Cancelled]: 'Đã huỷ',
    [OrderStatus.Returned]: 'Đã hoàn trả',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    [PaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [PaymentMethod.MoMo]: 'Ví MoMo',
    [PaymentMethod.ZaloPay]: 'ZaloPay',
    [PaymentMethod.PayOS]: 'PayOS',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    [PaymentStatus.Pending]: 'Chờ thanh toán',
    [PaymentStatus.Paid]: 'Đã thanh toán',
    [PaymentStatus.Failed]: 'Thanh toán thất bại',
    [PaymentStatus.Cancelled]: 'Đã huỷ',
    [PaymentStatus.Refunded]: 'Đã hoàn tiền',
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
    [UserStatus.Inactive]: 'Chưa kích hoạt',
    [UserStatus.Active]: 'Đang hoạt động',
    [UserStatus.Banned]: 'Đã bị khoá',
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị viên',
    [UserRole.User]: 'Người dùng',
}

export const PRODUCT_SIZE_LABEL: Record<ProductSize, string> = {
    [ProductSize.XS]: 'XS',
    [ProductSize.S]: 'S',
    [ProductSize.M]: 'M',
    [ProductSize.L]: 'L',
    [ProductSize.XL]: 'XL',
    [ProductSize.XXL]: 'XXL',
}

export const DATE_RANGE_LABEL: Record<DateRangeFilter, string> = {
    [DateRangeFilter.Today]: 'Hôm nay',
    [DateRangeFilter.Last7Days]: '7 ngày qua',
    [DateRangeFilter.Last30Days]: '30 ngày qua',
    [DateRangeFilter.Monthly]: 'Theo tháng',
    [DateRangeFilter.Yearly]: 'Theo năm',
    [DateRangeFilter.Custom]: 'Tuỳ chọn',
}

// ============================================================
// COLOR MAP cho Badge / Tag hiển thị trạng thái đơn hàng
// Dùng với clsx hoặc Tailwind className
// ============================================================

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Confirmed]: 'bg-blue-100 text-blue-800',
    [OrderStatus.Processing]: 'bg-purple-100 text-purple-800',
    [OrderStatus.Shipping]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
    [OrderStatus.Returned]: 'bg-gray-100 text-gray-800',
}

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
    [PaymentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.Paid]: 'bg-green-100 text-green-800',
    [PaymentStatus.Failed]: 'bg-red-100 text-red-800',
    [PaymentStatus.Cancelled]: 'bg-gray-100 text-gray-800',
    [PaymentStatus.Refunded]: 'bg-blue-100 text-blue-800',
}