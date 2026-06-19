import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react"

const features = [
    {
        icon: Truck,
        title: "Free shipping",
        description: "For orders from 2,000,000 VND",
    },
    {
        icon: RotateCcw,
        title: "Easy returns",
        description: "Within 30 days of delivery",
    },
    {
        icon: ShieldCheck,
        title: "Authentic products",
        description: "Guaranteed 100% authentic products",
    },
    {
        icon: Headphones,
        title: "24/7 support",
        description: "Our support team is always ready to help",
    },
]

export function Features() {
    return (
        <section className="py-16 lg:py-20 px-4 lg:px-8 border-y border-border bg-muted/30">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center border border-border rounded-full">
                                <feature.icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm tracking-wide mb-1">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
