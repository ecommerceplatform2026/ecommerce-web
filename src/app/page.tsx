import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { ShopByCategory } from "@/components/home/ShopByCategory"
import { RecommendationsSection } from "@/components/home/RecommendationsSection"
import { PromoBanner } from "@/components/home/PromoBanner"
import { Features } from "@/components/home/Features"
import { Newsletter } from "@/components/home/Newsletter"

export default function HomePage() {
    return (
        <main className="flex-1">
            <HeroSection />
            <FeaturedProducts />
            <ShopByCategory />
            <RecommendationsSection />
            <PromoBanner />
            <Features />
            <Newsletter />
        </main>
    )
}

