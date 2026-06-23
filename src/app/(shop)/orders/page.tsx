"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Calendar, CreditCard, Package, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"
import { Spinner } from "@/components/ui/Spinner"
import { Badge } from "@/components/ui/Badge"
import { useCancelOrder, useOrdersList } from "@/hooks/useOrders"
import { ROUTES } from "@/constants/routes"
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, OrderStatus } from "@/constants/enums"
import type { ApiError } from "@/types/api"
import { formatPrice } from "@/utils/formatPrice"
import { formatDate } from "@/utils/formatDate"

const PAGE_SIZE = 5

const ORDER_STATUSES = [
    OrderStatus.Pending,
    OrderStatus.Confirmed,
    OrderStatus.Processing,
    OrderStatus.Shipping,
    OrderStatus.Delivered,
    OrderStatus.Completed,
    OrderStatus.Cancelled,
    OrderStatus.Returned,
] as const

function getPageParam(value: string | null) {
    const page = Number(value)
    return Number.isInteger(page) && page > 0 ? page : 1
}

function getStatusParam(value: string | null): number | undefined {
    if (value === null || value === "") return undefined
    const status = Number(value)
    return ORDER_STATUSES.includes(status as OrderStatus) ? status : undefined
}

function OrderHistoryContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = getPageParam(searchParams.get("page"))
    const selectedStatus = getStatusParam(searchParams.get("status"))
    const { data, isLoading, error, refetch } = useOrdersList({
        page: currentPage,
        pageSize: PAGE_SIZE,
        status: selectedStatus,
    })
    const cancelOrderMutation = useCancelOrder()
    const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return

        setCancelingOrderId(orderId)
        try {
            await cancelOrderMutation.mutateAsync(orderId)
            toast.success("Order has been canceled successfully.")
        } catch (err) {
            const apiError = err as ApiError
            toast.error(apiError.message ?? "Unable to cancel order. Please try again.")
        } finally {
            setCancelingOrderId(null)
        }
    }

    function updateParams(next: { page?: number; status?: number | null }) {
        const params = new URLSearchParams(searchParams.toString())

        if (next.page !== undefined) {
            if (next.page <= 1) params.delete("page")
            else params.set("page", String(next.page))
        }

        if (next.status !== undefined) {
            if (next.status === null) params.delete("status")
            else params.set("status", String(next.status))
        }

        const query = params.toString()
        router.push(query ? `${ROUTES.ORDERS.INDEX}?${query}` : ROUTES.ORDERS.INDEX)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl">
                <div className="mb-8">
                    <Skeleton className="h-12 w-48 rounded-none mb-2" />
                    <Skeleton className="h-4 w-32 rounded-none" />
                </div>
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="border border-border p-6 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-32 rounded-none" />
                                <Skeleton className="h-6 w-20 rounded-none" />
                            </div>
                            <Skeleton className="h-4 w-48 rounded-none" />
                            <Skeleton className="h-10 w-full rounded-none" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8 max-w-md text-center">
                <div className="border border-destructive/20 bg-destructive/5 p-8 space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h3 className="font-serif text-2xl text-destructive">Failed to Load Orders</h3>
                    <p className="text-sm text-muted-foreground">
                        {((error as unknown) as ApiError)?.message ?? "An error occurred while fetching your order history."}
                    </p>
                    <Button onClick={() => refetch()} className="rounded-none w-full">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    const orders = data?.items ?? []
    const totalPages = data?.totalPages ?? 1

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8">
                <EmptyState
                    icon={<Package className="h-10 w-10 text-muted-foreground opacity-40" />}
                    title="No orders yet"
                    description="You have not placed any orders yet. Visit our shop to find beautiful garments."
                    action={
                        <Button asChild className="rounded-none">
                            <Link href={ROUTES.SHOP.PRODUCTS}>Shop Our Products</Link>
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl">
            <div className="mb-8 border-b border-border pb-4">
                <h1 className="font-serif text-4xl md:text-5xl">My Orders</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Review your order history, delivery status, and tracking information.
                </p>
            </div>

            {/* Status filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant={selectedStatus === undefined ? "default" : "outline"}
                    onClick={() => updateParams({ status: null, page: 1 })}
                    className={selectedStatus !== undefined ? "bg-transparent" : ""}
                >
                    All
                </Button>
                {ORDER_STATUSES.map(status => (
                    <Button
                        key={status}
                        type="button"
                        variant={selectedStatus === status ? "default" : "outline"}
                        onClick={() => updateParams({ status, page: 1 })}
                        className={selectedStatus !== status ? "bg-transparent" : ""}
                    >
                        {ORDER_STATUS_LABEL[status]}
                    </Button>
                ))}
            </div>

            <div className="space-y-6">
                {orders.map((order) => {
                    const isPendingOrConfirmed =
                        order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed
                    const isCanceling = cancelingOrderId === order.id

                    return (
                        <div key={order.id} className="border border-border p-6 bg-card space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border pb-4">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Order Code</span>
                                    <h3 className="font-serif text-xl font-medium">#{order.orderCode}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className={`${ORDER_STATUS_COLOR[order.status]} border-none rounded-none px-3 py-1 font-medium text-xs`}>
                                        {ORDER_STATUS_LABEL[order.status]}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground py-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span>Placed on {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 shrink-0" />
                                    <span>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground mr-1">Total:</span>
                                    <span className="font-serif font-bold text-foreground text-base">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs border-t border-border pt-4 text-muted-foreground">
                                {order.items.length} item{order.items.length === 1 ? "" : "s"} in this order.
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                {isPendingOrConfirmed && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isCanceling}
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="rounded-none text-destructive border-destructive/20 hover:bg-destructive/5"
                                    >
                                        {isCanceling ? (
                                            <>
                                                <Spinner size="sm" className="mr-1 text-destructive" />
                                                Canceling...
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Cancel Order
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button asChild size="sm" className="rounded-none">
                                    <Link href={ROUTES.ORDERS.DETAIL(order.id)}>View Details</Link>
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                    <Button
                        variant="outline"
                        onClick={() => updateParams({ page: Math.max(1, currentPage - 1) })}
                        disabled={currentPage <= 1}
                        className="rounded-none"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => updateParams({ page: Math.min(totalPages, currentPage + 1) })}
                        disabled={currentPage >= totalPages}
                        className="rounded-none"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default function OrderHistoryPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl">Loading...</div>}>
            <OrderHistoryContent />
        </Suspense>
    )
}
