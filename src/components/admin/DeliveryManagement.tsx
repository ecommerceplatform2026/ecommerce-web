"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Plus, RefreshCcw, Search, Truck } from "lucide-react"
import { Toast } from '@/components/ui/Toast'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Skeleton } from '@/components/ui/Skeleton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Modal'
import { DELIVERY_STATUS_COLOR, DELIVERY_STATUS_LABEL, DeliveryStatus } from '@/constants/enums'
import { deliveryService } from '@/services/deliveryService'
import { formatDate } from '@/utils/formatDate'
import type { DeliveryListFilters, DeliveryListItem } from '@/types/delivery'

const PAGE_SIZE = 10

function normalizeStatus(value: unknown): DeliveryStatus | null {
    if (value === null || value === undefined || value === "") return null

    if (typeof value === "number") {
        return value in DeliveryStatus ? (value as DeliveryStatus) : null
    }

    if (typeof value === "string") {
        const trimmed = value.trim()
        if (!trimmed) return null

        const asNumber = Number(trimmed)
        if (!Number.isNaN(asNumber) && asNumber in DeliveryStatus) {
            return asNumber as DeliveryStatus
        }

        const upper = trimmed.toUpperCase()
        if (upper === "PENDING") return DeliveryStatus.Pending
        if (upper === "CREATED") return DeliveryStatus.Created
        if (upper === "PICKEDUP") return DeliveryStatus.PickedUp
        if (upper === "INTRANSIT") return DeliveryStatus.InTransit
        if (upper === "OUTFORDELIVERY") return DeliveryStatus.OutForDelivery
        if (upper === "DELIVERED") return DeliveryStatus.Delivered
        if (upper === "FAILED") return DeliveryStatus.Failed
        if (upper === "CANCELLED") return DeliveryStatus.Cancelled
        if (upper === "RETURNED") return DeliveryStatus.Returned
        if (upper === "EXCEPTION") return DeliveryStatus.Exception
    }

    return null
}

function getStatusLabel(value: unknown): string {
    const normalized = normalizeStatus(value)
    if (normalized !== null) {
        return DELIVERY_STATUS_LABEL[normalized] ?? "Unknown"
    }

    return typeof value === "string" ? value : "Unknown"
}

function getStatusBadgeClass(value: unknown): string {
    const normalized = normalizeStatus(value)
    if (normalized !== null) {
        return DELIVERY_STATUS_COLOR[normalized] ?? "bg-secondary text-secondary-foreground"
    }

    return "bg-secondary text-secondary-foreground"
}

