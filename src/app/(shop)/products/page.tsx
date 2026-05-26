import { Suspense } from 'react'
import { ProductsContent } from '@/components/product/ProductsContent'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsPageFallback />}>
            <ProductsContent />
        </Suspense>
    )
}

function ProductsPageFallback() {
    return (
        <div className="min-h-screen">
            <div className="py-16 px-4 lg:px-8 border-b border-border">
                <div className="container mx-auto space-y-4">
                    <Skeleton className="h-14 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
            </div>
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-[3/4] w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
