"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle, ArrowLeft, Award, CreditCard, Package, RotateCcw, XCircle } from "lucide-react"
import { getProductImage } from "@/utils/imageHelpers"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Spinner } from "@/components/ui/Spinner"
import { Badge } from "@/components/ui/Badge"
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, OrderStatus } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"
import { useCancelOrder, useOrderDetail } from "@/hooks/useOrders"
import { pointsKeys } from "@/hooks/usePoints"
import { formatPrice } from "@/utils/formatPrice"
import { formatDateTime } from "@/utils/formatDate"
import type { ApiError } from "@/types/api"

interface ParsedSnapshot {
    name: string
    size?: string
    color?: string
    imageUrl?: string
}

function parseProductSnapshot(snapshot: string): ParsedSnapshot {
    try {
        const parsed = JSON.parse(snapshot)
        return {
            name: parsed.Name || parsed.name || "Product",
            size: parsed.Size || parsed.size,
            color: parsed.Color || parsed.color,
            imageUrl: parsed.ImageUrl || parsed.imageUrl || parsed.ProductImageUrl || parsed.productImageUrl,
        }
    } catch {
        return { name: snapshot || "Product" }
    }
}

export default function OrderDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { data: order, isLoading, error: orderError, refetch } = useOrderDetail(id)
    const cancelOrderMutation = useCancelOrder()
    const [isCanceling, setIsCanceling] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (order?.status === OrderStatus.Returned) {
            queryClient.invalidateQueries({ queryKey: pointsKeys.all })
        }
    }, [order?.status, queryClient])

    const handleCancelOrder = async () => {
        if (!order) return
        if (!confirm("Are you sure you want to cancel this order?")) return

        setIsCanceling(true)
        try {
            await cancelOrderMutation.mutateAsync(order.id)
            toast.success("Order has been canceled successfully.")
        } catch (err) {
            const apiError = err as ApiError
            toast.error(apiError.message ?? "Unable to cancel order. Please try again.")
        } finally {
            setIsCanceling(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl space-y-8">
                <Skeleton className="h-6 w-32 rounded-none" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48 rounded-none" />
                    <Skeleton className="h-8 w-24 rounded-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-32 rounded-none" />
                    <Skeleton className="h-32 rounded-none" />
                </div>
                <Skeleton className="h-60 rounded-none w-full" />
            </div>
        )
    }

    if (orderError || !order) {
        return (
            <div className="container mx-auto px-4 py-24 lg:px-8 max-w-md text-center">
                <div className="border border-destructive/20 bg-destructive/5 p-8 space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h3 className="font-serif text-2xl text-destructive font-semibold">Order Not Found</h3>
                    <p className="text-sm text-muted-foreground">
                        {((orderError as unknown) as ApiError)?.message ?? "The requested order could not be retrieved or does not exist."}
                    </p>
                    <div className="space-y-2">
                        <Button onClick={() => refetch()} className="rounded-none w-full">
                            Retry
                        </Button>
                        <Button asChild variant="outline" className="rounded-none w-full bg-transparent">
                            <Link href={ROUTES.ORDERS.INDEX}>Back to Orders</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const isPendingOrConfirmed =
        order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed

    const itemsSubtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const earnedPoints = Math.floor(order.totalAmount / 10000)

    return (
        <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl space-y-8">
            {/* Back Navigation */}
            <div>
                <Link
                    href={ROUTES.ORDERS.INDEX}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Orders
                </Link>
            </div>

            {/* Order Title Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl tracking-tight">Order #{order.orderCode}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDateTime(order.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`${ORDER_STATUS_COLOR[order.status]} border-none rounded-none px-4 py-1.5 font-medium text-sm`}>
                        {ORDER_STATUS_LABEL[order.status]}
                    </Badge>
                </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Info */}
                <div className="border border-border p-5 bg-card space-y-2">
                    <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                    </h3>
                    <div className="text-sm">
                        <p className="font-medium">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Status: <span className="font-semibold text-foreground">
                                {order.status === OrderStatus.Pending ? "Unpaid" : "Processed"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Delivery Tracking */}
                <div className="border border-border p-5 bg-card space-y-2">
                    <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        Tracking Details
                    </h3>
                    <div className="text-sm">
                        {order.tracking ? (
                            <div className="space-y-1">
                                <p className="font-medium text-xs">Carrier: {order.tracking.carrierCode}</p>
                                <p className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 inline-block select-all">
                                    {order.tracking.trackingCode}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">
                                Tracking information will be updated once shipped.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="border border-border bg-card">
                <div className="p-5 border-b border-border">
                    <h2 className="font-serif text-xl">Order Items</h2>
                </div>
                <div className="divide-y divide-border">
                    {order.items.map((item) => {
                        const info = parseProductSnapshot(item.productSnapshot)
                        return (
                            <div key={item.id} className="p-5 flex gap-4 items-start sm:items-center">
                                <div className="relative aspect-[3/4] w-16 bg-secondary overflow-hidden shrink-0">
                                    <Image
                                        src={getProductImage(info.imageUrl)}
                                        alt={info.name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-serif font-medium text-base text-balance leading-snug">
                                            {info.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {[info.size ? `Size: ${info.size}` : null, info.color ? `Color: ${info.color}` : null]
                                                .filter(Boolean)
                                                .join(" / ")}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center sm:justify-end sm:gap-10 text-sm">
                                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                                        <span className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Price breakdown and Cancel CTA */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-border pt-6">
                <div>
                    {isPendingOrConfirmed && (
                        <Button
                            variant="outline"
                            disabled={isCanceling}
                            onClick={handleCancelOrder}
                            className="rounded-none text-destructive border-destructive/20 hover:bg-destructive/5"
                        >
                            {isCanceling ? (
                                <>
                                    <Spinner size="sm" className="mr-2 text-destructive" />
                                    Canceling Order...
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Order
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className="w-full md:w-80 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Items Subtotal</span>
                        <span>{formatPrice(itemsSubtotal)}</span>
                    </div>
                    {order.totalAmount !== itemsSubtotal && (
                        <div className="flex justify-between text-muted-foreground">
                            <span>Shipping & fees</span>
                            <span>{order.totalAmount > itemsSubtotal ? formatPrice(order.totalAmount - itemsSubtotal) : "Included"}</span>
                        </div>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between items-end">
                        <span className="font-medium">Order Total</span>
                        <span className="font-serif text-2xl font-bold text-foreground">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {order.status === OrderStatus.Completed && (
                        <div className="border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                            <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-emerald-800 text-sm">
                                        You earned {earnedPoints === 0 ? "0" : earnedPoints.toLocaleString()} point{earnedPoints !== 1 ? "s" : ""} from this order!
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        They&apos;ve been added to your balance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {order.status === OrderStatus.Returned && (
                        <div className="border border-amber-200 bg-amber-50 p-4 space-y-1">
                            <div className="flex items-start gap-3">
                                <RotateCcw className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-amber-800 text-sm">
                                        Points reversed
                                    </p>
                                    <p className="text-xs text-amber-600">
                                        Loyalty points earned from this order were reversed after the return.
                                    </p>
                                    <Link
                                        href={ROUTES.LOYALTY}
                                        className="text-xs text-amber-700 underline underline-offset-2 hover:text-amber-800 inline-block mt-1"
                                    >
                                        View transaction history
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
