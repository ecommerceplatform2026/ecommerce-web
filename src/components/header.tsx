"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart, Package, Bell, LayoutDashboard } from "lucide-react"
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
import toast from 'react-hot-toast'
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { UserRole } from "@/constants/enums"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
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
            const qs = value.trim() ? `?search=${encodeURIComponent(value.trim())}` : ''
            router.push(`${ROUTES.SHOP.PRODUCTS}${qs}`)
        }, 400)
    }, [router])

    const handleLogout = () => {
        logout()
        toast.success("See you again!")
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">

                    {/* Mobile menu button */}
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

                    {/* Desktop search */}
                    <div className="hidden md:block flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-10 h-10"
                                value={searchValue}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right icon group */}
                    <div className="flex items-center gap-2">

                        {/* Notification icon */}
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* User info icon:
                            - Guest -> go to /login
                            - Signed in -> show dropdown menu
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
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="cursor-pointer">
                                            <Package className="mr-2 h-4 w-4" />
                                            My Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === UserRole.Admin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={ROUTES.ADMIN.DASHBOARD} className="cursor-pointer">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => router.push("/login")}
                                aria-label="Sign in"
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

                        {/* Cart icon */}
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <ShoppingBag className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-medium text-background">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation mobile */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden py-6 border-t border-border">
                        <div className="flex flex-col gap-4">

                            {/* Mobile search */}
                            <div className="md:hidden mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="pl-10 h-10"
                                        value={searchValue}
                                        onChange={e => handleSearch(e.target.value)}
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

                            {/* Mobile auth: show Login/Register buttons for guests */}
                            {!user && (
                                <div className="flex gap-3 pt-2 border-t border-border">
                                    <Link
                                        href="/login"
                                        className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                    <span className="text-muted-foreground">|</span>
                                    <Link
                                        href="/register"
                                        className="text-sm tracking-wide hover:text-muted-foreground transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
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
