'use client'

import { ProductSortBy } from '@/constants/enums'

interface ProductSortSelectProps {
    value: ProductSortBy | ''
    onChange: (sort: ProductSortBy | '') => void
}

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value as ProductSortBy | '')}
            className="border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
            <option value="">Mặc định</option>
            <option value={ProductSortBy.Newest}>Mới nhất</option>
            <option value={ProductSortBy.PriceAsc}>Giá tăng dần</option>
            <option value={ProductSortBy.PriceDesc}>Giá giảm dần</option>
        </select>
    )
}
