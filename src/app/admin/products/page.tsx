import { Suspense } from "react"
import { ProductManagement } from "@/components/admin/ProductManagement"

export default function AdminProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductManagement />
        </Suspense>
    )
}
