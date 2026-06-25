"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2, MapPin, Phone, User } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { useProfile } from "@/hooks/useProfile"
import { useCheckout } from "@/hooks/useOrders"
import { PaymentMethod } from "@/constants/enums"
import { Spinner } from "@/components/ui/Spinner"
import { ROUTES } from "@/constants/routes"
import type { ApiError } from "@/types/api"

export function CheckoutForm() {
    const router = useRouter()
    const { address, isLoading: isProfileLoading, error: profileError } = useProfile()
    const checkoutMutation = useCheckout()
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.COD)
    const [pointsToRedeem, setPointsToRedeem] = useState<number>(0)
    const isPointsInvalid = pointsToRedeem > 0 && pointsToRedeem % 100 !== 0

    const handlePlaceOrder = async () => {
        if (!address) {
            toast.error("Please add a shipping address in your profile first.")
            return
        }

        try {
            const result = await checkoutMutation.mutateAsync({
                paymentMethod: selectedPayment,
                redeemedPoints: pointsToRedeem > 0 ? pointsToRedeem : null,
            })

            // AC3: Order Success Notification
            toast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-background border-2 border-foreground p-6 shadow-none pointer-events-auto flex flex-col items-center text-center`}
                    >
                        <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
                        <h3 className="font-serif text-2xl mb-2">Order Placed Successfully!</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Thank you for your purchase. Your order #{result.orderCode} has been created.
                        </p>
                        <div className="flex gap-3 w-full">
                            <Button
                                className="flex-1 rounded-none"
                                onClick={() => {
                                    toast.dismiss(t.id)
                                    // If checkout has online URL, redirect user to pay
                                    if (result.checkoutUrl) {
                                        window.location.href = result.checkoutUrl
                                    } else {
                                        router.push(ROUTES.ORDERS.INDEX)
                                    }
                                }}
                            >
                                {result.checkoutUrl ? "Proceed to Payment" : "View My Orders"}
                            </Button>
                        </div>
                    </div>
                ),
                { duration: 6000 }
            )

            // If not redirecting immediately to checkoutUrl
            if (!result.checkoutUrl) {
                router.push(ROUTES.ORDERS.INDEX)
            }
        } catch (err) {
            // AC4: Friendly error message
            const apiError = err as ApiError
            toast.error(apiError.message ?? "Failed to place order. Please try again.")
        }
    }

    if (isProfileLoading) {
        return (
            <div className="space-y-6">
                <div className="h-40 animate-pulse bg-secondary border border-border" />
                <div className="h-48 animate-pulse bg-secondary border border-border" />
            </div>
        )
    }

    if (profileError) {
        return (
            <div className="border border-destructive/20 bg-destructive/5 p-6 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
                <h3 className="font-serif text-xl text-destructive">Error Loading Profile</h3>
                <p className="text-sm text-muted-foreground">{profileError}</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="rounded-none">
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Shipping Address Section */}
            <div>
                <h2 className="font-serif text-2xl mb-4 border-b border-border pb-2">1. Delivery Address</h2>
                {address ? (
                    <div className="border border-border p-5 space-y-3 bg-card relative">
                        <div className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{address.receiverName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{address.phoneNumber}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>
                                {[address.addressLine, address.ward, address.district, address.province]
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                        </div>
                        <div className="pt-2">
                            <Link href={ROUTES.PROFILE.INDEX} className="text-xs underline hover:text-muted-foreground">
                                Edit address in profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="border border-destructive/20 bg-destructive/5 p-6 text-center space-y-4">
                        <MapPin className="h-10 w-10 text-destructive mx-auto" />
                        <h3 className="font-serif text-xl">No Shipping Address</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            We need your shipping details before you can place an order. Please update your profile with a default address.
                        </p>
                        <Button asChild className="rounded-none">
                            <Link href={ROUTES.PROFILE.INDEX}>Add Address in Profile</Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Payment Method Section */}
            <div>
                <h2 className="font-serif text-2xl mb-4 border-b border-border pb-2">2. Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            id: PaymentMethod.COD,
                            title: "Cash On Delivery (COD)",
                            description: "Pay with cash upon delivery.",
                        },
                        {
                            id: PaymentMethod.MoMo,
                            title: "MoMo Wallet",
                            description: "Pay using MoMo payment gateway.",
                        },
                        {
                            id: PaymentMethod.ZaloPay,
                            title: "ZaloPay Wallet",
                            description: "Pay using ZaloPay gateway.",
                        },
                        {
                            id: PaymentMethod.PayOS,
                            title: "PayOS Payment",
                            description: "Scan QR code with any banking app.",
                        },
                        {
                            id: PaymentMethod.VNPay,
                            title: "VNPay Payment",
                            description: "Pay via VNPay banking gateway.",
                        },
                    ].map((method) => {
                        const isSelected = selectedPayment === method.id
                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setSelectedPayment(method.id)}
                                className={`text-left p-5 border transition-all flex flex-col justify-between h-full rounded-none ${
                                    isSelected
                                        ? "border-foreground bg-secondary-container/10 ring-1 ring-foreground"
                                        : "border-border hover:border-foreground"
                                }`}
                            >
                                <div className="flex items-center justify-between w-full mb-2">
                                    <span className="font-medium text-base">{method.title}</span>
                                    <div
                                        className={`size-4 rounded-full border flex items-center justify-center ${
                                            isSelected ? "border-foreground bg-foreground" : "border-muted"
                                        }`}
                                    >
                                        {isSelected && <div className="size-1.5 rounded-full bg-background" />}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{method.description}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Loyalty Points Section (Optional UI placeholder) */}
            <div>
                <h2 className="font-serif text-2xl mb-4 border-b border-border pb-2">3. Loyalty Points (Optional)</h2>
                <div className="flex gap-3 max-w-sm">
                    <input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Redeem points"
                        value={pointsToRedeem || ""}
                        onChange={(e) => setPointsToRedeem(Math.max(0, parseInt(e.target.value) || 0))}
                        className="flex-1 px-4 py-2 border border-border rounded-none focus:outline-none focus:border-foreground text-sm"
                    />
                </div>
                {pointsToRedeem > 0 && pointsToRedeem % 100 !== 0 && (
                    <p className="text-xs text-destructive mt-2">Points must be in multiples of 100.</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    Enter points to redeem them for discounts. (1 point = 100 VND)
                </p>
            </div>

            {/* Error Message Box */}
            {checkoutMutation.isError && (
                <div className="border border-destructive/20 bg-destructive/5 p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-destructive">Checkout Error</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {((checkoutMutation.error as unknown) as ApiError)?.message ?? "Something went wrong while placing your order. Please try again."}
                        </p>
                    </div>
                </div>
            )}

            {/* Place Order CTA */}
            <div className="pt-4">
                <Button
                    onClick={handlePlaceOrder}
                    disabled={!address || isPointsInvalid || checkoutMutation.isPending}
                    className="w-full h-14 text-base font-semibold rounded-none uppercase tracking-widest"
                >
                    {checkoutMutation.isPending ? (
                        <>
                            <Spinner size="sm" className="mr-2 text-primary-foreground" />
                            Processing Order...
                        </>
                    ) : (
                        "Place Order"
                    )}
                </Button>
            </div>
        </div>
    )
}
