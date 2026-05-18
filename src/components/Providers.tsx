"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { QueryClientProvider } from "@tanstack/react-query"
import { store } from "@/redux/store"
import { queryClient } from "@/lib/queryClient"
import { AuthProvider } from "./auth-provider"
import { Header } from "./header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "react-hot-toast"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Header />
                    {children}
                    <Footer />
                    <Toaster />
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    )
}
