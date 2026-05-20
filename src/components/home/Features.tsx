import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react"

const features = [
    {
        icon: Truck,
        title: "Miễn phí vận chuyển",
        description: "Cho đơn hàng từ 2.000.000₫",
    },
    {
        icon: RotateCcw,
        title: "Đổi trả dễ dàng",
        description: "Trong vòng 30 ngày kể từ ngày nhận hàng",
    },
    {
        icon: ShieldCheck,
        title: "Hàng chính hãng",
        description: "Cam kết 100% sản phẩm chính hãng",
    },
    {
        icon: Headphones,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ tư vấn luôn sẵn sàng hỗ trợ",
    },
]

export function Features() {
    return (
        <section className="py-20 px-4 lg:px-8 border-y border-border bg-muted/30">
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
