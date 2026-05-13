import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl md:text-5xl mb-3 tracking-tight">
          Tham gia ATELIER
        </h1>
        <p className="text-muted-foreground">
          Tạo tài khoản để khám phá bộ sưu tập độc quyền
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}