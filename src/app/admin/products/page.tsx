import { Suspense } from "react"
import { ProductManagement } from "@/components/admin/ProductManagement"

export default function AdminProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductManagement />
        </Suspense>
    )
}
