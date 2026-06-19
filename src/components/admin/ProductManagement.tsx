"use client"

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    AlertTriangle,
    ArrowUpDown,
    Boxes,
    Edit2,
    ImagePlus,
    Package,
    Plus,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react"
import toast from "react-hot-toast"
import { ProductStatus } from "@/constants/enums"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Input } from "@/components/ui/Input"
import { Skeleton } from "@/components/ui/Skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Modal"
import { categoryKeys, useAdminCategories } from "@/hooks/useCategories"
import { productKeys, useAdminProducts } from "@/hooks/useProducts"
import { productService } from "@/services/productService"
import { formatPrice } from "@/utils/formatPrice"
import { hasEdgeWhitespace, preventInvalidNumberInput, toNonNegativeNumberDraft } from "@/utils/inputValidation"
import type {
    Product,
    ProductFormValues,
    ProductImage,
    ProductVariantFormValues,
    ProductVariantResponse,
} from "@/types/product"

const PAGE_SIZE = 8
const MAX_NAME_LENGTH = 200
const MAX_MATERIAL_LENGTH = 100
const MAX_SKU_LENGTH = 50
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

type ProductModalMode = "create" | "edit"
type ProductTab = "basic" | "variants" | "images"
type ProductSortColumn = "name" | "category" | "price" | "stock" | "status"
type SortDirection = "asc" | "desc"

interface ProductFormState {
    categoryId: string
    name: string
    description: string
    material: string
    basePrice: string
    status: ProductStatus
}

interface VariantRow {
    localId: string
    id?: string
    sku: string
    color: string
    size: string
    stock: string
    lowStockThreshold: string
    price: string
}

type VariantSnapshotMap = Record<string, ProductVariantFormValues>

interface ProductApiError {
    message?: string
    errors?: string[]
    Errors?: string[]
    response?: {
        data?: {
            message?: string
            errors?: string[]
            Errors?: string[]
        }
    }
}

interface ProductFormError {
    tab: ProductTab
    message: string
}

interface ProductSortState {
    column: ProductSortColumn
    direction: SortDirection
}

class ProductSubmitError extends Error {
    tab: ProductTab

    constructor(tab: ProductTab, message: string) {
        super(message)
        this.name = "ProductSubmitError"
        this.tab = tab
    }
}

function isProductSubmitError(error: unknown): error is ProductSubmitError {
    return error instanceof ProductSubmitError
}

function getApiErrorMessage(error: unknown): string {
    if (typeof error !== "object" || error === null) return "Product operation failed."
    const apiError = error as ProductApiError
    return (
        apiError.message ??
        apiError.errors?.[0] ??
        apiError.Errors?.[0] ??
        apiError.response?.data?.errors?.[0] ??
        apiError.response?.data?.Errors?.[0] ??
        apiError.response?.data?.message ??
        "Product operation failed."
    )
}

function createEmptyProductForm(): ProductFormState {
    return {
        categoryId: "",
        name: "",
        description: "",
        material: "",
        basePrice: "",
        status: ProductStatus.Active,
    }
}

function createEmptyVariantRow(): VariantRow {
    return {
        localId: crypto.randomUUID(),
        sku: "",
        color: "",
        size: "",
        stock: "0",
        lowStockThreshold: "5",
        price: "0",
    }
}

function productToForm(product: Product): ProductFormState {
    return {
        categoryId: product.categoryId,
        name: product.name,
        description: product.description ?? "",
        material: product.material ?? "",
        basePrice: String(product.basePrice ?? 0),
        status: product.status,
    }
}

function variantToRow(variant: ProductVariantResponse): VariantRow {
    return {
        localId: variant.id,
        id: variant.id,
        sku: variant.sku,
        color: variant.color ?? "",
        size: variant.size ?? "",
        stock: String(variant.stock),
        lowStockThreshold: String(variant.lowStockThreshold ?? 5),
        price: String(variant.price),
    }
}

function toNumber(value: string): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : Number.NaN
}

