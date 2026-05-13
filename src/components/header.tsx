"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart, Package, Bell } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const handleLogout = () => {
        logout()
        toast({ title: "Đăng xuất thành công", description: "Hẹn gặp lại bạn!" })
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">

                    {/* Nút mở menu mobile */}
                    <button
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="font-serif text-2xl tracking-tight">
                        ATELIER
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/products" className="text-sm tracking-wide hover:text-muted-foreground transition-colors">
                            SHOP
                        </Link>
                        <Link href="/collections" className="text-sm tracking-wide hover:text-muted-foreground transition-colors">
                            COLLECTIONS
                        </Link>
                        <Link href="/about" className="text-sm tracking-wide hover:text-muted-foreground transition-colors">
                            ABOUT
                        </Link>
                    </nav>

                    {/* Thanh tìm kiếm desktop */}
                    <div className="hidden md:block flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pl-10 h-10"
                            />
                        </div>
                    </div>

                    {/* Nhóm icon bên phải */}
                    <div className="flex items-center gap-2">

                        {/* Icon thông báo */}
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* Icon thông tin người dùng:
                            - Chưa đăng nhập → chuyển đến trang /login
                            - Đã đăng nhập    → hiện dropdown menu
                        */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.fullName}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            Thông tin cá nhân
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="cursor-pointer">
                                            <Package className="mr-2 h-4 w-4" />
                                            Đơn hàng của tôi
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => router.push("/login")}
                                aria-label="Đăng nhập"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        )}

                        {/* Icon wishlist */}
                        <Link href="/wishlist">
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Icon giỏ hàng */}
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <ShoppingBag className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation mobile */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden py-6 border-t border-border">
                        <div className="flex flex-col gap-4">

                            {/* Thanh tìm kiếm mobile */}
                            <div className="md:hidden mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="pl-10 h-10"
                                    />
                                </div>
                            </div>

                            <Link
                                href="/products"
                                className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                SHOP
                            </Link>
                            <Link
                                href="/collections"
                                className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                COLLECTIONS
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                ABOUT
                            </Link>

                            {/* Auth mobile: hiện nút Login/Register nếu chưa đăng nhập */}
                            {!user && (
                                <div className="flex gap-3 pt-2 border-t border-border">
                                    <Link
                                        href="/login"
                                        className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </Link>
                                    <span className="text-muted-foreground">|</span>
                                    <Link
                                        href="/register"
                                        className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}