export function DeliveryManagement() {
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("")
    const [orderIdFilter, setOrderIdFilter] = useState("")
    const [startDateFilter, setStartDateFilter] = useState("")
    const [endDateFilter, setEndDateFilter] = useState("")
    const [retryTarget, setRetryTarget] = useState<DeliveryListItem | null>(null)
    const [isRetrying, setIsRetrying] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newOrderId, setNewOrderId] = useState("")
    const [newCarrier, setNewCarrier] = useState("GHN")

    const queryFilters = useMemo<DeliveryListFilters>(() => ({
        page,
        pageSize: PAGE_SIZE,
        status: statusFilter || undefined,
        orderId: orderIdFilter.trim() || undefined,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
    }), [endDateFilter, orderIdFilter, page, startDateFilter, statusFilter])

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["deliveries", queryFilters],
        queryFn: () => deliveryService.getDeliveries(queryFilters),
        refetchInterval: 15000,
    })

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setPage(1)
    }

    const handleOrderIdChange = (value: string) => {
        setOrderIdFilter(value)
        setPage(1)
    }

    const handleDateChange = (field: "startDate" | "endDate", value: string) => {
        if (field === "startDate") {
            setStartDateFilter(value)
        } else {
            setEndDateFilter(value)
        }
        setPage(1)
    }

    const handleRetry = async (id: string) => {
        setIsRetrying(true)

        try {
            await deliveryService.retryDelivery(id)
            Toast("Delivery retry requested.")
            setRetryTarget(null)
            await refetch()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to retry delivery at the moment."
            Toast(message, "error")
        } finally {
            setIsRetrying(false)
        }
    }

    const handleCreateDelivery = async () => {
        const orderId = newOrderId.trim()
        if (!orderId) {
            Toast("Order ID is required.", "error")
            return
        }

        setIsCreating(true)

        try {
            await deliveryService.createDelivery({
                orderId,
                carrier: newCarrier.trim() || "GHN",
            })
            Toast("Delivery created successfully.")
            setIsCreateOpen(false)
            setNewOrderId("")
            setNewCarrier("GHN")
            await refetch()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to create delivery at the moment."
            Toast(message, "error")
        } finally {
            setIsCreating(false)
        }
    }

    const totalPages = data?.totalPages ?? 1
    const currentPage = data?.page ?? 1
    const items = data?.items ?? []

    return (
        <main className="min-h-screen bg-background px-4 py-10 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Admin / Operations
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl">Delivery Management</h1>
                        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                            Monitor fulfillment activity, filter by shipment status, and retry exception shipments when needed.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                        <Button onClick={() => setIsCreateOpen(true)} className="h-11 w-full rounded-none lg:w-auto">
                            <Plus className="h-4 w-4" />
                            Create Delivery
                        </Button>
                        <Button variant="outline" onClick={() => refetch()} className="h-11 w-full rounded-none lg:w-auto">
                            <RefreshCcw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <section className="mb-6 grid gap-4 border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                        <Label htmlFor="delivery-status" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Status
                        </Label>
                        <select
                            id="delivery-status"
                            value={statusFilter}
                            onChange={(event) => handleStatusChange(event.target.value)}
                            className="h-10 w-full border border-input bg-background px-3 text-sm outline-none"
                        >
                            <option value="">All statuses</option>
                            <option value="0">Pending</option>
                            <option value="1">Created</option>
                            <option value="2">Picked up</option>
                            <option value="3">In transit</option>
                            <option value="4">Out for delivery</option>
                            <option value="5">Delivered</option>
                            <option value="6">Failed</option>
                            <option value="7">Cancelled</option>
                            <option value="8">Returned</option>
                            <option value="9">Exception</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="delivery-order" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Order ID
                        </Label>
                        <Input
                            id="delivery-order"
                            value={orderIdFilter}
                            onChange={(event) => handleOrderIdChange(event.target.value)}
                            placeholder="Search by order"
                            className="h-10 rounded-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="delivery-start" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Start Date
                        </Label>
                        <Input
                            id="delivery-start"
                            type="date"
                            value={startDateFilter}
                            onChange={(event) => handleDateChange("startDate", event.target.value)}
                            className="h-10 rounded-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="delivery-end" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            End Date
                        </Label>
                        <Input
                            id="delivery-end"
                            type="date"
                            value={endDateFilter}
                            onChange={(event) => handleDateChange("endDate", event.target.value)}
                            className="h-10 rounded-none"
                        />
                    </div>
                </section>

                <section className="rounded-none border border-border bg-background">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Search className="h-4 w-4" />
                            <span>{data?.totalCount ?? 0} shipments found</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3 p-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="grid grid-cols-[1.2fr_1fr_1fr_120px] gap-4">
                                    <Skeleton className="h-10" />
                                    <Skeleton className="h-10" />
                                    <Skeleton className="h-10" />
                                    <Skeleton className="h-10" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="border border-destructive/30 bg-destructive/5 p-6">
                            <p className="font-medium text-destructive">Unable to load deliveries</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {error instanceof Error ? error.message : "Please check the backend connection and try again."}
                            </p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="border border-border">
                            <EmptyState
                                icon={<Truck />}
                                title="No deliveries found"
                                description="Try a different filter combination to explore shipment history."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-secondary/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium uppercase tracking-[0.2em] text-muted-foreground">Order</th>
                                        <th className="px-4 py-3 text-left font-medium uppercase tracking-[0.2em] text-muted-foreground">Carrier</th>
                                        <th className="px-4 py-3 text-left font-medium uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left font-medium uppercase tracking-[0.2em] text-muted-foreground">Updated</th>
                                        <th className="px-4 py-3 text-left font-medium uppercase tracking-[0.2em] text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {items.map((item) => {
                                        const status = getStatusLabel(item.status)
                                        const badgeClass = getStatusBadgeClass(item.status)
                                        const isRetryable = normalizeStatus(item.status) === DeliveryStatus.Exception

                                        return (
                                            <tr key={item.id} className="align-top">
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-foreground">
                                                        {item.orderCode ?? item.orderId ?? "—"}
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {item.id}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {item.carrier ?? "—"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge className={`border-none rounded-none px-2.5 py-1 ${badgeClass}`}>
                                                        {status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    <div>{item.updatedAt ? formatDate(item.updatedAt) : "—"}</div>
                                                    <div className="mt-1 text-xs">{item.createdAt ? formatDate(item.createdAt) : "—"}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {isRetryable ? (
                                                        <Button size="sm" variant="outline" className="rounded-none bg-transparent" onClick={() => setRetryTarget(item)}>
                                                            Retry
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {!isLoading && !error && items.length > 0 && (
                    <div className="mt-6 flex items-center justify-between border border-border bg-card px-4 py-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage <= 1}
                            className="rounded-none bg-transparent"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Showing page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage >= totalPages}
                            className="rounded-none bg-transparent"
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                setIsCreateOpen(open)
                if (!open) {
                    setNewOrderId("")
                    setNewCarrier("GHN")
                }
            }}>
                <DialogContent className="max-w-md rounded-none">
                    <DialogHeader>
                        <DialogTitle>Create delivery</DialogTitle>
                        <DialogDescription>
                            Submit a new shipment request using the order ID and carrier. The carrier defaults to GHN when left blank.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-order-id">Order ID</Label>
                            <Input
                                id="new-order-id"
                                value={newOrderId}
                                onChange={(event) => setNewOrderId(event.target.value)}
                                placeholder="Enter order ID"
                                className="h-10 rounded-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-carrier">Carrier</Label>
                            <Input
                                id="new-carrier"
                                value={newCarrier}
                                onChange={(event) => setNewCarrier(event.target.value)}
                                placeholder="GHN"
                                className="h-10 rounded-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" className="rounded-none bg-transparent" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="rounded-none" disabled={isCreating} onClick={handleCreateDelivery}>
                            {isCreating ? "Creating..." : "Create shipment"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(retryTarget)} onOpenChange={(open) => !open && setRetryTarget(null)}>
                <DialogContent className="max-w-md rounded-none">
                    <DialogHeader>
                        <DialogTitle>Retry delivery</DialogTitle>
                        <DialogDescription>
                            This will send a retry request for shipment {retryTarget?.id ?? ""}. Continue?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 flex justify-end gap-3">
                        <Button variant="outline" className="rounded-none bg-transparent" onClick={() => setRetryTarget(null)}>
                            Cancel
                        </Button>
                        <Button className="rounded-none" disabled={isRetrying} onClick={() => retryTarget && handleRetry(retryTarget.id)}>
                            {isRetrying ? "Retrying..." : "Confirm retry"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}
