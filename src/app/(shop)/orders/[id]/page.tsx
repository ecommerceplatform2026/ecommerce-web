"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle, ArrowLeft, Award, Check, CreditCard, ExternalLink, Package, RotateCcw, XCircle } from "lucide-react"
import { getProductImage } from "@/utils/imageHelpers"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Spinner } from "@/components/ui/Spinner"
import { Badge } from "@/components/ui/Badge"
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, OrderStatus, DELIVERY_STATUS_COLOR, DELIVERY_STATUS_LABEL, DeliveryStatus } from "@/constants/enums"
import { ROUTES } from "@/constants/routes"
import { useCancelOrder, useOrderDetail } from "@/hooks/useOrders"
import { LoyaltyTransactionStatus, LoyaltyTransactionType } from "@/types/loyalty"
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

const CARRIER_NAME_MAP: Record<string, string> = {
    GHN: "Giao Hàng Nhanh (GHN)",
}

function getTrackingUrl(carrierCode: string, trackingCode: string): string | null {
    if (carrierCode.toUpperCase() === "GHN") {
        return `https://donhang.ghn.vn/?order_code=${trackingCode}`
    }
    return null
}

interface TimelineStep {
    label: string
    description?: string
    isCompleted: boolean
    isCurrent: boolean
    isError?: boolean
}

