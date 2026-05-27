import { Button } from '@/components/ui/Button'
import type { Category } from '@/types/category'

interface CategoryListProps {
    categories: Category[]
    selectedCategoryId: string
    onSelect: (categoryId: string) => void
}

export function CategoryList({ categories, selectedCategoryId, onSelect }: CategoryListProps) {
    if (categories.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant={selectedCategoryId === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelect('')}
            >
                Tất cả
            </Button>
            {categories.map(cat => (
                <Button
                    key={cat.id}
                    variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </Button>
            ))}
        </div>
    )
}
