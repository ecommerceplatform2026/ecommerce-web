"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart, Package, Bell } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const { user, logout } = useAuth()
    const router = useRouter()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const qs = value.trim() ? `?search=${encodeURIComponent(value.trim())}` : ""
            router.push(`${ROUTES.SHOP.PRODUCTS}${qs}`)
        }, 400)
    }, [router])

    const handleLogout = () => {
        logout()
        toast.success("Hẹn gặp lại bạn!")
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    <button
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    <Link href="/" className="font-serif text-2xl tracking-tight">
                        ATELIER
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        <Link href="/products" className="text-sm tracking-wide transition-colors hover:text-muted-foreground">
                            SHOP
                        </Link>
                        <Link href="/collections" className="text-sm tracking-wide transition-colors hover:text-muted-foreground">
                            COLLECTIONS
                        </Link>
                        <Link href="/about" className="text-sm tracking-wide transition-colors hover:text-muted-foreground">
                            ABOUT
                        </Link>
                    </nav>

                    <div className="hidden max-w-md flex-1 md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="h-10 pl-10"
                                value={searchValue}
                                onChange={event => handleSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <Bell className="h-5 w-5" />
                        </Button>

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

                        <Link href="/wishlist">
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <ShoppingBag className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="border-t border-border py-6 lg:hidden">
                        <div className="flex flex-col gap-4">
                            <div className="mb-4 md:hidden">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="h-10 pl-10"
                                        value={searchValue}
                                        onChange={event => handleSearch(event.target.value)}
                                    />
                                </div>
                            </div>

                            <Link
                                href="/products"
                                className="text-sm tracking-wide transition-colors hover:text-muted-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                SHOP
                            </Link>
                            <Link
                                href="/collections"
                                className="text-sm tracking-wide transition-colors hover:text-muted-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                COLLECTIONS
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm tracking-wide transition-colors hover:text-muted-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                ABOUT
                            </Link>

                            {!user && (
                                <div className="flex gap-3 border-t border-border pt-2">
                                    <Link
                                        href="/login"
                                        className="text-sm tracking-wide transition-colors hover:text-muted-foreground"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </Link>
                                    <span className="text-muted-foreground">|</span>
                                    <Link
                                        href="/register"
                                        className="text-sm tracking-wide transition-colors hover:text-muted-foreground"
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
