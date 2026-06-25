import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Wishlist | ATELIER',
    description: 'View and manage your saved items on ATELIER.',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
