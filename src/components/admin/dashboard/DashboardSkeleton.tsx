import { Skeleton } from '@/components/ui/Skeleton'

export function DashboardSkeleton() {
    return (
        <div className="px-4 py-10 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <div className="mb-6">
                    <Skeleton className="h-10 w-full rounded-none" />
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-none" />
                    ))}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Skeleton className="col-span-2 h-80 rounded-none" />
                    <Skeleton className="h-80 rounded-none" />
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Skeleton className="h-72 rounded-none" />
                    <Skeleton className="h-72 rounded-none" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Skeleton className="h-64 rounded-none" />
                    <Skeleton className="h-64 rounded-none" />
                </div>
            </div>
        </div>
    )
}
