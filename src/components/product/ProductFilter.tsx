'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { preventInvalidNumberInput, toNonNegativeNumberDraft } from '@/utils/inputValidation'
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
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                    Price Range
                </h3>
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        min="0"
                        placeholder="From"
                        value={localMin}
                        onKeyDown={preventInvalidNumberInput}
                        onChange={e =>
                            setPriceDraft({
                                sourceMin: filterMinText,
                                sourceMax: filterMaxText,
                                min: toNonNegativeNumberDraft(e.target.value),
                                max: localMax,
                            })
                        }
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <span className="text-muted-foreground shrink-0">—</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="To"
                        value={localMax}
                        onKeyDown={preventInvalidNumberInput}
                        onChange={e =>
                            setPriceDraft({
                                sourceMin: filterMinText,
                                sourceMax: filterMaxText,
                                min: localMin,
                                max: toNonNegativeNumberDraft(e.target.value),
                            })
                        }
                        className="w-full border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleApplyPrice}>
                    Apply
                </Button>
            </div>

            {materials.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Material
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
                        Color
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
                        Size
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
                <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
                    Clear filters
                </Button>
            )}
        </div>
    )
}
