"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Toast } from '@/components/ui/Toast'
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/constants/routes"
import { UserRole } from "@/constants/enums"
import { rejectEdgeWhitespace } from "@/utils/inputValidation"
import type { ApiError } from "@/types/api"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(rejectEdgeWhitespace, "Email must not start or end with spaces")
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .refine(rejectEdgeWhitespace, "Password must not start or end with spaces")
    .min(8, "Password must be at least 8 characters"),
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
  const router = useRouter()
  const toastShownRef = useRef(false)

  // Only allow internal redirects to prevent open redirects
  const safeRedirect = redirectTo?.startsWith("/") ? redirectTo : "/"

  // Mark the page as mounted and navigation-ready after one tick
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Show the toast after the page is ready; useRef ensures it only appears once
  useEffect(() => {
    if (isPageReady && redirectTo && !toastShownRef.current) {
      toastShownRef.current = true
      Toast("Please sign in to continue.", 'error')
    }
  }, [isPageReady, redirectTo])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const user = await login(data.email, data.password)
      Toast("Welcome back to ATELIER.")
      if (user.role === UserRole.Admin && !redirectTo) {
        router.push(ROUTES.ADMIN.DASHBOARD)
      } else {
        router.push(safeRedirect)
      }
    } catch (err) {
      Toast((err as ApiError).message ?? 'Invalid email or password. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
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

      {/* Remember sign-in */}
      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          type="checkbox"
          {...register("rememberMe")}
          disabled={isLoading}
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
          Remember me
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
