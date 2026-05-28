import Link from "next/link"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand information */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-tight">ATELIER</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium fashion collections for modern gentlemen.
            </p>
            <div className="space-y-3 mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  123 Nguyen Hue, District 1<br />
                  Ho Chi Minh City, Vietnam
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
                  <p>Monday - Friday: 9:00 - 21:00</p>
                  <p>Saturday - Sunday: 10:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">SHOP</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">COMPANY</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Store locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">SUPPORT</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Care guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & social */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wide">PAYMENT</h4>
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

            <h4 className="text-sm font-medium tracking-wide mt-6">FOLLOW</h4>
            <div className="flex gap-4">
              {[
                { href: "https://facebook.com", label: "f", ariaLabel: "Facebook" },
                { href: "https://twitter.com", label: "𝕏", ariaLabel: "Twitter" },
                { href: "https://instagram.com", label: "in", ariaLabel: "Instagram" },
                { href: "https://youtube.com", label: "▶", ariaLabel: "YouTube" },
              ].map(({ href, label, ariaLabel }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={ariaLabel}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 ATELIER. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
