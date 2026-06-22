'use client'

import { useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'

interface DateRangeFilterProps {
    startDate: string
    endDate: string
    onChange: (startDate?: string, endDate?: string) => void
}

type Preset = 'today' | 'last7' | 'last30' | 'thisMonth' | 'thisYear' | 'custom'

const PRESET_OPTIONS: { key: Preset; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'last7', label: 'Last 7 Days' },
    { key: 'last30', label: 'Last 30 Days' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'thisYear', label: 'This Year' },
    { key: 'custom', label: 'Custom' },
]

function computePreset(preset: Preset): { startDate: string; endDate: string } {
    const now = dayjs()
    switch (preset) {
        case 'today':
            return {
                startDate: now.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                endDate: now.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
        case 'last7':
            return {
                startDate: now.subtract(7, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                endDate: now.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
        case 'last30':
            return {
                startDate: now.subtract(30, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                endDate: now.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
        case 'thisMonth':
            return {
                startDate: now.startOf('month').format('YYYY-MM-DDTHH:mm:ss'),
                endDate: now.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
        case 'thisYear':
            return {
                startDate: now.startOf('year').format('YYYY-MM-DDTHH:mm:ss'),
                endDate: now.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            }
        default:
            return {
                startDate: '',
                endDate: '',
            }
    }
}

function detectPreset(startDate: string, endDate: string): Preset {
    if (!startDate && !endDate) return 'today'
    for (const opt of PRESET_OPTIONS) {
        if (opt.key === 'custom') continue
        const { startDate: s, endDate: e } = computePreset(opt.key)
        if (s === startDate && e === endDate) return opt.key
    }
    return 'custom'
}

export function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps) {
    const [activePreset, setActivePreset] = useState<Preset>(() => detectPreset(startDate, endDate))
    const [customStart, setCustomStart] = useState('')
    const [customEnd, setCustomEnd] = useState('')

    const handlePreset = useCallback((preset: Preset) => {
        setActivePreset(preset)
        if (preset === 'custom') {
            onChange(undefined, undefined)
            return
        }
        const { startDate: s, endDate: e } = computePreset(preset)
        onChange(s, e)
    }, [onChange])

    const handleApplyCustom = useCallback(() => {
        if (!customStart || !customEnd) return
        const s = dayjs(customStart).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
        const e = dayjs(customEnd).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
        onChange(s, e)
    }, [customStart, customEnd, onChange])

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handlePreset(key)}
                        className={cn(
                            'rounded-none px-4 py-2 text-sm font-medium transition-colors',
                            activePreset === key
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activePreset === 'custom' && (
                <div className="mt-3 flex flex-wrap items-end gap-3">
                    <div>
                        <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            From
                        </label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            To
                        </label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyCustom}
                        disabled={!customStart || !customEnd}
                        className="rounded-none bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    )
}
