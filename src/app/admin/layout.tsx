import { Sidebar } from '@/components/layout/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-background pb-16 lg:pb-0">{children}</main>
        </div>
    )
}
