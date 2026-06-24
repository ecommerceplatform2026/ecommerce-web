import type { Metadata } from "next"
import { LoyaltyPageContent } from "@/components/loyalty/LoyaltyPageContent"

export const metadata: Metadata = {
    title: "Loyalty Points | ATELIER",
    description: "Learn about loyalty points, how to earn and redeem them, and view your transaction history.",
}

export default function LoyaltyPage() {
    return <LoyaltyPageContent />
}
