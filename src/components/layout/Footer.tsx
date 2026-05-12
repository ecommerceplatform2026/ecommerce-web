import Link from "next/link"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Thông tin thương hiệu */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-tight">ATELIER</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bộ sưu tập thời trang cao cấp dành cho quý ông hiện đại.
            </p>
            <div className="space-y-3 mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  123 Nguyễn Huệ, Quận 1<br />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="tel:+84901234567"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +84 90 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:info@atelier.vn"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@atelier.vn
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>Thứ 2 – Thứ 6: 9:00 – 21:00</p>
                  <p>Thứ 7 – Chủ nhật: 10:00 – 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cửa hàng */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">CỬA HÀNG</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Trang phục
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Phụ kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Công ty */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">CÔNG TY</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">HỖ TRỢ</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Vận chuyển & Đổi trả
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Hướng dẫn bảo quản
                </Link>
              </li>
            </ul>
          </div>

          {/* Thanh toán & Mạng xã hội */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">THANH TOÁN</h4>
            <div className="flex flex-wrap gap-3">
              {["VISA", "PP", "MOMO", "ZALO"].map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center justify-center w-10 h-10 bg-muted rounded text-xs font-semibold"
                >
                  {method}
                </span>
              ))}
            </div>

            <h4 className="text-sm font-medium tracking-wide mt-6">THEO DÕI</h4>
            <div className="flex gap-4">
              {[
                { href: "https://facebook.com", label: "f" },
                { href: "https://twitter.com", label: "𝕏" },
                { href: "https://instagram.com", label: "in" },
                { href: "https://youtube.com", label: "▶" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 ATELIER. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