function getTimelineSteps(status: DeliveryStatus): TimelineStep[] {
    const steps: TimelineStep[] = []
    
    const isCancelled = status === DeliveryStatus.Cancelled
    const isFailed = status === DeliveryStatus.Failed
    const isReturned = status === DeliveryStatus.Returned
    const isException = status === DeliveryStatus.Exception

    const standardSequence = [
        DeliveryStatus.Pending,
        DeliveryStatus.Created,
        DeliveryStatus.PickedUp,
        DeliveryStatus.InTransit,
        DeliveryStatus.OutForDelivery,
        DeliveryStatus.Delivered
    ]

    const labels: Record<number, { label: string; desc: string }> = {
        [DeliveryStatus.Pending]: { label: "Pending", desc: "Awaiting preparation" },
        [DeliveryStatus.Created]: { label: "Created", desc: "Package prepared" },
        [DeliveryStatus.PickedUp]: { label: "Picked Up", desc: "Handed over to carrier" },
        [DeliveryStatus.InTransit]: { label: "In Transit", desc: "Package is in transit" },
        [DeliveryStatus.OutForDelivery]: { label: "Out for Delivery", desc: "Out for local delivery" },
        [DeliveryStatus.Delivered]: { label: "Delivered", desc: "Delivered successfully" },
    }

    if (isCancelled) {
        steps.push({ label: "Pending", description: "Order confirmed", isCompleted: true, isCurrent: false })
        steps.push({ label: "Cancelled", description: "Delivery cancelled", isCompleted: false, isCurrent: true, isError: true })
        return steps
    }

    if (isFailed) {
        steps.push({ label: "Pending", description: "Order confirmed", isCompleted: true, isCurrent: false })
        steps.push({ label: "Created", description: "Package prepared", isCompleted: true, isCurrent: false })
        steps.push({ label: "Failed", description: "Delivery failed", isCompleted: false, isCurrent: true, isError: true })
        return steps
    }

    if (isReturned) {
        steps.push({ label: "Pending", description: "Order confirmed", isCompleted: true, isCurrent: false })
        steps.push({ label: "Created", description: "Package prepared", isCompleted: true, isCurrent: false })
        steps.push({ label: "Picked Up", description: "Picked up by carrier", isCompleted: true, isCurrent: false })
        steps.push({ label: "Returned", description: "Returned to sender", isCompleted: false, isCurrent: true, isError: true })
        return steps
    }

    if (isException) {
        steps.push({ label: "Pending", description: "Order confirmed", isCompleted: true, isCurrent: false })
        steps.push({ label: "Created", description: "Package prepared", isCompleted: true, isCurrent: false })
        steps.push({ label: "Exception", description: "Delivery exception", isCompleted: false, isCurrent: true, isError: true })
        return steps
    }

    const currentIndex = standardSequence.indexOf(status)
    
    standardSequence.forEach((stepStatus, index) => {
        const info = labels[stepStatus]
        steps.push({
            label: info.label,
            description: info.desc,
            isCompleted: index < currentIndex,
            isCurrent: index === currentIndex,
        })
    })

    return steps
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
    const earnedPoints = order.loyaltyTransactions
        ?.filter(t => t.type === LoyaltyTransactionType.Earn && t.status === LoyaltyTransactionStatus.Completed)
        .reduce((sum, t) => sum + t.points, 0) ?? 0
    const redeemRefund = order.loyaltyTransactions
        ?.filter(t => t.type === LoyaltyTransactionType.Redeem && t.status === LoyaltyTransactionStatus.Cancelled)
        .reduce((sum, t) => sum + Math.abs(t.points), 0) ?? 0

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
                    <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-2.5">
                        <Package className="h-4 w-4" />
                        Tracking Details
                    </h3>
                    <div className="text-sm pt-1">
                        {order.tracking ? (
                            <div className="space-y-4">
                                <div className="space-y-2 border-b border-border/60 pb-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-medium text-xs text-muted-foreground">Carrier</span>
                                        <span className="text-xs text-foreground font-semibold">
                                            {CARRIER_NAME_MAP[order.tracking.carrierCode] || order.tracking.carrierCode}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-medium text-xs text-muted-foreground">Status</span>
                                        <Badge variant="secondary" className={`${DELIVERY_STATUS_COLOR[order.tracking.status]} border-none rounded-none px-2 py-0.5 font-medium text-xs`}>
                                            {DELIVERY_STATUS_LABEL[order.tracking.status]}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-medium text-xs text-muted-foreground">Tracking Code</span>
                                        {getTrackingUrl(order.tracking.carrierCode, order.tracking.trackingCode) ? (
                                            <a
                                                href={getTrackingUrl(order.tracking.carrierCode, order.tracking.trackingCode)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                                            >
                                                {order.tracking.trackingCode}
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        ) : (
                                            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 inline-block select-all">
                                                {order.tracking.trackingCode}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Step Progress Timeline */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground">
                                        Delivery Progress
                                    </h4>
                                    
                                    <div className="flex flex-col space-y-5 relative pl-4 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                                        {getTimelineSteps(order.tracking.status).map((step, idx, arr) => (
                                            <div key={idx} className="flex gap-4 relative">
                                                {/* Connector line overlay for completed vertical steps */}
                                                {idx < arr.length - 1 && step.isCompleted && (
                                                    <div className="absolute left-[-15px] top-6 bottom-[-20px] w-0.5 bg-primary z-0" />
                                                )}
                                                
                                                {/* Circle indicator */}
                                                <div 
                                                    className={`h-5 w-5 rounded-full flex items-center justify-center border shrink-0 relative z-10 transition-all duration-300 ${
                                                        step.isCompleted 
                                                            ? "bg-primary border-primary text-primary-foreground" 
                                                            : step.isCurrent 
                                                                ? step.isError 
                                                                    ? "bg-destructive border-destructive text-destructive-foreground animate-pulse"
                                                                    : "bg-background border-primary text-primary ring-4 ring-primary/10" 
                                                                : "bg-background border-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {step.isCompleted ? (
                                                        <Check className="h-3 w-3 stroke-[3]" />
                                                    ) : step.isCurrent && step.isError ? (
                                                        <AlertCircle className="h-3 w-3" />
                                                    ) : (
                                                        <div className={`h-1.5 w-1.5 rounded-full ${step.isCurrent ? "bg-primary" : "bg-transparent"}`} />
                                                    )}
                                                </div>
                                                
                                                {/* Label and description */}
                                                <div className="space-y-0.5">
                                                    <p className={`text-xs font-semibold leading-none ${step.isCurrent ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                                                        {step.label}
                                                    </p>
                                                    {step.description && (
                                                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                                                            {step.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 bg-muted/40 border border-border p-4 rounded-none">
                                <AlertCircle className="h-5 w-5 text-muted-foreground/60 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-xs text-foreground">Tracking Unavailable</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                                        Tracking information is currently unavailable. This will be updated once the order is shipped.
                                    </p>
                                </div>
                            </div>
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
                                    <Link
                                        href={ROUTES.LOYALTY}
                                        className="text-xs text-emerald-700 underline underline-offset-2 hover:text-emerald-800 inline-block mt-1"
                                    >
                                        View transaction history
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {redeemRefund > 0 && (
                        <div className="border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                            <div className="flex items-start gap-3">
                                <RotateCcw className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-emerald-800 text-sm">
                                        {redeemRefund.toLocaleString()} points restored to your balance
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        Points redeemed on this order were returned.
                                    </p>
                                    <Link
                                        href={ROUTES.LOYALTY}
                                        className="text-xs text-emerald-700 underline underline-offset-2 hover:text-emerald-800 inline-block mt-1"
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
