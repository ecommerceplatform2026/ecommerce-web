"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart, Package, Bell, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { productService } from "@/services/productService"
import type { Product } from "@/types/product"

function SearchSuggestions({ results, query, onClose }: {
    results: Product[]
    query: string
    onClose: () => void
}) {
    if (results.length === 0) return null

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

    return (
        <div className="bg-background border border-border shadow-lg">
            <div className="divide-y divide-border">
                {results.slice(0, 6).map((product) => (
                    <Link
                        key={product.id}
                        href={ROUTES.SHOP.PRODUCT_DETAIL(product.id)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors min-h-[44px]"
                        onClick={onClose}
                    >
                        <div className="relative h-10 w-10 flex-shrink-0 bg-muted overflow-hidden">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                                    N/A
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatPrice(product.basePrice)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link
                href={`${ROUTES.SHOP.PRODUCTS}?search=${encodeURIComponent(query.trim())}`}
                className="block px-4 py-3 text-sm font-medium text-center border-t border-border hover:bg-muted transition-colors min-h-[44px] leading-none"
                onClick={onClose}
            >
                See more...
            </Link>
        </div>
    )
}

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [showResults, setShowResults] = useState(false)
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
    const [badgePulse, setBadgePulse] = useState(false)

    const prevItemCount = useRef(itemCount)
    // Pulse cart badge only when itemCount increases
    useEffect(() => {
        if (itemCount > prevItemCount.current) {
            setBadgePulse(true)
            const id = setTimeout(() => setBadgePulse(false), 400)
            return () => clearTimeout(id)
        }
        prevItemCount.current = itemCount
    }, [itemCount])
    const router = useRouter()
    const pathname = usePathname()
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const desktopInputRef = useRef<HTMLInputElement>(null)
    const mobileInputRef = useRef<HTMLInputElement>(null)
    const drawerInputRef = useRef<HTMLInputElement>(null)
    const desktopPanelRef = useRef<HTMLDivElement>(null)
    const mobilePanelRef = useRef<HTMLDivElement>(null)
    const drawerPanelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const id = setTimeout(() => {
            setMobileSearchOpen(false)
            setMobileMenuOpen(false)
            setShowResults(false)
            if (!pathname.startsWith('/products')) {
                setSearchValue('')
            }
        }, 0)
        return () => clearTimeout(id)
    }, [pathname])

    // Lock body scroll when mobile drawer is open to prevent background scrolling
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    // Debounced API search for suggestions
    useEffect(() => {
        const trimmed = searchValue.trim()
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)

        if (!trimmed) {
            searchDebounceRef.current = setTimeout(() => {
                setSearchResults([])
                setShowResults(false)
            })
            return
        }

        searchDebounceRef.current = setTimeout(async () => {
            try {
                const res = await productService.search({ search: trimmed, pageSize: 6 })
                setSearchResults(res.items)
                setShowResults(true)
            } catch {
                // Silently fail — suggestions are optional
            }
        }, 1500)

        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
        }
    }, [searchValue])

    // Close results panel on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            if (
                (desktopPanelRef.current && !desktopPanelRef.current.contains(target)) &&
                (mobilePanelRef.current && !mobilePanelRef.current.contains(target)) &&
                (drawerPanelRef.current && !drawerPanelRef.current.contains(target))
            ) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const submitSearch = useCallback((value: string) => {
        const qs = value.trim() ? `?search=${encodeURIComponent(value.trim())}` : ''
        router.push(`${ROUTES.SHOP.PRODUCTS}${qs}`)
        setShowResults(false)
    }, [router])

    const handleLogout = () => {
        logout()
        toast.success("See you again!")
        router.push("/login")
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-4">

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden min-h-[44px] min-w-9 flex items-center justify-center"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="font-serif text-xl md:text-2xl tracking-tight">
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
                        <div className="hidden md:block flex-1 max-w-md relative">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { submitSearch(searchValue); desktopInputRef.current?.blur() }}
                                    className="absolute left-0 top-0 bottom-0 flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer"
                                    aria-label="Search"
                                >
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <Input
                                    ref={desktopInputRef}
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-12 h-10"
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { submitSearch(searchValue); desktopInputRef.current?.blur() } }}
                                />
                            </div>
                            {showResults && searchResults.length > 0 && (
                                <div ref={desktopPanelRef} className="absolute top-full left-0 right-0 mt-1 z-50">
                                    <SearchSuggestions
                                        results={searchResults}
                                        query={searchValue}
                                        onClose={() => setShowResults(false)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right icon group */}
                        <div className="flex items-center gap-0.5 md:gap-2">

                            {/* Mobile search toggle */}
                            <button
                                className="md:hidden min-h-[44px] min-w-9 flex items-center justify-center"
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                aria-label="Toggle search"
                            >
                                {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </button>

                            {/* Notification icon */}
                            <Button variant="ghost" size="icon" className="relative cursor-pointer min-h-[44px]">
                                <Bell className="h-5 w-5" />
                            </Button>

                            {/* User info icon:
                                - Guest -> go to /login
                                - Signed in -> show dropdown menu
                            */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="cursor-pointer min-h-[44px]">
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
                                    className="cursor-pointer min-h-[44px]"
                                    onClick={() => router.push("/login")}
                                    aria-label="Sign in"
                                >
                                    <User className="h-5 w-5" />
                                </Button>
                            )}

                            {/* Icon wishlist */}
                            <Link href="/wishlist">
                                <Button variant="ghost" size="icon" className="relative cursor-pointer min-h-[44px]">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* Cart icon */}
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative cursor-pointer min-h-[44px] min-w-[44px]">
                                    <ShoppingBag className="h-5 w-5" />
                                    {itemCount > 0 && (
                                            <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-medium text-background ${badgePulse ? 'animate-pulse' : ''}`}>
                                            {itemCount > 99 ? '99+' : itemCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile search overlay */}
                    {mobileSearchOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setMobileSearchOpen(false)} />
                            <div className="absolute left-0 right-0 top-full border-t border-border bg-background px-4 py-3 shadow-lg z-50">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { submitSearch(searchValue); setMobileSearchOpen(false); mobileInputRef.current?.blur() }}
                                        className="absolute left-0 top-0 bottom-0 flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer"
                                        aria-label="Search"
                                    >
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <Input
                                        ref={mobileInputRef}
                                        type="search"
                                        placeholder="Search products..."
                                        className="pl-12 h-12 w-full"
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { submitSearch(searchValue); setMobileSearchOpen(false); mobileInputRef.current?.blur() } }}
                                        autoFocus
                                    />
                                </div>
                                {showResults && searchResults.length > 0 && (
                                    <div ref={mobilePanelRef} className="mt-1">
                                        <SearchSuggestions
                                            results={searchResults}
                                            query={searchValue}
                                            onClose={() => { setShowResults(false); setMobileSearchOpen(false) }}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Mobile drawer - outside header to avoid backdrop-filter fixed positioning bug */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background shadow-xl">
                        <div className="flex h-20 items-center justify-between px-4 border-b border-border">
                            <Link href="/" className="font-serif text-2xl tracking-tight" onClick={() => setMobileMenuOpen(false)}>
                                ATELIER
                            </Link>
                            <button
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 px-4 py-8 overflow-y-auto" style={{ height: "calc(100% - 5rem)" }}>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { submitSearch(searchValue); setMobileMenuOpen(false); drawerInputRef.current?.blur() }}
                                    className="absolute left-0 top-0 bottom-0 flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer"
                                    aria-label="Search"
                                >
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <Input
                                    ref={drawerInputRef}
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-12 h-12"
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { submitSearch(searchValue); setMobileMenuOpen(false); drawerInputRef.current?.blur() } }}
                                />
                            </div>
                            {showResults && searchResults.length > 0 && (
                                <div ref={drawerPanelRef} className="mt-1">
                                    <SearchSuggestions
                                        results={searchResults}
                                        query={searchValue}
                                        onClose={() => setShowResults(false)}
                                    />
                                </div>
                            )}

                            <nav className="flex flex-col gap-1">
                                <Link
                                    href="/products"
                                    className="text-base tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center border-b border-border"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    SHOP
                                </Link>
                                <Link
                                    href="/collections"
                                    className="text-base tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center border-b border-border"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-base tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center border-b border-border"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ABOUT
                                </Link>
                            </nav>

                            {!user && (
                                <div className="flex flex-col gap-3 pt-4">
                                    <Button asChild size="lg" className="h-14 w-full text-base">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Sign in
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-14 w-full text-base bg-transparent">
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            Register
                                        </Link>
                                    </Button>
                                </div>
                            )}
                            {user && (
                                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                    <Link
                                        href="/profile"
                                        className="text-sm tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User className="mr-3 h-5 w-5" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="text-sm tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                    <Package className="mr-3 h-5 w-5" />
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/cart"
                                            className="text-sm tracking-wide py-3 hover:text-muted-foreground transition-colors min-h-[44px] flex items-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <ShoppingBag className="mr-3 h-5 w-5" />
                                            Cart
                                            {itemCount > 0 && (
                                                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-medium text-background">
                                                    {itemCount > 99 ? '99+' : itemCount}
                                                </span>
                                            )}
                                        </Link>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                                        className="text-sm tracking-wide py-3 text-destructive hover:text-destructive/80 transition-colors min-h-[44px] flex items-center text-left"
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
