import type { Metadata } from "next"
import { ProfileContent } from "@/components/profile/ProfileContent"

export const metadata: Metadata = {
  title: "Hồ sơ | ATELIER",
  description: "Quản lý thông tin tài khoản và voucher của bạn",
}

export default function ProfilePage() {
  return <ProfileContent />
}