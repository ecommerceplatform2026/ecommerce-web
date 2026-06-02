import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ROUTES } from "@/constants/routes"

const banners = [
    {
        tag: "New Arrivals",
        title: "Fall\nOuterwear",
        description: "Elegant and warm for cooler days",
        cta: "Shop now",
        bg: "bg-zinc-800",
        textColor: "text-white",
        href: ROUTES.SHOP.PRODUCTS,
    },
    {
        tag: "Best Seller",
        title: "Premium\nTrousers",
        description: "Office-ready and polished for every occasion",
        cta: "Explore",
        bg: "bg-stone-100",
        textColor: "text-foreground",
        href: ROUTES.SHOP.PRODUCTS,
    },
]

export function PromoBanner() {
    return (
        <section className="py-8 px-4 lg:px-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner, i) => (
                        <Link
                            key={i}
                            href={banner.href}
                            className={`group relative overflow-hidden ${banner.bg} p-12 min-h-80 flex flex-col justify-between`}
                        >
                            {/* Decorative circle */}
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-current opacity-10 transition-transform duration-700 group-hover:scale-125" />
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-current opacity-10 transition-transform duration-700 group-hover:scale-125" />

                            <p className={`text-xs tracking-[0.3em] uppercase ${banner.textColor} opacity-60`}>
                                {banner.tag}
                            </p>

                            <div className="space-y-4">
                                <h3 className={`font-serif text-4xl md:text-5xl ${banner.textColor} whitespace-pre-line leading-tight`}>
                                    {banner.title}
                                </h3>
                                <p className={`text-sm ${banner.textColor} opacity-70 max-w-xs`}>
                                    {banner.description}
                                </p>
                                <div className={`flex items-center gap-2 text-sm tracking-wide ${banner.textColor} group/link`}>
                                    <span className="border-b border-current pb-0.5 transition-all group-hover:pr-2">
                                        {banner.cta}
                                    </span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
