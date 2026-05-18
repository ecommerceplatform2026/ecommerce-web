'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ProductSortBy } from '@/constants/enums'

export interface ProductFilters {
    search: string
    categoryId: string
    minPrice: number | null
    maxPrice: number | null
    material: string
    sort: ProductSortBy | ''
    page: number
}

export const PAGE_SIZE = 12

const DEFAULT_FILTERS: ProductFilters = {
    search: '',
    categoryId: '',
    minPrice: null,
    maxPrice: null,
    material: '',
    sort: '',
    page: 1,
}

function parseFilters(params: URLSearchParams): ProductFilters {
    const minRaw = params.get('minPrice')
    const maxRaw = params.get('maxPrice')
    const pageRaw = params.get('page')
    const sortRaw = params.get('sort')

    const validSortValues = Object.values(ProductSortBy) as string[]
    const sort = sortRaw && validSortValues.includes(sortRaw) ? (sortRaw as ProductSortBy) : ''

    return {
        search: params.get('search') ?? '',
        categoryId: params.get('categoryId') ?? '',
        minPrice: minRaw !== null ? Number(minRaw) : null,
        maxPrice: maxRaw !== null ? Number(maxRaw) : null,
        material: params.get('material') ?? '',
        sort,
        page: pageRaw ? Math.max(1, parseInt(pageRaw, 10)) : 1,
    }
}

function buildParams(filters: ProductFilters): URLSearchParams {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    if (filters.categoryId) params.set('categoryId', filters.categoryId)
    if (filters.minPrice !== null) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice !== null) params.set('maxPrice', String(filters.maxPrice))
    if (filters.material) params.set('material', filters.material)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.page > 1) params.set('page', String(filters.page))

    return params
}

export function useProductFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const filters = useMemo(() => parseFilters(searchParams), [searchParams])

    const pushFilters = useCallback(
        (next: ProductFilters) => {
            const params = buildParams(next)
            const qs = params.toString()
            router.push(pathname + (qs ? '?' + qs : ''), { scroll: false })
        },
        [router, pathname],
    )

    const updateFilter = useCallback(
        <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
            const next: ProductFilters = {
                ...filters,
                [key]: value,
                page: key === 'page' ? (value as number) : 1,
            }
            pushFilters(next)
        },
        [filters, pushFilters],
    )

    const updateFilters = useCallback(
        (partial: Partial<ProductFilters>) => {
            const hasPage = 'page' in partial
            const next: ProductFilters = {
                ...filters,
                ...partial,
                page: hasPage ? (partial.page ?? 1) : 1,
            }
            pushFilters(next)
        },
        [filters, pushFilters],
    )

    const resetFilters = useCallback(() => {
        router.push(pathname, { scroll: false })
    }, [router, pathname])

    const hasActiveFilters = useMemo(
        () =>
            !!(
                filters.search ||
                filters.categoryId ||
                filters.minPrice !== null ||
                filters.maxPrice !== null ||
                filters.material ||
                filters.sort
            ),
        [filters],
    )

    return { filters, updateFilter, updateFilters, resetFilters, hasActiveFilters }
}
