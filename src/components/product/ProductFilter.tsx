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

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Khoảng giá
                </h3>
                <div className="mb-2 flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Từ"
                        value={localMin}
                        onChange={event => setLocalMin(event.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <span className="shrink-0 text-muted-foreground">-</span>
                    <input
                        type="number"
                        placeholder="Đến"
                        value={localMax}
                        onChange={event => setLocalMax(event.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleApplyPrice}>
                    Áp dụng
                </Button>
            </div>

            {materials.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Chất liệu
                    </h3>
                    <div className="space-y-2">
                        {materials.map(material => (
                            <label key={material} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.material === material}
                                    onChange={() =>
                                        onUpdate({ material: filters.material === material ? '' : material })
                                    }
                                />
                                {material}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {colors.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Màu sắc
                    </h3>
                    <div className="space-y-2">
                        {colors.map(color => (
                            <label key={color} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.color === color}
                                    onChange={() =>
                                        onUpdate({ color: filters.color === color ? '' : color })
                                    }
                                />
                                {color}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Kích cỡ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onUpdate({ size: filters.size === size ? '' : size })}
                                className={`border px-3 py-1 text-sm transition-colors ${
                                    filters.size === size
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border hover:border-foreground'
                                }`}
                            >
                                {size}
                            </button>
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
