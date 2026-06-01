"use client"

import { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Edit2, FolderTree, Plus, Search, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Skeleton } from "@/components/ui/Skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Modal"
import { categoryKeys, useAdminCategories } from "@/hooks/useCategories"
import { categoryService } from "@/services/categoryService"
import { formatDate } from "@/utils/formatDate"
import type { Category, CategoryFormValues } from "@/types/category"

const PAGE_SIZE = 8
const MAX_NAME_LENGTH = 100

type CategoryModalMode = "create" | "edit"

type CategoryFormState = CategoryFormValues

interface CategoryApiError {
    message?: string
    errors?: string[]
    response?: {
        data?: {
            message?: string
            errors?: string[]
        }
    }
}

function getApiErrorMessage(error: unknown): string {
    if (typeof error !== "object" || error === null) {
        return "Category operation failed."
    }

    const apiError = error as CategoryApiError
    return (
        apiError.errors?.[0] ??
        apiError.response?.data?.errors?.[0] ??
        apiError.message ??
        apiError.response?.data?.message ??
        "Category operation failed."
    )
}

function validateCategoryForm(values: CategoryFormState): Partial<Record<keyof CategoryFormState, string>> {
    const errors: Partial<Record<keyof CategoryFormState, string>> = {}
    const name = values.name.trim()

    if (!name) {
        errors.name = "Category name is required."
    } else if (name.length > MAX_NAME_LENGTH) {
        errors.name = `Category name must not exceed ${MAX_NAME_LENGTH} characters.`
    }

    return errors
}

function CategoryTableSkeleton() {
    return (
        <div className="space-y-3 rounded-md border border-border p-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[1.5fr_1fr_120px] gap-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                </div>
            ))}
        </div>
    )
}

export function CategoryManagement() {
    const queryClient = useQueryClient()
    const { data: categories = [], isLoading, error } = useAdminCategories()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [modalMode, setModalMode] = useState<CategoryModalMode>("create")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [formState, setFormState] = useState<CategoryFormState>({ name: "" })
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({})
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const filteredCategories = useMemo(() => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return categories
        return categories.filter(category => category.name.toLowerCase().includes(query))
    }, [categories, searchTerm])

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + PAGE_SIZE)

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: categoryKeys.adminAll, exact: true })
        queryClient.invalidateQueries({ queryKey: categoryKeys.all, exact: true })
    }

    const createMutation = useMutation({
        mutationFn: (payload: CategoryFormValues) => categoryService.create(payload),
        onSuccess: () => {
            invalidateCategories()
            toast.success("Category created successfully.")
            closeFormModal()
        },
        onError: error => {
            toast.error(getApiErrorMessage(error))
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CategoryFormValues }) =>
            categoryService.update(id, payload),
        onSuccess: () => {
            invalidateCategories()
            toast.success("Category updated successfully.")
            closeFormModal()
        },
        onError: error => {
            toast.error(getApiErrorMessage(error))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoryService.delete(id),
        onSuccess: () => {
            invalidateCategories()
            toast.success("Category deleted successfully.")
            setDeleteTarget(null)
        },
        onError: error => {
            toast.error(getApiErrorMessage(error))
        },
    })

    const isSubmitting = createMutation.isPending || updateMutation.isPending

    function openCreateModal() {
        setModalMode("create")
        setSelectedCategory(null)
        setFormState({ name: "" })
        setFormErrors({})
        setIsFormOpen(true)
    }

    function openEditModal(category: Category) {
        setModalMode("edit")
        setSelectedCategory(category)
        setFormState({ name: category.name })
        setFormErrors({})
        setIsFormOpen(true)
    }

    function closeFormModal() {
        setIsFormOpen(false)
        setSelectedCategory(null)
        setFormState({ name: "" })
        setFormErrors({})
    }

    function handleSubmit() {
        const errors = validateCategoryForm(formState)
        setFormErrors(errors)
        if (Object.keys(errors).length > 0) return

        const payload = { name: formState.name.trim() }
        if (modalMode === "create") {
            createMutation.mutate(payload)
            return
        }

        if (selectedCategory) {
            updateMutation.mutate({ id: selectedCategory.id, payload })
        }
    }

    function handleSearch(value: string) {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    return (
        <main className="min-h-screen bg-background px-4 py-10 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                            Admin
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl">Category Management</h1>
                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            Manage storefront product categories. Create, rename, and delete categories through backend admin APIs.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="h-11 w-full lg:w-auto">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                <section className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={event => handleSearch(event.target.value)}
                            placeholder="Search categories..."
                            className="h-11 pl-10"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {filteredCategories.length} of {categories.length} categories
                    </div>
                </section>

                {isLoading ? (
                    <CategoryTableSkeleton />
                ) : error ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
                        <p className="font-medium text-destructive">Unable to load categories</p>
                        <p className="mt-1 text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="rounded-md border border-border">
                        <EmptyState
                            icon={<FolderTree />}
                            title="No categories found"
                            description={
                                searchTerm
                                    ? "Try a different search term."
                                    : "Create the first category to organize products."
                            }
                            action={
                                !searchTerm ? (
                                    <Button size="sm" onClick={openCreateModal}>
                                        <Plus className="h-4 w-4" />
                                        Add Category
                                    </Button>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-md border border-border bg-background">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] table-fixed">
                                <thead className="border-b border-border bg-secondary/70">
                                    <tr>
                                        <th className="w-[55%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Category
                                        </th>
                                        <th className="w-[25%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Created
                                        </th>
                                        <th className="w-[20%] px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCategories.map(category => (
                                        <tr key={category.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="font-medium">{category.name}</p>
                                                    <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">
                                                        {category.id}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-muted-foreground">
                                                {category.createdAt ? formatDate(category.createdAt) : "N/A"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(category)}
                                                        aria-label={`Edit ${category.name}`}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteTarget(category)}
                                                        aria-label={`Delete ${category.name}`}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <p>
                                Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, filteredCategories.length)} of {filteredCategories.length}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentPage(page => Math.max(1, Math.min(page, totalPages) - 1))}
                                    disabled={safeCurrentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                                        <Button
                                            key={page}
                                            type="button"
                                            variant={page === safeCurrentPage ? "default" : "outline"}
                                            onClick={() => setCurrentPage(page)}
                                            className="w-10"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentPage(page => Math.min(totalPages, Math.min(page, totalPages) + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={open => (open ? setIsFormOpen(true) : closeFormModal())}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{modalMode === "create" ? "Add Category" : "Edit Category"}</DialogTitle>
                        <DialogDescription>
                            Category names are used across product listing, filtering, and admin workflows.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                            id="category-name"
                            value={formState.name}
                            onChange={event => {
                                setFormState({ name: event.target.value })
                                if (formErrors.name) setFormErrors({})
                            }}
                            placeholder="Enter category name"
                            maxLength={MAX_NAME_LENGTH}
                            aria-invalid={Boolean(formErrors.name)}
                        />
                        <div className="flex justify-between gap-4 text-xs">
                            <p className={formErrors.name ? "text-destructive" : "text-muted-foreground"}>
                                {formErrors.name ?? "Required. Maximum 100 characters."}
                            </p>
                            <p className="text-muted-foreground">
                                {formState.name.trim().length}/{MAX_NAME_LENGTH}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={closeFormModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : modalMode === "create"
                                  ? "Create Category"
                                  : "Update Category"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(deleteTarget)} onOpenChange={open => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            This action calls the backend delete API. If the category contains active products, the backend will prevent deletion.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>
                                Confirm that no active products depend on &quot;{deleteTarget?.name}&quot; before deleting it.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Category"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}
