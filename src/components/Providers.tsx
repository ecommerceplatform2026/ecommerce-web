"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "@/redux/store"
import { AuthProvider } from "./auth-provider"
import { CartProvider } from "./cart-provider"
import { WishlistProvider } from "./wishlist-provider"
import { Header } from "./header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/Toaster"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Header />
                        {children}
                        <Footer />
                        <Toaster />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </Provider>
    )
}
