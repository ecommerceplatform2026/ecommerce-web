'use client'

import { ProductSortBy } from '@/constants/enums'

interface ProductSortSelectProps {
    value: ProductSortBy | ''
    onChange: (sort: ProductSortBy | '') => void
}

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
    return (
        <select
            aria-label="Sắp xếp sản phẩm"
            value={value}
            onChange={event => onChange(event.target.value as ProductSortBy | '')}
            className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring sm:w-auto"
        >
            <option value="">Mặc định</option>
            <option value={ProductSortBy.Newest}>Mới nhất</option>
            <option value={ProductSortBy.PriceAsc}>Giá tăng dần</option>
            <option value={ProductSortBy.PriceDesc}>Giá giảm dần</option>
        </select>
    )
}
