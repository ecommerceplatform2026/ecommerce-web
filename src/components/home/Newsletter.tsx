"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Check } from "lucide-react"
import toast from "react-hot-toast"

export function Newsletter() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email.trim()) return
        setSubmitted(true)
        toast.success("Đăng ký nhận tin thành công!")
    }

    return (
        <section className="py-24 px-4 lg:px-8 bg-foreground text-background">
            <div className="container mx-auto max-w-2xl text-center">
                <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-4">
                    Đừng bỏ lỡ
                </p>
                <h2 className="font-serif text-4xl md:text-5xl mb-4">
                    Đăng Ký Nhận Tin
                </h2>
                <p className="text-background/70 text-lg mb-10">
                    Cập nhật bộ sưu tập mới nhất, ưu đãi độc quyền và xu hướng thời trang mỗi tuần.
                </p>

                {submitted ? (
                    <div className="flex items-center justify-center gap-3 text-background/80">
                        <Check className="h-5 w-5" />
                        <span>Cảm ơn bạn đã đăng ký!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Địa chỉ email của bạn"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="flex-1 h-12 rounded-none bg-transparent border-background/40 text-background placeholder:text-background/40 focus-visible:border-background"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="h-12 rounded-none bg-background text-foreground hover:bg-background/90 shrink-0"
                        >
                            Đăng ký
                        </Button>
                    </form>
                )}

                <p className="text-xs text-background/40 mt-4">
                    Không spam. Hủy đăng ký bất kỳ lúc nào.
                </p>
            </div>
        </section>
    )
}
