import type { Metadata } from "next"
import { ProfileContent } from "@/components/profile/ProfileContent"

export const metadata: Metadata = {
  title: "Profile | ATELIER",
  description: "Manage your account information and vouchers",
}

export default function ProfilePage() {
  return <ProfileContent />
}
