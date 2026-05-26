import type { Category } from '@/types/category'

interface CategoryListProps {
    categories: Category[]
    selectedCategoryId: string
    onSelect: (categoryId: string) => void
    className?: string
}

export function CategoryList({ categories, selectedCategoryId, onSelect, className }: CategoryListProps) {
    if (categories.length === 0) return null

    return (
        <div className={className}>
            <select
                aria-label="Danh mục sản phẩm"
                value={selectedCategoryId}
                onChange={event => onSelect(event.target.value)}
                className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
                <option value="">Tất cả danh mục</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    )
}
