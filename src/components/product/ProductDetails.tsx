"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Minus, Plus, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useProducts } from "@/hooks/useProducts"
import toast from "react-hot-toast"
import type { Product } from "@/types/product"

const mockReviews = [
    {
        id: 1,
        author: "Nguyễn Văn Minh",
        rating: 5,
        date: "2025-01-10",
        title: "Chất lượng xuất sắc",
        comment:
            "Chất liệu rất cao cấp, đường may tinh tế. Hoàn toàn xứng đáng với mức giá. Tôi rất hài lòng với sản phẩm này.",
    },
    {
        id: 2,
        author: "Trần Đức Anh",
        rating: 5,
        date: "2025-01-08",
        title: "Vừa size, rất đẹp",
        comment:
            "Mua đúng size như bình thường, vừa in. Chất vải mềm mại, sang trọng. Giao hàng đúng hẹn, đóng gói cẩn thận.",
    },
    {
        id: 3,
        author: "Phạm Tuấn Khải",
        rating: 4,
        date: "2025-01-05",
        title: "Sản phẩm tốt",
        comment:
            "Nhìn chung rất hài lòng. Chỉ có điều giao hàng hơi chậm hơn dự kiến một chút, nhưng sản phẩm đáng giá.",
    },
    {
        id: 4,
        author: "Lê Hoàng Nam",
        rating: 5,
        date: "2025-01-02",
        title: "Trải nghiệm đẳng cấp",
        comment:
            "Từ bao bì đến sản phẩm đều rất chỉn chu. Đây mới đúng là thời trang cao cấp. Chắc chắn sẽ mua lại.",
    },
    {
        id: 5,
        author: "Vũ Thanh Tùng",
        rating: 4,
        date: "2024-12-28",
        title: "Đáng để đầu tư",
        comment:
            "Giá hơi cao nhưng chất lượng xứng đáng. Chất vải bền đẹp, kiểu dáng cổ điển mà vẫn hiện đại.",
    },
    {
        id: 6,
        author: "Đỗ Quang Huy",
        rating: 5,
        date: "2024-12-25",
        title: "Mua tặng rất ý nghĩa",
        comment:
            "Mua tặng ba nhân dịp sinh nhật. Ông rất thích, khen chất lượng tốt và thiết kế tinh tế. Cảm ơn Atelier!",
    },
]

interface ProductDetailsProps {
    product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const [currentReviewPage, setCurrentReviewPage] = useState(1)

    const { addItem } = useCart()
    const { toggleItem, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product.id)

    const { data: allProducts = [] } = useProducts()
    const relatedProducts = allProducts
        .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 8)

    const averageRating = (
        mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    ).toFixed(1)

    const REVIEWS_PER_PAGE = 3
    const totalReviewPages = Math.ceil(mockReviews.length / REVIEWS_PER_PAGE)
    const paginatedReviews = mockReviews.slice(
        (currentReviewPage - 1) * REVIEWS_PER_PAGE,
        currentReviewPage * REVIEWS_PER_PAGE,
    )

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            variantId: product.id,
            name: product.name,
            price: product.basePrice,
            size: "",
            color: "",
            quantity,
            imageUrl: null,
        })
        toast.success(`Đã thêm ${quantity} × ${product.name} vào giỏ hàng`)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const handleWishlist = () => {
        toggleItem(product)
        toast.success(inWishlist ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích")
    }

    return (
        <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                {/* Image */}
                <div>
                    <div className="relative aspect-[3/4] bg-secondary">
                        <Image
                            src="/placeholder.svg"
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-8">
                    <div>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
                            {product.categoryName ?? ""}
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl mb-4">{product.name}</h1>
                        <p className="text-2xl">{product.basePrice.toLocaleString("vi-VN")}₫</p>
                    </div>

                    {product.description && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    {/* Quantity */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium tracking-wide">SỐ LƯỢNG</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                                    disabled={quantity <= 1}
                                    className="h-12 w-12 rounded-none hover:bg-muted cursor-pointer"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="w-16 h-12 flex items-center justify-center border-x border-border">
                                    <span className="text-base font-medium">{quantity}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(prev => Math.min(prev + 1, 99))}
                                    className="h-12 w-12 rounded-none hover:bg-muted cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        size="lg"
                        className="w-full text-base h-14 cursor-pointer"
                        onClick={handleAddToCart}
                        disabled={added}
                    >
                        {added ? (
                            <>
                                <Check className="mr-2 h-5 w-5" />
                                Đã thêm vào giỏ
                            </>
                        ) : (
                            "Thêm vào giỏ hàng"
                        )}
                    </Button>

                    {/* Wishlist */}
                    <Button
                        variant="outline"
                        size="lg"
                        className={`w-full h-12 cursor-pointer gap-2 ${
                            inWishlist ? "border-primary text-primary" : ""
                        }`}
                        onClick={handleWishlist}
                    >
                        <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                        {inWishlist ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
                    </Button>

                    {/* Product Details */}
                    <div className="pt-8 border-t border-border space-y-4">
                        <h3 className="text-sm font-medium tracking-wide">CHI TIẾT SẢN PHẨM</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {product.material && <li>• Chất liệu: {product.material}</li>}
                            <li>• Thủ công tinh xảo, chú ý từng chi tiết</li>
                            <li>• Sản xuất tại Ý</li>
                            <li>• Miễn phí vận chuyển cho đơn từ 2.000.000₫</li>
                            <li>• Đổi trả trong vòng 30 ngày</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="mt-24 pt-16 border-t border-border">
                <div className="max-w-4xl">
                    <div className="mb-12">
                        <h2 className="font-serif text-3xl mb-4">Đánh giá khách hàng</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.floor(Number.parseFloat(averageRating))
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-medium">{averageRating} / 5</span>
                            <span className="text-sm text-muted-foreground">
                                ({mockReviews.length} đánh giá)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {paginatedReviews.map((review) => (
                            <div key={review.id} className="pb-8 border-b border-border last:border-b-0">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-lg">{review.title}</h3>
                                        <p className="text-sm text-muted-foreground">{review.author}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(review.date).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < review.rating
                                                    ? "fill-primary text-primary"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {totalReviewPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentReviewPage(prev => Math.max(1, prev - 1))}
                                disabled={currentReviewPage === 1}
                                className="cursor-pointer"
                            >
                                Trước
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentReviewPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentReviewPage(page)}
                                        className="w-10 cursor-pointer"
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentReviewPage(prev => Math.min(totalReviewPages, prev + 1))}
                                disabled={currentReviewPage === totalReviewPages}
                                className="cursor-pointer"
                            >
                                Sau
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-24 pt-16 border-t border-border">
                    <h2 className="font-serif text-3xl mb-12">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p) => (
                            <Link
                                key={p.id}
                                href={ROUTES.SHOP.PRODUCT_DETAIL(p.id)}
                                className="group"
                            >
                                <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                                    <Image
                                        src="/placeholder.svg"
                                        alt={p.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-medium text-sm tracking-wide mb-2 group-hover:text-muted-foreground transition-colors">
                                    {p.name}
                                </h3>
                                <p className="text-lg font-medium">
                                    {p.basePrice.toLocaleString("vi-VN")}₫
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
