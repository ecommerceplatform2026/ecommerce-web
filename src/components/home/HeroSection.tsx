import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ROUTES } from "@/constants/routes"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-stone-100">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-zinc-200" />

            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-[55%] h-full bg-stone-200/60" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-300/30 rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-stone-400/30 rounded-full" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-3xl">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
                        Bộ sưu tập Thu Đông 2026
                    </p>

                    <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] mb-10 text-balance">
                        Phong Cách
                        <br />
                        <span className="italic text-muted-foreground">Là Ngôn Ngữ</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-12">
                        Tinh tế từng đường chỉ, sang trọng mọi khoảnh khắc.
                        Khám phá bộ sưu tập thời trang cao cấp dành riêng cho bạn.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button asChild size="lg" className="h-14 px-10 text-base rounded-none">
                            <Link href={ROUTES.SHOP.PRODUCTS}>
                                Khám Phá Ngay
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 px-10 text-base rounded-none border-foreground"
                        >
                            <Link href={ROUTES.SHOP.PRODUCTS}>
                                Xem Bộ Sưu Tập
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
                <span className="text-xs tracking-widest uppercase">Cuộn xuống</span>
                <div className="w-px h-12 bg-muted-foreground/40 animate-pulse" />
            </div>
        </section>
    )
}
