import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`mb-6 ${className ?? ""}`}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm lg:text-lg text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={item.label + index} className="flex items-center gap-1.5">
                            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                            {item.href && !isLast ? (
                                <Link href={item.href} className="transition-colors hover:text-foreground">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={isLast ? "text-foreground font-medium" : ""}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
