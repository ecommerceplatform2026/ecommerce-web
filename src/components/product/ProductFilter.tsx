'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import type { ProductFilters } from '@/hooks/useProductFilters'

interface ProductFilterProps {
    filters: ProductFilters
    materials: string[]
    onUpdate: (updates: Partial<ProductFilters>) => void
    onReset: () => void
    hasActiveFilters: boolean
}

export function ProductFilter({
    filters,
    materials,
    onUpdate,
    onReset,
    hasActiveFilters,
}: ProductFilterProps) {
    const [localMin, setLocalMin] = useState(filters.minPrice !== null ? String(filters.minPrice) : '')
    const [localMax, setLocalMax] = useState(filters.maxPrice !== null ? String(filters.maxPrice) : '')

    useEffect(() => {
        setLocalMin(filters.minPrice !== null ? String(filters.minPrice) : '')
    }, [filters.minPrice])

    useEffect(() => {
        setLocalMax(filters.maxPrice !== null ? String(filters.maxPrice) : '')
    }, [filters.maxPrice])

    function handleApplyPrice() {
        const parsedMin = localMin !== '' ? Number(localMin) : null
        const parsedMax = localMax !== '' ? Number(localMax) : null
        onUpdate({ minPrice: parsedMin, maxPrice: parsedMax })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                    Khoảng giá
                </h3>
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        placeholder="Từ"
                        value={localMin}
                        onChange={e => setLocalMin(e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <span className="text-muted-foreground shrink-0">—</span>
                    <input
                        type="number"
                        placeholder="Đến"
                        value={localMax}
                        onChange={e => setLocalMax(e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleApplyPrice}>
                    Áp dụng
                </Button>
            </div>

            {materials.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Chất liệu
                    </h3>
                    <div className="space-y-2">
                        {materials.map(mat => (
                            <label key={mat} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.material === mat}
                                    onChange={() =>
                                        onUpdate({ material: filters.material === mat ? '' : mat })
                                    }
                                />
                                {mat}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
                    Xoá bộ lọc
                </Button>
            )}
        </div>
    )
}
