import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'

export const categoryKeys = {
    all: ['categories'] as const,
    adminAll: ['categories', 'admin'] as const,
}

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: categoryService.getAll,
    })
}

export function useAdminCategories() {
    return useQuery({
        queryKey: categoryKeys.adminAll,
        queryFn: categoryService.getAdminAll,
    })
}
