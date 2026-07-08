"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Coins, MapPin, Phone, User } from "lucide-react"
import { z } from "zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useProfile } from "@/hooks/useProfile"
import { useCheckout } from "@/hooks/useOrders"
import { usePointsBalance } from "@/hooks/usePoints"
import { useNotifications } from "@/hooks/useNotifications"
import { PaymentMethod } from "@/constants/enums"
import { Spinner } from "@/components/ui/Spinner"
import { ROUTES } from "@/constants/routes"
import type { ApiError } from "@/types/api"

const POINT_VALUE_VND = 100
const REDEMPTION_STEP = 100
const MIN_PAYABLE_TOTAL = 10_000

function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} VND`
}

function createRedemptionSchema(balance: number, orderSubtotal: number) {
    const balanceInRedeemUnits = Math.floor(balance / REDEMPTION_STEP) * REDEMPTION_STEP
    const maxByMinimumTotal = Math.max(
        0,
        Math.floor((orderSubtotal - MIN_PAYABLE_TOTAL) / POINT_VALUE_VND / REDEMPTION_STEP) * REDEMPTION_STEP,
    )
    const maxRedeemable = Math.max(balanceInRedeemUnits, maxByMinimumTotal)

    return {
        maxRedeemable,
        schema: z
            .number()
            .int("Points must be a whole number.")
            .min(0, "Points cannot be negative.")
            .refine((value) => value === 0 || value >= REDEMPTION_STEP, {
                message: `Redeem at least ${REDEMPTION_STEP} points.`,
            })
            .refine((value) => value % REDEMPTION_STEP === 0, {
                message: `Points must be in multiples of ${REDEMPTION_STEP}.`,
            })
            .refine((value) => value <= balance, {
                message: "You cannot redeem more points than your balance.",
            })
            .refine((value) => value <= maxRedeemable, {
                message: `Order total after discount must be at least ${formatCurrency(MIN_PAYABLE_TOTAL)}.`,
            }),
    }
}

interface CheckoutFormProps {
    orderSubtotal: number
    onPointsToRedeemChange: (points: number) => void
}

export function CheckoutForm({
    orderSubtotal,
    onPointsToRedeemChange,
}: CheckoutFormProps) {
    const router = useRouter()
    const { address, isLoading: isProfileLoading, error: profileError } = useProfile()
    const { data: pointsBalance, isLoading: isPointsLoading, error: pointsError } = usePointsBalance()
    const checkoutMutation = useCheckout()
    const { add: addNotification } = useNotifications()
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.COD)
    const [pointsInput, setPointsInput] = useState("")
    const [debouncedPoints, setDebouncedPoints] = useState(0)

    const availablePoints = pointsBalance?.balance ?? 0
    const { schema: redemptionSchema, maxRedeemable } = useMemo(
        () => createRedemptionSchema(availablePoints, orderSubtotal),
        [availablePoints, orderSubtotal],
    )
    const parsedPoints = pointsInput.trim() === "" ? 0 : Number(pointsInput)
    const hasNumericInput = Number.isFinite(parsedPoints)
    const validation = hasNumericInput
        ? redemptionSchema.safeParse(parsedPoints)
        : { success: false as const, error: { issues: [{ message: "Enter a valid points amount." }] } }
    const pointsErrorMessage = validation.success ? null : validation.error.issues[0]?.message
    const isPointsInvalid = !validation.success
    const loyaltyDiscount = debouncedPoints * POINT_VALUE_VND
    const adjustedSubtotal = Math.max(orderSubtotal - loyaltyDiscount, 0)

    useEffect(() => {
        const nextPoints = validation.success ? parsedPoints : 0

        const timer = window.setTimeout(() => {
            setDebouncedPoints(nextPoints)
            onPointsToRedeemChange(nextPoints)
        }, 250)

        return () => window.clearTimeout(timer)
    }, [onPointsToRedeemChange, parsedPoints, validation.success])

    const handlePlaceOrder = async () => {
        if (!address) {
            toast.error("Please add a shipping address in your profile first.")
            return
        }

        if (!validation.success) {
            toast.error(pointsErrorMessage ?? "Please enter a valid points amount.")
            return
        }

        const validatedPoints = validation.data

        try {
            const result = await checkoutMutation.mutateAsync({
                paymentMethod: selectedPayment,
                redeemedPoints: validatedPoints > 0 ? validatedPoints : null,
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

            addNotification("order", "Order Placed", `Order #${result.orderCode} has been placed.`, `/orders/${result.orderId}`)
            if (validatedPoints > 0) {
                addNotification("points", "Points Redeemed", `${validatedPoints.toLocaleString()} points redeemed.`, "/loyalty")
            }

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
                                className={`text-left p-5 border bg-card transition-all flex flex-col justify-between h-full rounded-none ${
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

            {/* Loyalty Points Section */}
            <div>
                <h2 className="font-serif text-2xl mb-4 border-b border-border pb-2">3. Loyalty Points (Optional)</h2>
                <div className="border border-border bg-card p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-yellow-200 bg-yellow-50 text-yellow-700">
                                <Coins className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Redeem rewards</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isPointsLoading
                                        ? "Loading your points balance..."
                                        : pointsError
                                          ? "Points balance is unavailable right now."
                                          : `${availablePoints.toLocaleString()} points available`}
                                </p>
                            </div>
                        </div>
                        {maxRedeemable > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-none bg-transparent shrink-0"
                                onClick={() => setPointsInput(String(maxRedeemable))}
                                disabled={isPointsLoading || !!pointsError}
                            >
                                Use max
                            </Button>
                        )}
                    </div>

                    <div className="grid gap-2 max-w-sm">
                        <Input
                            type="number"
                            min="0"
                            step={REDEMPTION_STEP}
                            inputMode="numeric"
                            placeholder="Redeem points"
                            value={pointsInput}
                            onChange={(e) => setPointsInput(e.target.value)}
                            disabled={isPointsLoading || !!pointsError}
                            aria-invalid={isPointsInvalid}
                            className="rounded-none"
                        />
                        {pointsErrorMessage && pointsInput.trim() !== "" && (
                            <p className="text-xs text-destructive">{pointsErrorMessage}</p>
                        )}
                        {!pointsErrorMessage && debouncedPoints > 0 && (
                            <p className="text-xs text-emerald-700">
                                {debouncedPoints.toLocaleString()} points = {formatCurrency(loyaltyDiscount)} off.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2 border-t border-border pt-4 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Minimum redeem</span>
                            <span>{REDEMPTION_STEP.toLocaleString()} pts</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Maximum for this order</span>
                            <span>{maxRedeemable.toLocaleString()} pts</span>
                        </div>
                        {debouncedPoints > 0 && (
                            <>
                                <div className="flex justify-between text-emerald-700">
                                    <span>Discount preview</span>
                                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal after points</span>
                                    <span>{formatCurrency(adjustedSubtotal)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    1 point = 100 VND. Points must be redeemed in multiples of 100 and cannot reduce the order below {formatCurrency(MIN_PAYABLE_TOTAL)}.
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
