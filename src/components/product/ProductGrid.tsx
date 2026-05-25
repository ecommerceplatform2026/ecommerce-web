import { ProductCard } from "./ProductCard"
import type { Product } from "@/types/product"

interface ProductGridProps {
    products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