function toProductPayload(form: ProductFormState): ProductFormValues {
    return {
        categoryId: form.categoryId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        material: form.material.trim() || null,
        basePrice: toNumber(form.basePrice),
        status: form.status,
    }
}

function toVariantPayload(row: VariantRow): ProductVariantFormValues {
    return {
        sku: row.sku.trim(),
        color: row.color.trim() || null,
        size: row.size.trim() || null,
        stock: toNumber(row.stock),
        lowStockThreshold: toNumber(row.lowStockThreshold),
        price: toNumber(row.price),
    }
}

function normalizeVariantPayload(payload: ProductVariantFormValues): ProductVariantFormValues {
    return {
        ...payload,
        sku: payload.sku.trim(),
        color: payload.color?.trim() || null,
        size: payload.size?.trim() || null,
    }
}

function areVariantPayloadsEqual(first: ProductVariantFormValues, second: ProductVariantFormValues): boolean {
    const normalizedFirst = normalizeVariantPayload(first)
    const normalizedSecond = normalizeVariantPayload(second)

    return (
        normalizedFirst.sku === normalizedSecond.sku &&
        normalizedFirst.color === normalizedSecond.color &&
        normalizedFirst.size === normalizedSecond.size &&
        normalizedFirst.stock === normalizedSecond.stock &&
        normalizedFirst.lowStockThreshold === normalizedSecond.lowStockThreshold &&
        normalizedFirst.price === normalizedSecond.price
    )
}

function createVariantSnapshot(rows: VariantRow[]): VariantSnapshotMap {
    return rows.reduce<VariantSnapshotMap>((snapshot, row) => {
        if (row.id) snapshot[row.id] = normalizeVariantPayload(toVariantPayload(row))
        return snapshot
    }, {})
}

function validateProductForm(form: ProductFormState): string[] {
    const errors: string[] = []
    const basePrice = toNumber(form.basePrice)

    if (!form.categoryId) errors.push("Category is required.")
    if (!form.name.trim()) errors.push("Product name is required.")
    if (form.name && hasEdgeWhitespace(form.name)) {
        errors.push("Product name must not start or end with spaces.")
    }
    if (form.name.trim().length > MAX_NAME_LENGTH) {
        errors.push(`Product name must not exceed ${MAX_NAME_LENGTH} characters.`)
    }
    if (form.material && hasEdgeWhitespace(form.material)) {
        errors.push("Material must not start or end with spaces.")
    }
    if (form.description && hasEdgeWhitespace(form.description)) {
        errors.push("Description must not start or end with spaces.")
    }
    if (form.material.trim().length > MAX_MATERIAL_LENGTH) {
        errors.push(`Material must not exceed ${MAX_MATERIAL_LENGTH} characters.`)
    }
    if (!Number.isFinite(basePrice) || basePrice < 0) {
        errors.push("Base price must be a non-negative number.")
    }

    return errors
}

