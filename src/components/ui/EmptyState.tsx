import * as React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 py-12 text-center',
                className,
            )}
        >
            {icon && (
                <div className="text-muted-foreground opacity-40 [&_svg]:size-10">
                    {icon}
                </div>
            )}
            <p className="font-medium text-foreground">{title}</p>
            {description && (
                <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}

export { EmptyState }