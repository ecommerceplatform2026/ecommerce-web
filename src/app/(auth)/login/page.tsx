import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

interface Props {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect: redirectTo } = await searchParams

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl md:text-5xl mb-3 tracking-tight">
          Chào mừng trở lại
        </h1>
        <p className="text-muted-foreground">
          Đăng nhập vào tài khoản để tiếp tục
        </p>
      </div>

      <LoginForm redirectTo={redirectTo} />

      <div className="mt-6 text-center space-y-4">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Quên mật khẩu?
        </Link>
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  )
}
