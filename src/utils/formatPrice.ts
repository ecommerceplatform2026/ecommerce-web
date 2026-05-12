export function formatPrice(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value)
}

export function formatPriceShort(value: number): string {
    if (value >= 1_000_000) {
        const millions = value / 1_000_000
        const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)
        return `${formatted}tr ₫`
    }
    return formatPrice(value)
}

export function formatDiscount(original: number, discounted: number): string {
    const pct = Math.round(((original - discounted) / original) * 100)
    return `-${pct}%`
}