function validateVariantRows(rows: VariantRow[]): string[] {
    const errors: string[] = []
    const seenSkus = new Set<string>()
    const seenOptions = new Set<string>()

    rows.forEach((row, index) => {
        const rowLabel = `Variant ${index + 1}`
        const sku = row.sku.trim().toLowerCase()
        const color = row.color.trim().toLowerCase()
        const size = row.size.trim().toLowerCase()
        const stock = toNumber(row.stock)
        const threshold = toNumber(row.lowStockThreshold)
        const price = toNumber(row.price)

        if (!sku) errors.push(`${rowLabel}: SKU is required.`)
        if (row.sku && hasEdgeWhitespace(row.sku)) errors.push(`${rowLabel}: SKU must not start or end with spaces.`)
        if (sku.length > MAX_SKU_LENGTH) errors.push(`${rowLabel}: SKU must not exceed ${MAX_SKU_LENGTH} characters.`)
        if (sku && seenSkus.has(sku)) errors.push(`${rowLabel}: SKU must be unique in this form.`)
        if (sku) seenSkus.add(sku)
        if (!color) errors.push(`${rowLabel}: color is required.`)
        if (row.color && hasEdgeWhitespace(row.color)) errors.push(`${rowLabel}: color must not start or end with spaces.`)
        if (!size) errors.push(`${rowLabel}: size is required.`)
        if (row.size && hasEdgeWhitespace(row.size)) errors.push(`${rowLabel}: size must not start or end with spaces.`)
        if (color && size) {
            const optionKey = `${size}:${color}`
            if (seenOptions.has(optionKey)) errors.push(`${rowLabel}: size and color combination must be unique.`)
            seenOptions.add(optionKey)
        }
        if (!Number.isFinite(stock) || stock < 0) errors.push(`${rowLabel}: stock must be non-negative.`)
        if (!Number.isFinite(threshold) || threshold < 0) {
            errors.push(`${rowLabel}: low stock threshold must be non-negative.`)
        }
        if (!Number.isFinite(price) || price < 0) errors.push(`${rowLabel}: price must be non-negative.`)
    })

    return errors
}

function getProductImage(product: Product): string | null {
    return product.imageUrl ?? null
}

function getProductPrice(product: Product): string {
    const min = product.minPrice ?? product.basePrice
    const max = product.maxPrice ?? product.basePrice
    if (min !== max) return `${formatPrice(min)} - ${formatPrice(max)}`
    return formatPrice(min)
}

function getProductStock(product: Product): number {
    return product.totalStock ?? product.variants.reduce((total, variant) => total + variant.stock, 0)
}

function getProductSortPrice(product: Product): number {
    return product.minPrice ?? product.basePrice
}

function validateImageFiles(files: File[]): { accepted: File[]; errors: string[] } {
    const errors: string[] = []
    const accepted = files.filter(file => {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            errors.push(`${file.name}: only JPEG, PNG, WEBP, and GIF images are allowed.`)
            return false
        }

        if (file.size > MAX_IMAGE_SIZE) {
            errors.push(`${file.name}: image size cannot exceed 10 MB.`)
            return false
        }

        return true
    })

    return { accepted, errors }
}

function ProductTableSkeleton() {
    return (
        <div className="space-y-3 rounded-md border border-border p-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[96px_1.8fr_1fr_1fr_1fr_120px] gap-4">
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                </div>
            ))}
        </div>
    )
}

