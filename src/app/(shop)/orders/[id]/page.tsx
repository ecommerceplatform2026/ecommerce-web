"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, CreditCard, PackageSearch, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
    ORDER_STATUS_STEPS,
    OrderStatusBadge,
    formatCurrency,
    formatOrderDate,
    getOrderProgressValue,
    getOrderStatusTone,
    getPaymentLabel,
    getSnapshotSku,
    parseProductSnapshot,
} from "@/components/order/orderDisplay"
import { ORDER_STATUS_LABEL, OrderStatus } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"
import { useOrder } from "@/hooks/useOrders"

function getParamId(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value ?? ""
}

export default function OrderDetailPage() {
    const params = useParams()
    const orderId = getParamId(params.id)
    const { data: order, isLoading, error } = useOrder(orderId)

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
                <div className="mb-8 h-10 w-40 animate-pulse rounded-md bg-secondary" />
                <div className="space-y-4">
                    <div className="h-40 animate-pulse rounded-md bg-secondary" />
                    <div className="h-64 animate-pulse rounded-md bg-secondary" />
                </div>
            </main>
        )
    }

    if (error || !order) {
        return (
            <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-5 text-center">
                    <PackageSearch className="mx-auto h-14 w-14 text-muted-foreground opacity-50" />
                    <h1 className="font-serif text-4xl md:text-5xl">Order not found</h1>
                    <p className="text-muted-foreground">
                        The order could not be found in your order history.
                    </p>
                    <Button asChild>
                        <Link href={ROUTES.ORDERS.INDEX}>Back to orders</Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <div className="mb-8">
                <Button asChild variant="ghost" className="mb-6 px-0 hover:bg-transparent">
                    <Link href={ROUTES.ORDERS.INDEX}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to orders
                    </Link>
                </Button>

                <div className={`rounded-md border p-6 ${getOrderStatusTone(order.status)}`}>
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Order detail</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                                    <ReceiptText className="h-6 w-6 text-muted-foreground" />
                                </span>
                                <h1 className="font-serif text-4xl md:text-5xl">Order #{order.orderCode}</h1>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Placed on {formatOrderDate(order.createdAt)}
                            </p>
                        </div>

                        <div className="grid gap-3 rounded-md bg-background/80 p-4 text-left md:min-w-64">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total amount</p>
                                <p className="mt-1 text-3xl font-medium">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                {getPaymentLabel(order.paymentMethod)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                            <span>Progress</span>
                            <span>{getOrderProgressValue(order.status)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-background/70">
                            <div
                                className="h-full rounded-full bg-foreground transition-all"
                                style={{ width: `${getOrderProgressValue(order.status)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="font-serif text-2xl">Items</h2>
                        <span className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length === 1 ? "" : "s"}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {order.items.map(item => {
                            const snapshot = parseProductSnapshot(item.productSnapshot)
                            const sku = getSnapshotSku(snapshot)
                            const productName = snapshot.ProductName ?? "Product"
                            const productId = snapshot.ProductId

                            return (
                                <div
                                    key={item.id}
                                    className="grid gap-4 rounded-md border border-border bg-background p-5 transition-colors hover:border-muted-foreground sm:grid-cols-[minmax(0,1fr)_160px]"
                                >
                                    <div className="min-w-0">
                                        <div className="mb-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                                            Quantity {item.quantity}
                                        </div>
                                        {productId ? (
                                            <Link
                                                href={ROUTES.SHOP.PRODUCT_DETAIL(productId)}
                                                className="font-serif text-xl transition-colors hover:text-muted-foreground"
                                            >
                                                {productName}
                                            </Link>
                                        ) : (
                                            <p className="font-serif text-xl">{productName}</p>
                                        )}
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            {snapshot.Size && <span>Size: {snapshot.Size}</span>}
                                            {snapshot.Color && <span>Color: {snapshot.Color}</span>}
                                            {sku && <span>SKU: {sku}</span>}
                                            {snapshot.Material && <span>Material: {snapshot.Material}</span>}
                                        </div>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Variant ID: {item.productVariantId}
                                        </p>
                                    </div>
                                    <div className="rounded-md bg-secondary p-4 text-left sm:text-right">
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(item.price)} x {item.quantity}
                                        </p>
                                        <p className="mt-1 text-lg font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                    <section className="space-y-4 rounded-md border border-border p-5">
                        <h2 className="font-serif text-2xl">Order summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="max-w-[180px] truncate font-medium">{order.id}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Order code</span>
                                <span className="font-medium">{order.orderCode}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Payment</span>
                                <span className="font-medium">{getPaymentLabel(order.paymentMethod)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Status</span>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex justify-between gap-4 border-t border-border pt-4 text-base">
                                <span className="font-medium">Total</span>
                                <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 rounded-md border border-border p-5">
                        <h2 className="font-serif text-2xl">Status flow</h2>
                        <div className="space-y-3">
                            {ORDER_STATUS_STEPS.map((status, index) => {
                                const activeIndex = ORDER_STATUS_STEPS.indexOf(order.status as (typeof ORDER_STATUS_STEPS)[number])
                                const isComplete = order.status === OrderStatus.Cancelled || order.status === OrderStatus.Returned
                                    ? false
                                    : activeIndex >= index

                                return (
                                    <div key={status} className="flex items-center gap-3 text-sm">
                                        <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                                            isComplete
                                                ? "border-foreground bg-foreground text-background"
                                                : "border-border text-muted-foreground"
                                        }`}>
                                            {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                                        </span>
                                        <span className={isComplete ? "font-medium" : "text-muted-foreground"}>
                                            {ORDER_STATUS_LABEL[status]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    )
}
