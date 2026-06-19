"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, CreditCard, PackageSearch, ReceiptText, WalletCards } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
    OrderStatusBadge,
    formatCurrency,
    formatOrderDate,
    getOrderProgressValue,
    getOrderStatusTone,
    getPaymentLabel,
} from "@/components/order/orderDisplay"
import { ORDER_STATUS_LABEL, OrderStatus } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"
import { useOrders } from "@/hooks/useOrders"

const PAGE_SIZE = 6
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

function getStatusParam(value: string | null): OrderStatus | undefined {
    if (value === null || value === "") return undefined

    const status = Number(value)
    return ORDER_STATUSES.includes(status as OrderStatus)
        ? status as OrderStatus
        : undefined
}

export default function OrdersPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = getPageParam(searchParams.get("page"))
    const selectedStatus = getStatusParam(searchParams.get("status"))
    const { data, isLoading, error } = useOrders({
        page: currentPage,
        pageSize: PAGE_SIZE,
        status: selectedStatus,
    })

    const orders = data?.items ?? []
    const totalPages = Math.max(1, data?.totalPages ?? 1)
    const safePage = Math.min(currentPage, totalPages)
    const visibleTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const visibleItems = orders.reduce((sum, order) => sum + order.items.length, 0)

    function updateParams(next: { page?: number; status?: OrderStatus | null }) {
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

    return (
        <main className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <div className="mb-8 grid gap-6 border-b border-border pb-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                        <ReceiptText className="h-3.5 w-3.5" />
                        Order history
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl">Orders</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Review your orders, payment methods, totals, and current status.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-md border border-border bg-secondary/60 p-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Results</p>
                        <p className="mt-2 text-2xl font-medium">{data?.totalCount ?? 0}</p>
                    </div>
                    <div className="rounded-md border border-border p-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Visible total</p>
                        <p className="mt-2 text-lg font-medium">{formatCurrency(visibleTotal)}</p>
                    </div>
                    <div className="rounded-md border border-border p-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Visible items</p>
                        <p className="mt-2 text-2xl font-medium">{visibleItems}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-3 rounded-md border border-border bg-background p-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={selectedStatus === undefined ? "default" : "outline"}
                        onClick={() => updateParams({ status: null, page: 1 })}
                    >
                        All
                    </Button>
                    {ORDER_STATUSES.map(status => (
                        <Button
                            key={status}
                            type="button"
                            variant={selectedStatus === status ? "default" : "outline"}
                            onClick={() => updateParams({ status, page: 1 })}
                            className={selectedStatus === status ? undefined : "bg-transparent"}
                        >
                            {ORDER_STATUS_LABEL[status]}
                        </Button>
                    ))}
                </div>
                <Button asChild variant="outline" className="bg-transparent">
                    <Link href={ROUTES.SHOP.PRODUCTS}>Continue shopping</Link>
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-36 animate-pulse rounded-md bg-secondary" />
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    Unable to load orders. Please try again.
                </div>
            )}

            {!isLoading && !error && orders.length === 0 && (
                <div className="mx-auto max-w-2xl space-y-5 py-16 text-center">
                    <PackageSearch className="mx-auto h-14 w-14 text-muted-foreground opacity-50" />
                    <h2 className="font-serif text-3xl">No orders found</h2>
                    <p className="text-muted-foreground">
                        {selectedStatus === undefined
                            ? "Orders placed through checkout will appear here."
                            : "No orders match the selected status."}
                    </p>
                    <Button asChild>
                        <Link href={ROUTES.SHOP.PRODUCTS}>Shop products</Link>
                    </Button>
                </div>
            )}

            {!isLoading && !error && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map(order => (
                        <Link
                            key={order.id}
                            href={ROUTES.ORDERS.DETAIL(order.id)}
                            className={`grid gap-5 rounded-md border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[minmax(0,1fr)_220px] ${getOrderStatusTone(order.status)}`}
                        >
                            <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
                                        <ReceiptText className="h-5 w-5 text-muted-foreground" />
                                    </span>
                                    <h2 className="font-serif text-2xl">Order #{order.orderCode}</h2>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                                    <span>{formatOrderDate(order.createdAt)}</span>
                                    <span className="inline-flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        {getPaymentLabel(order.paymentMethod)}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <WalletCards className="h-4 w-4" />
                                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-background/70">
                                    <div
                                        className="h-full rounded-full bg-foreground transition-all"
                                        style={{ width: `${getOrderProgressValue(order.status)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 rounded-md bg-background/80 p-4 md:flex-col md:items-end md:justify-center">
                                <span className="text-xl font-medium">{formatCurrency(order.totalAmount)}</span>
                                <span className="text-sm text-muted-foreground">View details</span>
                            </div>
                        </Link>
                    ))}

                    <div className="flex items-center justify-center gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateParams({ page: Math.max(1, safePage - 1) })}
                            disabled={safePage <= 1}
                            className="bg-transparent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="min-w-28 text-center text-sm text-muted-foreground">
                            Page {safePage} / {totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateParams({ page: Math.min(totalPages, safePage + 1) })}
                            disabled={safePage >= totalPages}
                            className="bg-transparent"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
