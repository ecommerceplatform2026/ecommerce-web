"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, ShoppingBag, Star, Tag, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/useNotifications"
import type { NotificationType } from "@/types/notification"

const typeConfig: Record<NotificationType, { icon: typeof Bell; bg: string }> = {
    order: { icon: ShoppingBag, bg: "bg-blue-100 text-blue-700" },
    points: { icon: Star, bg: "bg-amber-100 text-amber-700" },
    system: { icon: Info, bg: "bg-gray-100 text-gray-700" },
    promo: { icon: Tag, bg: "bg-purple-100 text-purple-700" },
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
}

type DateBucket = "Today" | "Yesterday" | "This month" | "Older"

function dateBucket(iso: string): DateBucket {
    const d = new Date(iso)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    if (d >= today) return "Today"
    if (d >= yesterday) return "Yesterday"
    if (d >= startOfMonth) return "This month"
    return "Older"
}

const BUCKET_ORDER: DateBucket[] = ["Today", "Yesterday", "This month", "Older"]

export function NotificationBell() {
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

    const grouped = React.useMemo(() => {
        const map = new Map<DateBucket, typeof notifications>()
        for (const bucket of BUCKET_ORDER) map.set(bucket, [])
        for (const n of notifications) {
            const bucket = dateBucket(n.timestamp)
            map.get(bucket)?.push(n)
        }
        return BUCKET_ORDER.filter((b) => (map.get(b)?.length ?? 0) > 0).map((b) => ({
            label: b,
            items: map.get(b)!,
        }))
    }, [notifications])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer min-h-[44px]">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-medium text-background">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 px-4">
                        <Bell className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                ) : (
                    <>
                        <div className="max-h-[480px] overflow-y-auto">
                            {grouped.map((group) => (
                                <React.Fragment key={group.label}>
                                    <div className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                        {group.label}
                                    </div>
                                    {group.items.map((n) => {
                                        const cfg = typeConfig[n.type] ?? typeConfig.system
                                        const Icon = cfg.icon
                                        const content = (
                                            <div
                                                className={cn(
                                                    "flex items-start gap-3 px-3 py-2.5 cursor-pointer",
                                                    "transition-colors hover:bg-muted",
                                                    !n.read && "bg-muted/50",
                                                )}
                                                onClick={() => markRead(n.id)}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                                        cfg.bg,
                                                    )}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm", !n.read && "font-semibold")}>
                                                        {n.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                                        {timeAgo(n.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                        return n.link ? (
                                            <Link key={n.id} href={n.link} className="block">
                                                {content}
                                            </Link>
                                        ) : (
                                            <div key={n.id}>{content}</div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                        {unreadCount > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <div className="p-1">
                                    <button
                                        onClick={markAllRead}
                                        className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
