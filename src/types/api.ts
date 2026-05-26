// ------ Base Response ------

// Matches C# ApiResponse<T> { Success, Data, Errors } in Presentation layer
export interface ApiResponse<T> {
    success: boolean
    data: T
    errors: string[]
}

// Response không có data (VD: delete, logout)
export interface ApiResponseNoData {
    success: boolean
    errors: string[]
}

// ------ Pagination ------

// Response cho mọi API trả về danh sách có phân trang
// Matches C# ApiResponse<PagedResult<T>> - PagedResult fields are flat inside data
export interface PaginatedResponse<T> {
    success: boolean
    data: {
        items: T[]
        page: number
        pageSize: number
        totalCount: number
        totalPages: number
    }
    errors: string[]
}

// ------ Error ------

export interface ApiError {
    success: false
    message: string   // constructed by FE axios interceptor, not from backend body
    statusCode: number
    errors?: string[] // mirrors backend errors: string[]
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