export function ProductManagement() {
    const queryClient = useQueryClient()
    const { data: products = [], isLoading, error } = useAdminProducts()
    const { data: categories = [] } = useAdminCategories()

    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") ?? "")

    const [currentPage, setCurrentPage] = useState(1)
    const [sortState, setSortState] = useState<ProductSortState>({
        column: "name",
        direction: "asc",
    })
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<ProductTab>("basic")
    const [modalMode, setModalMode] = useState<ProductModalMode>("create")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [formState, setFormState] = useState<ProductFormState>(createEmptyProductForm())
    const [variantRows, setVariantRows] = useState<VariantRow[]>([])
    const [initialVariantSnapshot, setInitialVariantSnapshot] = useState<VariantSnapshotMap>({})
    const [existingImages, setExistingImages] = useState<ProductImage[]>([])
    const [pendingImages, setPendingImages] = useState<File[]>([])
    const [imageLoadWarning, setImageLoadWarning] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<ProductFormError[]>([])
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const filteredProducts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return products
        return products.filter(product =>
            [product.name, product.categoryName, product.material]
                .filter(Boolean)
                .some(value => value!.toLowerCase().includes(query)),
        )
    }, [products, searchTerm])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((first, second) => {
            const direction = sortState.direction === "asc" ? 1 : -1

            if (sortState.column === "price") {
                return (getProductSortPrice(first) - getProductSortPrice(second)) * direction
            }

            if (sortState.column === "stock") {
                return (getProductStock(first) - getProductStock(second)) * direction
            }

            if (sortState.column === "status") {
                return (first.status - second.status) * direction
            }

            const firstValue = sortState.column === "category" ? first.categoryName ?? "" : first.name
            const secondValue = sortState.column === "category" ? second.categoryName ?? "" : second.name

            return firstValue.localeCompare(secondValue, undefined, {
                numeric: true,
                sensitivity: "base",
            }) * direction
        })
    }, [filteredProducts, sortState])

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PAGE_SIZE)
    const activeTabErrors = formErrors.filter(error => error.tab === activeTab)

    function toggleSort(column: ProductSortColumn) {
        setSortState(current =>
            current.column === column
                ? { column, direction: current.direction === "asc" ? "desc" : "asc" }
                : { column, direction: "asc" },
        )
        setCurrentPage(1)
    }

    const invalidateProducts = () => {
        queryClient.invalidateQueries({ queryKey: productKeys.adminAll })
        queryClient.invalidateQueries({ queryKey: productKeys.all })
    }

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => productService.delete(id),
        onSuccess: () => {
            invalidateProducts()
            toast.success("Product deleted successfully.")
            setDeleteTarget(null)
        },
        onError: error => toast.error(getApiErrorMessage(error)),
    })

    const deleteVariantMutation = useMutation({
        mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) =>
            productService.deleteVariant(productId, variantId),
        onSuccess: (_, variables) => {
            setVariantRows(rows => rows.filter(row => row.id !== variables.variantId))
            invalidateProducts()
            toast.success("Variant deleted successfully.")
        },
        onError: error => toast.error(getApiErrorMessage(error)),
    })

    const deleteImageMutation = useMutation({
        mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
            productService.deleteImage(productId, imageId),
        onSuccess: (_, variables) => {
            setExistingImages(images => images.filter(image => image.id !== variables.imageId))
            invalidateProducts()
            toast.success("Image deleted successfully.")
        },
        onError: error => toast.error(getApiErrorMessage(error)),
    })

    function resetForm() {
        setActiveTab("basic")
        setSelectedProduct(null)
        setFormState(createEmptyProductForm())
        setVariantRows([])
        setInitialVariantSnapshot({})
        setExistingImages([])
        setPendingImages([])
        setImageLoadWarning(null)
        setFormErrors([])
        setIsLoadingDetail(false)
    }

    function closeForm() {
        setIsFormOpen(false)
        resetForm()
    }

    function openCreateModal() {
        resetForm()
        setModalMode("create")
        setVariantRows([createEmptyVariantRow()])
        setIsFormOpen(true)
    }

    async function openEditModal(product: Product) {
        resetForm()
        setModalMode("edit")
        setSelectedProduct(product)
        setFormState(productToForm(product))
        setVariantRows(product.variants.map(variantToRow))
        setInitialVariantSnapshot(createVariantSnapshot(product.variants.map(variantToRow)))
        setIsFormOpen(true)
        setIsLoadingDetail(true)

        try {
            const [baseResult, variantsResult, imagesResult] = await Promise.allSettled([
                productService.getById(product.id),
                productService.getVariants(product.id),
                productService.getImages(product.id),
            ])

            if (baseResult.status === "fulfilled") {
                setSelectedProduct(baseResult.value)
                setFormState(productToForm(baseResult.value))
            }

            if (variantsResult.status === "fulfilled") {
                const rows = variantsResult.value.map(variantToRow)
                setVariantRows(rows)
                setInitialVariantSnapshot(createVariantSnapshot(rows))
            } else {
                toast.error(getApiErrorMessage(variantsResult.reason))
            }

            if (imagesResult.status === "fulfilled") {
                setExistingImages(imagesResult.value)
                setImageLoadWarning(null)
            } else {
                setExistingImages([])
                setImageLoadWarning(
                    "Existing images could not be loaded from the current backend API. New uploads still work when you save.",
                )
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        } finally {
            setIsLoadingDetail(false)
        }
    }

    function updateVariantRow(localId: string, updates: Partial<VariantRow>) {
        setVariantRows(rows => rows.map(row => (row.localId === localId ? { ...row, ...updates } : row)))
    }

    function removeVariantRow(row: VariantRow) {
        if (row.id && selectedProduct) {
            deleteVariantMutation.mutate({ productId: selectedProduct.id, variantId: row.id })
            return
        }
        setVariantRows(rows => rows.filter(item => item.localId !== row.localId))
    }

    function handleImageInput(files: FileList | null) {
        if (!files) return
        const { accepted, errors } = validateImageFiles(Array.from(files))
        errors.forEach(errorMessage => toast.error(errorMessage))
        if (accepted.length === 0) return
        setPendingImages(images => [...images, ...accepted])
    }

    async function persistVariants(productId: string) {
        try {
            for (const row of variantRows) {
                const payload = normalizeVariantPayload(toVariantPayload(row))
                if (row.id) {
                    const initialPayload = initialVariantSnapshot[row.id]
                    if (initialPayload && areVariantPayloadsEqual(initialPayload, payload)) continue
                    await productService.updateVariant(productId, row.id, payload)
                } else {
                    await productService.createVariant(productId, payload)
                }
            }
        } catch (error) {
            throw new ProductSubmitError("variants", `Variant save failed: ${getApiErrorMessage(error)}`)
        }
    }

    async function persistImages(productId: string) {
        try {
            for (const image of pendingImages) {
                await productService.uploadImage(productId, image)
            }
        } catch (error) {
            throw new ProductSubmitError("images", `Image save failed: ${getApiErrorMessage(error)}`)
        }
    }

    async function handleSubmit() {
        const basicErrors = validateProductForm(formState).map(message => ({
            tab: "basic" as const,
            message,
        }))
        const variantErrors = validateVariantRows(variantRows).map(message => ({
            tab: "variants" as const,
            message,
        }))
        const imageErrors: ProductFormError[] = []
        const errors = [...basicErrors, ...variantErrors, ...imageErrors]

        setFormErrors(errors)
        if (basicErrors.length > 0) {
            setActiveTab("basic")
            return
        }
        if (variantErrors.length > 0) {
            setActiveTab("variants")
            return
        }
        if (imageErrors.length > 0) {
            setActiveTab("images")
            return
        }

        const payload = toProductPayload(formState)

        try {
            setIsSaving(true)
            if (modalMode === "create") {
                const product = await productService.create(payload)
                try {
                    await persistVariants(product.id)
                    await persistImages(product.id)
                } catch (error) {
                    await productService.delete(product.id).catch(() => false)
                    throw error
                }
                toast.success("Product created successfully.")
            } else if (selectedProduct) {
                await productService.update(selectedProduct.id, payload)
                await persistVariants(selectedProduct.id)
                await persistImages(selectedProduct.id)
                toast.success("Product updated successfully.")
            }

            invalidateProducts()
            queryClient.invalidateQueries({ queryKey: categoryKeys.adminAll })
            closeForm()
        } catch (error) {
            const tab = isProductSubmitError(error) ? error.tab : "basic"
            const message = isProductSubmitError(error) ? error.message : getApiErrorMessage(error)
            setActiveTab(tab)
            setFormErrors([{ tab, message }])
            toast.error(message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="min-h-screen bg-background px-4 py-10 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                            Admin
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl">Product Management</h1>
                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            Manage product details, Size x Color variants, stock, prices, and Cloudinary images.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="h-11 w-full lg:w-auto">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <section className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={event => {
                                setSearchTerm(event.target.value)
                                setCurrentPage(1)
                            }}
                            placeholder="Search products..."
                            className="h-11 pl-10"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {filteredProducts.length} of {products.length} products
                    </div>
                </section>

                {isLoading ? (
                    <ProductTableSkeleton />
                ) : error ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
                        <p className="font-medium text-destructive">Unable to load products</p>
                        <p className="mt-1 text-sm text-muted-foreground">{getApiErrorMessage(error)}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-md border border-border">
                        <EmptyState
                            icon={<Package />}
                            title="No products found"
                            description={searchTerm ? "Try a different search term." : "Create the first product."}
                            action={
                                !searchTerm ? (
                                    <Button size="sm" onClick={openCreateModal}>
                                        <Plus className="h-4 w-4" />
                                        Add Product
                                    </Button>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-md border border-border bg-background">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] table-fixed">
                                <thead className="border-b border-border bg-secondary/70">
                                    <tr>
                                        <th className="w-[92px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Image
                                        </th>
                                        <th
                                            className="w-[28%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                            aria-sort={sortState.column === "name" ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleSort("name")}
                                                className="flex items-center gap-2 uppercase tracking-wide hover:text-foreground"
                                            >
                                                Product
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                {sortState.column === "name" && (
                                                    <span className="text-[10px] normal-case">
                                                        {sortState.direction === "asc" ? "A-Z" : "Z-A"}
                                                    </span>
                                                )}
                                            </button>
                                        </th>
                                        <th
                                            className="w-[16%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                            aria-sort={sortState.column === "category" ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleSort("category")}
                                                className="flex items-center gap-2 uppercase tracking-wide hover:text-foreground"
                                            >
                                                Category
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                {sortState.column === "category" && (
                                                    <span className="text-[10px] normal-case">
                                                        {sortState.direction === "asc" ? "A-Z" : "Z-A"}
                                                    </span>
                                                )}
                                            </button>
                                        </th>
                                        <th
                                            className="w-[16%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                            aria-sort={sortState.column === "price" ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleSort("price")}
                                                className="flex items-center gap-2 uppercase tracking-wide hover:text-foreground"
                                            >
                                                Price
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                {sortState.column === "price" && (
                                                    <span className="text-[10px] normal-case">
                                                        {sortState.direction === "asc" ? "Low-High" : "High-Low"}
                                                    </span>
                                                )}
                                            </button>
                                        </th>
                                        <th
                                            className="w-[12%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                            aria-sort={sortState.column === "stock" ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleSort("stock")}
                                                className="flex items-center gap-2 uppercase tracking-wide hover:text-foreground"
                                            >
                                                Stock
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                {sortState.column === "stock" && (
                                                    <span className="text-[10px] normal-case">
                                                        {sortState.direction === "asc" ? "Low-High" : "High-Low"}
                                                    </span>
                                                )}
                                            </button>
                                        </th>
                                        <th
                                            className="w-[12%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                            aria-sort={sortState.column === "status" ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleSort("status")}
                                                className="flex items-center gap-2 uppercase tracking-wide hover:text-foreground"
                                            >
                                                Status
                                                <ArrowUpDown className="h-3.5 w-3.5" />
                                                {sortState.column === "status" && (
                                                    <span className="text-[10px] normal-case">
                                                        {sortState.direction === "asc" ? "Inactive-Active" : "Active-Inactive"}
                                                    </span>
                                                )}
                                            </button>
                                        </th>
                                        <th className="w-[120px] px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map(product => (
                                        <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                                            <td className="px-5 py-4">
                                                <div className="h-14 w-14 overflow-hidden rounded-md bg-muted">
                                                    {getProductImage(product) ? (
                                                        <img
                                                            src={getProductImage(product) ?? ""}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                            <ImagePlus className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="truncate font-medium">{product.name}</p>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                                    {product.variants.length} variants
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-muted-foreground">
                                                {product.categoryName ?? "N/A"}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium">
                                                {getProductPrice(product)}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-muted-foreground">
                                                {getProductStock(product)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={product.status === ProductStatus.Active
                                                    ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                                                    : "rounded bg-muted px-2 py-1 text-xs font-medium text-foreground"}
                                                >
                                                    {product.status === ProductStatus.Active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(product)}
                                                        aria-label={`Edit ${product.name}`}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteTarget(product)}
                                                        aria-label={`Delete ${product.name}`}
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
                                Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
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
                                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={open => (open ? setIsFormOpen(true) : closeForm())}>
                <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{modalMode === "create" ? "Add Product" : "Edit Product"}</DialogTitle>
                        <DialogDescription>
                            Use the tabs to manage product information, variants, and images.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mb-5 grid grid-cols-3 gap-2 rounded-md bg-secondary p-1">
                        {([
                            ["basic", "Basic", Package],
                            ["variants", "Variants", Boxes],
                            ["images", "Images", ImagePlus],
                        ] as const).map(([tab, label, Icon]) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab
                                    ? "flex h-10 items-center justify-center gap-2 rounded bg-background text-sm font-medium shadow-sm"
                                    : "flex h-10 items-center justify-center gap-2 rounded text-sm text-muted-foreground hover:bg-background/60"}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {activeTabErrors.length > 0 && (
                        <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            {activeTabErrors.map(error => (
                                <p key={error.message}>{error.message}</p>
                            ))}
                        </div>
                    )}

                    {isLoadingDetail ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-32" />
                        </div>
                    ) : activeTab === "basic" ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-sm font-medium">Product Name</span>
                                <Input
                                    value={formState.name}
                                    onChange={event => setFormState({ ...formState, name: event.target.value })}
                                    maxLength={MAX_NAME_LENGTH}
                                    placeholder="Enter product name"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium">Category</span>
                                <select
                                    value={formState.categoryId}
                                    onChange={event => setFormState({ ...formState, categoryId: event.target.value })}
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium">Base Price</span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formState.basePrice}
                                    onKeyDown={preventInvalidNumberInput}
                                    onChange={event => setFormState({
                                        ...formState,
                                        basePrice: toNonNegativeNumberDraft(event.target.value),
                                    })}
                                    placeholder="0"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium">Status</span>
                                <select
                                    value={String(formState.status)}
                                    onChange={event =>
                                        setFormState({ ...formState, status: Number(event.target.value) as ProductStatus })
                                    }
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value={ProductStatus.Active}>Active</option>
                                    <option value={ProductStatus.Inactive}>Inactive</option>
                                </select>
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-sm font-medium">Material</span>
                                <Input
                                    value={formState.material}
                                    onChange={event => setFormState({ ...formState, material: event.target.value })}
                                    maxLength={MAX_MATERIAL_LENGTH}
                                    placeholder="Cotton, leather, wool..."
                                />
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="text-sm font-medium">Description</span>
                                <textarea
                                    value={formState.description}
                                    onChange={event => setFormState({ ...formState, description: event.target.value })}
                                    placeholder="Product description"
                                    className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                            </label>
                        </div>
                    ) : activeTab === "variants" ? (
                        <div className="space-y-4">
                            <div className="flex justify-between gap-3">
                                <div>
                                    <p className="font-medium">Size x Color Variants</p>
                                    <p className="text-sm text-muted-foreground">
                                        Configure SKU, color, size, stock, threshold, and variant price.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" onClick={() => setVariantRows(rows => [...rows, createEmptyVariantRow()])}>
                                    <Plus className="h-4 w-4" />
                                    Add Variant
                                </Button>
                            </div>

                            {variantRows.length === 0 ? (
                                <div className="rounded-md border border-border">
                                    <EmptyState
                                        icon={<Boxes />}
                                        title="No variants"
                                        description="Add at least one variant if this product has stock by size and color."
                                        action={
                                            <Button size="sm" onClick={() => setVariantRows([createEmptyVariantRow()])}>
                                                <Plus className="h-4 w-4" />
                                                Add Variant
                                            </Button>
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-md border border-border">
                                    <table className="w-full min-w-[900px] table-fixed">
                                        <thead className="border-b border-border bg-secondary/70">
                                            <tr>
                                                <th className="w-[20%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">SKU</th>
                                                <th className="w-[16%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">Color</th>
                                                <th className="w-[12%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">Size</th>
                                                <th className="w-[14%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">Stock</th>
                                                <th className="w-[16%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">Low Stock</th>
                                                <th className="w-[16%] px-3 py-2 text-left text-xs uppercase text-muted-foreground">Price</th>
                                                <th className="w-[72px] px-3 py-2 text-right text-xs uppercase text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variantRows.map(row => (
                                                <tr key={row.localId} className="border-b border-border last:border-0">
                                                    <td className="p-2">
                                                        <Input value={row.sku} onChange={event => updateVariantRow(row.localId, { sku: event.target.value })} />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input value={row.color} onChange={event => updateVariantRow(row.localId, { color: event.target.value })} />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input value={row.size} onChange={event => updateVariantRow(row.localId, { size: event.target.value })} />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={row.stock}
                                                            onKeyDown={preventInvalidNumberInput}
                                                            onChange={event => updateVariantRow(row.localId, {
                                                                stock: toNonNegativeNumberDraft(event.target.value),
                                                            })}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={row.lowStockThreshold}
                                                            onKeyDown={preventInvalidNumberInput}
                                                            onChange={event => updateVariantRow(row.localId, {
                                                                lowStockThreshold: toNonNegativeNumberDraft(event.target.value),
                                                            })}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={row.price}
                                                            onKeyDown={preventInvalidNumberInput}
                                                            onChange={event => updateVariantRow(row.localId, {
                                                                price: toNonNegativeNumberDraft(event.target.value),
                                                            })}
                                                        />
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeVariantRow(row)}
                                                            className="text-destructive hover:text-destructive"
                                                            disabled={deleteVariantMutation.isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <p className="font-medium">Product Images</p>
                                <p className="text-sm text-muted-foreground">
                                    Images are uploaded through the backend Cloudinary integration when the product is saved.
                                </p>
                            </div>

                            {imageLoadWarning && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                    {imageLoadWarning}
                                </div>
                            )}

                            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 p-6 text-center hover:bg-secondary/50">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">Choose product images</span>
                                <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to backend limits</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="sr-only"
                                    onChange={event => {
                                        handleImageInput(event.target.files)
                                        event.target.value = ""
                                    }}
                                />
                            </label>

                            {(existingImages.length > 0 || pendingImages.length > 0) && (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {existingImages.map(image => (
                                        <div key={image.id} className="overflow-hidden rounded-md border border-border">
                                            <div className="aspect-[4/3] bg-muted">
                                                <img src={image.imageUrl} alt="Product" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex items-center justify-between gap-3 p-3">
                                                <p className="truncate text-xs text-muted-foreground">{image.id}</p>
                                                <Button
                                                    type="button"
                                                    size="icon-sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => selectedProduct && deleteImageMutation.mutate({
                                                        productId: selectedProduct.id,
                                                        imageId: image.id,
                                                    })}
                                                    disabled={deleteImageMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {pendingImages.map((image, index) => (
                                        <div key={`${image.name}-${index}`} className="overflow-hidden rounded-md border border-border">
                                            <div className="aspect-[4/3] bg-muted">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={image.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between gap-3 p-3">
                                                <p className="truncate text-xs text-muted-foreground">{image.name}</p>
                                                <Button
                                                    type="button"
                                                    size="icon-sm"
                                                    variant="ghost"
                                                    onClick={() => setPendingImages(images => images.filter((_, itemIndex) => itemIndex !== index))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={closeForm}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSaving || isLoadingDetail}>
                            {isSaving ? "Saving..." : modalMode === "create" ? "Create Product" : "Save Product"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(deleteTarget)} onOpenChange={open => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            This will call the backend delete API. Deleted products are soft-deleted by the backend.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>Confirm deletion of &quot;{deleteTarget?.name}&quot;.</p>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleteProductMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => deleteTarget && deleteProductMutation.mutate(deleteTarget.id)}
                            disabled={deleteProductMutation.isPending}
                        >
                            {deleteProductMutation.isPending ? "Deleting..." : "Delete Product"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}
