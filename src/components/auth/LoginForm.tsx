"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"

const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

interface Props {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isPageReady, setIsPageReady] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const toastShownRef = useRef(false)

  // Chỉ cho phép redirect nội bộ — chống open redirect
  const safeRedirect = redirectTo?.startsWith("/") ? redirectTo : "/"

  // Đánh dấu page đã mount và navigation hoàn tất sau 1 tick
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Hiện toast sau khi page ready — useRef đảm bảo chỉ hiện đúng 1 lần
  useEffect(() => {
    if (isPageReady && redirectTo && !toastShownRef.current) {
      toastShownRef.current = true
      toast({
        title: "Bạn phải đăng nhập trước",
        description: "Vui lòng đăng nhập để tiếp tục.",
        variant: "destructive",
      })
    }
  }, [isPageReady, redirectTo, toast])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast({ title: "Đăng nhập thành công!", description: "Chào mừng bạn trở lại ATELIER." })
      router.push(safeRedirect)
    } catch {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
          className="h-12"
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Mật khẩu */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none">
          Mật khẩu
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            {...register("password")}
            className="h-12 pr-10"
            disabled={isLoading}
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Ghi nhớ đăng nhập */}
      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          type="checkbox"
          {...register("rememberMe")}
          disabled={isLoading}
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
          Ghi nhớ đăng nhập
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isLoading}
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  )
}
