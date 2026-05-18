"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"

// ── Mock cart items ─────────────────────────────────────────────
interface MockCartItem {
    variantId: string
    productId: string
    name: string
    price: number
    size: string
    color: string
    quantity: number
    imageUrl: string
    stock: number
}

const INITIAL_ITEMS: MockCartItem[] = [
    {
        variantId: "1-M-Charcoal",
        productId: "1",
        name: "Cashmere Overcoat",
        price: 1850,
        size: "M",
        color: "Charcoal",
        quantity: 1,
        imageUrl: "/luxury-black-cashmere-overcoat-on-model.jpg",
        stock: 12,
    },
    {
        variantId: "2-L-Grey",
        productId: "2",
        name: "Merino Wool Sweater",
        price: 425,
        size: "L",
        color: "Grey",
        quantity: 2,
        imageUrl: "/luxury-grey-merino-wool-sweater.jpg",
        stock: 8,
    },
    {
        variantId: "5-9-Black",
        productId: "5",
        name: "Leather Chelsea Boots",
        price: 725,
        size: "9",
        color: "Black",
        quantity: 1,
        imageUrl: "/luxury-black-leather-chelsea-boots.jpg",
        stock: 10,
    },
]

const ITEMS_PER_PAGE = 5
const FREE_SHIPPING_THRESHOLD = 3000
const SHIPPING_COST = 150

// ── Page ────────────────────────────────────────────────────────
export default function CartPage() {
    const [items, setItems] = useState<MockCartItem[]>(INITIAL_ITEMS)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
    const paginatedItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    )

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = subtotal + shipping

    function handleIncrease(variantId: string) {
        setItems((prev) =>
            prev.map((item) => {
                if (item.variantId !== variantId) return item
                if (item.quantity >= item.stock) return item
                return { ...item, quantity: item.quantity + 1 }
            }),
        )
    }

    function handleDecrease(variantId: string) {
        setItems((prev) =>
            prev.map((item) =>
                item.variantId === variantId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
            ),
        )
    }

    function handleRemove(variantId: string) {
        setItems((prev) => prev.filter((item) => item.variantId !== variantId))
        // Adjust page if last item on current page was removed
        setCurrentPage((prev) => {
            const newTotal = items.length - 1
            const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE)
            return prev > newTotalPages ? Math.max(1, newTotalPages) : prev
        })
    }

    // ── Empty state ──────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 lg:px-8 py-24">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground opacity-40" />
                    <h1 className="font-serif text-4xl md:text-5xl">Giỏ hàng trống</h1>
                    <p className="text-lg text-muted-foreground">
                        Khám phá bộ sưu tập thời trang cao cấp của chúng tôi
                    </p>
                    <Button asChild size="lg">
                        <Link href={ROUTES.SHOP.PRODUCTS}>Tiếp tục mua sắm</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // ── Cart ─────────────────────────────────────────────────────
    return (
        <div className="container mx-auto px-4 lg:px-8 py-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-12">Giỏ hàng</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {paginatedItems.map((item) => (
                        <div
                            key={item.variantId}
                            className="flex gap-6 pb-6 border-b border-border"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-32 h-40 flex-shrink-0 bg-secondary">
                                <Image
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Size: {item.size} • Màu: {item.color}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.variantId)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={`Xóa ${item.name}`}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* Quantity */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleDecrease(item.variantId)}
                                            disabled={item.quantity <= 1}
                                            className="p-2 border border-border hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.variantId)}
                                            disabled={item.quantity >= item.stock}
                                            className="p-2 border border-border hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Line total */}
                                    <p className="text-lg">
                                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Trước
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="border border-border p-8 space-y-6 sticky top-24">
                        <h2 className="font-serif text-2xl">Tóm tắt đơn hàng</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Tạm tính ({items.reduce((n, i) => n + i.quantity, 0)} sản phẩm)
                                </span>
                                <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phí vận chuyển</span>
                                {shipping === 0 ? (
                                    <span className="text-green-600 font-medium">Miễn phí</span>
                                ) : (
                                    <span>{shipping.toLocaleString("vi-VN")}₫</span>
                                )}
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Miễn phí vận chuyển cho đơn từ{" "}
                                    {FREE_SHIPPING_THRESHOLD.toLocaleString("vi-VN")}₫
                                </p>
                            )}
                        </div>

                        <div className="py-6 border-y border-border">
                            <div className="flex justify-between text-lg font-medium">
                                <span>Tổng cộng</span>
                                <span>{total.toLocaleString("vi-VN")}₫</span>
                            </div>
                        </div>

                        <Button asChild size="lg" className="w-full text-base h-14">
                            <Link href={ROUTES.CHECKOUT.INDEX}>Tiến hành thanh toán</Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                            <Link href={ROUTES.SHOP.PRODUCTS}>Tiếp tục mua sắm</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
