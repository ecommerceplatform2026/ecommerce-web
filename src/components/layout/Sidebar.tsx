'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    Truck,
    Users,
    MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'

const navItems = [
    { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.ADMIN.PRODUCTS.INDEX, label: 'Products', icon: Package },
    { href: ROUTES.ADMIN.CATEGORIES.INDEX, label: 'Categories', icon: FolderTree },
    { href: ROUTES.ADMIN.ORDERS.INDEX, label: 'Orders', icon: ShoppingBag },
    { href: ROUTES.ADMIN.DELIVERIES.INDEX, label: 'Deliveries', icon: Truck },
    { href: ROUTES.ADMIN.USERS.INDEX, label: 'Users', icon: Users },
    { href: ROUTES.ADMIN.REVIEWS.INDEX, label: 'Reviews', icon: MessageSquare },
] as const

export function Sidebar() {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex h-full w-60 flex-col border-r border-border bg-background">
                <div className="flex h-14 items-center border-b border-border px-5">
                    <Link
                        href={ROUTES.ADMIN.DASHBOARD}
                        className="font-heading text-lg font-medium tracking-wider text-foreground"
                    >
                        Admin
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-none px-3 py-2.5 text-sm transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                                )}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Mobile bottom nav */}
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] py-1.5 text-[10px] transition-colors',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="size-5 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
