'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { ProductFilters } from '@/hooks/useProductFilters'

interface ProductFilterProps {
    filters: ProductFilters
    materials: string[]
    colors: string[]
    sizes: string[]
    onUpdate: (updates: Partial<ProductFilters>) => void
    onReset: () => void
    hasActiveFilters: boolean
}

export function ProductFilter({
    filters,
    materials,
    colors,
    sizes,
    onUpdate,
    onReset,
    hasActiveFilters,
}: ProductFilterProps) {
    const [localMin, setLocalMin] = useState(filters.minPrice !== null ? String(filters.minPrice) : '')
    const [localMax, setLocalMax] = useState(filters.maxPrice !== null ? String(filters.maxPrice) : '')

    function handleApplyPrice() {
        const minCandidate = localMin !== '' ? Number(localMin) : null
        const maxCandidate = localMax !== '' ? Number(localMax) : null
        const parsedMin = minCandidate !== null && Number.isFinite(minCandidate) ? minCandidate : null
        const parsedMax = maxCandidate !== null && Number.isFinite(maxCandidate) ? maxCandidate : null
        onUpdate({ minPrice: parsedMin, maxPrice: parsedMax })
    }

    function handleResetFilters() {
        setLocalMin('')
        setLocalMax('')
        onReset()
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

            {colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Màu sắc
                    </h3>
                    <div className="space-y-2">
                        {colors.map(col => (
                            <label key={col} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.color === col}
                                    onChange={() =>
                                        onUpdate({ color: filters.color === col ? '' : col })
                                    }
                                />
                                {col}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Kích cỡ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(sz => (
                            <button
                                key={sz}
                                onClick={() => onUpdate({ size: filters.size === sz ? '' : sz })}
                                className={`px-3 py-1 text-sm border transition-colors ${
                                    filters.size === sz
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border hover:border-foreground'
                                }`}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="w-full" onClick={handleResetFilters}>
                    Xoá bộ lọc
                </Button>
            )}
        </div>
    )
}
