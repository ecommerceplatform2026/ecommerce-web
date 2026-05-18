"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"
import type { ApiError } from "@/types/api"

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Họ và tên không được để trống").min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu không được để trống").min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      toast.success("Chào mừng bạn đến với ATELIER.")
      router.push("/")
    } catch (err) {
      toast.error((err as ApiError).message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Họ và tên */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium leading-none">
          Họ và tên
        </label>
        <Input
          id="fullName"
          type="text"
          placeholder="Nguyễn Văn A"
          {...register("fullName")}
          className="h-12"
          disabled={isLoading}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

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
            placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
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

      {/* Xác nhận mật khẩu */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            {...register("confirmPassword")}
            className="h-12 pr-10"
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Điều khoản */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register("acceptTerms")}
            disabled={isLoading}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer shrink-0"
          />
          <label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed cursor-pointer">
            Tôi đồng ý với{" "}
            <a href="/terms" className="underline hover:text-muted-foreground transition-colors">
              điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="/privacy" className="underline hover:text-muted-foreground transition-colors">
              chính sách bảo mật
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isLoading}
      >
        {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  )
}
