// Users table - Role column
// SRS: 0 = Admin, 1 = User
export enum UserRole {
    Admin = 0,
    User = 1,
}

// Users table - Status column
// SRS: Inactive = 0, Active = 1, Banned = 2
export enum UserStatus {
    Inactive = 0,
    Active = 1,
    Banned = 2,
}

// ============================================================
// CATEGORY
// ============================================================

// Categories table - Status column
// SRS: Inactive = 0, Active = 1
export enum CategoryStatus {
    Inactive = 0,
    Active = 1,
}

// ============================================================
// PRODUCT
// ============================================================

// Products table - Status column
// SRS: Inactive = 0, Active = 1
export enum ProductStatus {
    Inactive = 0,
    Active = 1,
}

// ProductVariants table - Size column
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

// Orders table - Status column
// SRS: 0=Pending, 1=Confirmed, 2=Processing, 3=Shipping,
//      4=Delivered, 5=Completed, 6=Cancelled, 7=Returned
export enum OrderStatus {
    Pending = 0,
    Confirmed = 1,
    Processing = 2,
    Shipping = 3,
    Delivered = 4,
    Completed = 5,
    Cancelled = 6,
    Returned = 7,
}

export enum DeliveryStatus {
    Pending = 0,
    Created = 1,
    PickedUp = 2,
    InTransit = 3,
    OutForDelivery = 4,
    Delivered = 5,
    Failed = 6,
    Cancelled = 7,
    Returned = 8,
    Exception = 9,
}

// ============================================================
// PAYMENT
// ============================================================

// Orders table - PaymentMethod column
// SRS: 0 = COD, 1 = MoMo, 2 = ZaloPay, 3 = PayOS
export enum PaymentMethod {
    COD = 0,
    MoMo = 1,
    ZaloPay = 2,
    PayOS = 3,
    VNPay = 4,
}

// Payment status - used in payment flow (FR12)
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

// Reviews table - Rating column
// SRS: 1 to 5 stars
export enum ReviewRating {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}

// Review status - used for Admin moderation (Sprint 4)
export enum ReviewStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

// ============================================================
// SORT & FILTER (used for product listing - FR05)
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

// Date range filter - Admin Dashboard
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
// Used to display UI labels and avoid hardcoding in components
// ============================================================

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'Pending',
    [OrderStatus.Confirmed]: 'Confirmed',
    [OrderStatus.Processing]: 'Processing',
    [OrderStatus.Shipping]: 'Shipping',
    [OrderStatus.Delivered]: 'Delivered',
    [OrderStatus.Completed]: 'Completed',
    [OrderStatus.Cancelled]: 'Cancelled',
    [OrderStatus.Returned]: 'Returned',
}

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
    [DeliveryStatus.Pending]: 'Pending',
    [DeliveryStatus.Created]: 'Created',
    [DeliveryStatus.PickedUp]: 'Picked up',
    [DeliveryStatus.InTransit]: 'In transit',
    [DeliveryStatus.OutForDelivery]: 'Out for delivery',
    [DeliveryStatus.Delivered]: 'Delivered',
    [DeliveryStatus.Failed]: 'Failed',
    [DeliveryStatus.Cancelled]: 'Cancelled',
    [DeliveryStatus.Returned]: 'Returned',
    [DeliveryStatus.Exception]: 'Exception',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    [PaymentMethod.COD]: 'Cash on delivery (COD)',
    [PaymentMethod.MoMo]: 'MoMo Wallet',
    [PaymentMethod.ZaloPay]: 'ZaloPay',
    [PaymentMethod.PayOS]: 'PayOS',
    [PaymentMethod.VNPay]: 'VNPay',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    [PaymentStatus.Pending]: 'Pending',
    [PaymentStatus.Paid]: 'Paid',
    [PaymentStatus.Failed]: 'Failed',
    [PaymentStatus.Cancelled]: 'Cancelled',
    [PaymentStatus.Refunded]: 'Refunded',
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
    [UserStatus.Inactive]: 'Inactive',
    [UserStatus.Active]: 'Active',
    [UserStatus.Banned]: 'Banned',
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    [UserRole.Admin]: 'Admin',
    [UserRole.User]: 'User',
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
    [DateRangeFilter.Today]: 'Today',
    [DateRangeFilter.Last7Days]: 'Last 7 days',
    [DateRangeFilter.Last30Days]: 'Last 30 days',
    [DateRangeFilter.Monthly]: 'Monthly',
    [DateRangeFilter.Yearly]: 'Yearly',
    [DateRangeFilter.Custom]: 'Custom',
}

// ============================================================
// Color map for order status badges/tags
// Used with clsx or Tailwind className
// ============================================================

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Confirmed]: 'bg-blue-100 text-blue-800',
    [OrderStatus.Processing]: 'bg-purple-100 text-purple-800',
    [OrderStatus.Shipping]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
    [OrderStatus.Completed]: 'bg-emerald-100 text-emerald-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
    [OrderStatus.Returned]: 'bg-gray-100 text-gray-800',
}

export const DELIVERY_STATUS_COLOR: Record<DeliveryStatus, string> = {
    [DeliveryStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [DeliveryStatus.Created]: 'bg-blue-100 text-blue-800',
    [DeliveryStatus.PickedUp]: 'bg-cyan-100 text-cyan-800',
    [DeliveryStatus.InTransit]: 'bg-indigo-100 text-indigo-800',
    [DeliveryStatus.OutForDelivery]: 'bg-purple-100 text-purple-800',
    [DeliveryStatus.Delivered]: 'bg-green-100 text-green-800',
    [DeliveryStatus.Failed]: 'bg-red-100 text-red-800',
    [DeliveryStatus.Cancelled]: 'bg-gray-100 text-gray-800',
    [DeliveryStatus.Returned]: 'bg-slate-100 text-slate-800',
    [DeliveryStatus.Exception]: 'bg-orange-100 text-orange-800',
}

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
    [PaymentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.Paid]: 'bg-green-100 text-green-800',
    [PaymentStatus.Failed]: 'bg-red-100 text-red-800',
    [PaymentStatus.Cancelled]: 'bg-gray-100 text-gray-800',
    [PaymentStatus.Refunded]: 'bg-blue-100 text-blue-800',
}
