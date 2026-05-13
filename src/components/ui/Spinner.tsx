import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
    'animate-spin rounded-full border-2 border-current border-t-transparent',
    {
        variants: {
            size: {
                sm: 'size-4',
                default: 'size-5',
                lg: 'size-8',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
)

interface SpinnerProps
    extends React.ComponentProps<'span'>,
        VariantProps<typeof spinnerVariants> {
    label?: string
}

function Spinner({ className, size, label = 'Đang tải...', ...props }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label={label}
            className={cn(spinnerVariants({ size }), className)}
            {...props}
        />
    )
}

export { Spinner, spinnerVariants }