// ------ Base Response ------

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    statusCode: number
}

// Response không có data (VD: delete, logout)
export interface ApiResponseNoData {
    success: boolean
    message: string
    statusCode: number
}

// ------ Pagination ------

// Metadata phân trang — BE trả về kèm list
export interface PaginationMeta {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// Response cho mọi API trả về danh sách có phân trang
export interface PaginatedResponse<T> {
    success: boolean
    message: string
    statusCode: number
    data: {
        items: T[]
        pagination: PaginationMeta
    }
}

// ------ Error ------

// Lỗi validation từ BE (VD: field email đã tồn tại)
export interface ValidationError {
    field: string
    message: string
}

export interface ApiError {
    success: false
    message: string
    statusCode: number
    errors?: ValidationError[]  // danh sách lỗi từng field nếu có
}

// ------ Request Params ------

// Query params chung cho mọi API có list + filter
export interface BaseQueryParams {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}