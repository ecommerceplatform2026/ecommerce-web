export function formatDate(dateStr: string): string {
    const clean = dateStr.split('T')[0]
    const [year, month, day] = clean.split('-')
    return `${day}/${month}/${year}`
}

export function formatDateTime(dateStr: string): string {
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr))
}

export function formatRelativeTime(dateStr: string): string {
    const diffDays = Math.floor(
        (Date.now() - new Date(dateStr).getTime()) / 86_400_000,
    )
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateStr)
}

export function toISODate(date: Date): string {
    return date.toISOString().split('T')[0]
}
