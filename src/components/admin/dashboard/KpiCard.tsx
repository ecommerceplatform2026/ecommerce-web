import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface KpiCardProps {
    title: string
    value: string
    icon: ReactNode
    isLoading?: boolean
    className?: string
}

export function KpiCard({ title, value, icon, isLoading, className }: KpiCardProps) {
    if (isLoading) {
        return (
            <div className={cn('rounded-none border border-border bg-card p-6', className)}>
                <Skeleton className="mb-2 h-3 w-24 rounded-none" />
                <Skeleton className="h-7 w-32 rounded-none" />
            </div>
        )
    }

    return (
        <div className={cn('rounded-none border border-border bg-card p-6', className)}>
            <div className="flex items-center justify-between">
                <span className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {title}
                </span>
                <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>
            </div>
            <p className="mt-2 font-heading text-2xl tracking-tight text-foreground">
                {value}
            </p>
        </div>
    )
}
