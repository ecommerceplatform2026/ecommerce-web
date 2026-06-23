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
    const filterMinText = filters.minPrice !== null ? String(filters.minPrice) : ''
    const filterMaxText = filters.maxPrice !== null ? String(filters.maxPrice) : ''
    const [priceDraft, setPriceDraft] = useState({
        sourceMin: filterMinText,
        sourceMax: filterMaxText,
        min: filterMinText,
        max: filterMaxText,
    })

    const localMin =
        priceDraft.sourceMin === filterMinText && priceDraft.sourceMax === filterMaxText
            ? priceDraft.min
            : filterMinText
    const localMax =
        priceDraft.sourceMin === filterMinText && priceDraft.sourceMax === filterMaxText
            ? priceDraft.max
            : filterMaxText

    function normalizePriceInput(value: string) {
        return value.replace('-', '')
    }

    function handleApplyPrice() {
        const minCandidate = localMin !== '' ? Number(localMin) : null
        const maxCandidate = localMax !== '' ? Number(localMax) : null
        const parsedMin = minCandidate !== null && Number.isFinite(minCandidate) ? minCandidate : null
        const parsedMax = maxCandidate !== null && Number.isFinite(maxCandidate) ? maxCandidate : null
        onUpdate({
            minPrice: parsedMin !== null ? Math.max(0, parsedMin) : null,
            maxPrice: parsedMax !== null ? Math.max(0, parsedMax) : null,
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                    Price Range
                </h3>
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        min={0}
                        placeholder="From"
                        value={localMin}
                        onChange={e =>
                            setPriceDraft({
                                sourceMin: filterMinText,
                                sourceMax: filterMaxText,
                                min: normalizePriceInput(e.target.value),
                                max: localMax,
                            })
                        }
                        onBlur={handleApplyPrice}
                        onKeyDown={e => {
                            if (e.key === '-') e.preventDefault()
                            if (e.key === 'Enter') handleApplyPrice()
                        }}
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <span className="text-muted-foreground shrink-0">-</span>
                    <input
                        type="number"
                        min={0}
                        placeholder="To"
                        value={localMax}
                        onChange={e =>
                            setPriceDraft({
                                sourceMin: filterMinText,
                                sourceMax: filterMaxText,
                                min: localMin,
                                max: normalizePriceInput(e.target.value),
                            })
                        }
                        onBlur={handleApplyPrice}
                        onKeyDown={e => {
                            if (e.key === '-') e.preventDefault()
                            if (e.key === 'Enter') handleApplyPrice()
                        }}
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>

            {materials.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Material
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {materials.map(material => (
                            <button
                                key={material}
                                type="button"
                                onClick={() => onUpdate({ material: filters.material === material ? '' : material })}
                                className={`text-left px-3 py-1 text-sm border transition-colors ${
                                    filters.material === material
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border hover:border-foreground'
                                }`}
                            >
                                {material}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Color
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => onUpdate({ color: filters.color === color ? '' : color })}
                                className={`text-left px-3 py-1 text-sm border transition-colors ${
                                    filters.color === color
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border hover:border-foreground'
                                }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onUpdate({ size: filters.size === size ? '' : size })}
                                className={`text-left px-3 py-1 text-sm border transition-colors ${
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
                    Clear filters
                </Button>
            )}
        </div>
    )
}
