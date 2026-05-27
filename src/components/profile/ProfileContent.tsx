"use client"

import type React from "react"
import { useRef, useState } from "react"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Lock,
    AtSign,
    ShieldCheck,
    Camera,
    Plus,
    Star,
    Home,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Spinner } from "@/components/ui/Spinner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Modal"
import Image from "next/image"
import toast from 'react-hot-toast'
import { useProfile } from "@/hooks/useProfile"
import { formatDate } from "@/utils/formatDate"
import { UserStatus } from "@/constants/enums"
import type { ApiError } from "@/types/api"

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(-2)
        .join("")
        .toUpperCase()
}

function statusConfig(status: UserStatus) {
    switch (status) {
        case UserStatus.Active:
            return { label: "Hoạt động", className: "bg-green-500 hover:bg-green-600" }
        case UserStatus.Inactive:
            return { label: "Không hoạt động", className: "bg-gray-400 hover:bg-gray-500" }
        case UserStatus.Banned:
            return { label: "Bị khoá", className: "bg-destructive hover:bg-destructive/90" }
    }
}

export function ProfileContent() {
    const { profile, address, isLoading, isUpdating, isUploadingAvatar, error, updateProfile, uploadAvatar } =
        useProfile()

    const avatarInputRef = useRef<HTMLInputElement>(null)

    const [editFormData, setEditFormData] = useState({
        fullName: "",
        username: "",
        phoneNumber: "",
        dateOfBirth: "",
    })
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

    const openEditDialog = () => {
        if (!profile) return
        setEditFormData({
            fullName: profile.fullName ?? "",
            username: profile.username ?? "",
            phoneNumber: profile.phoneNumber ?? "",
            dateOfBirth: profile.dateOfBirth ?? "",
        })
        setIsEditDialogOpen(true)
    }

    const handleEditProfileSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!editFormData.fullName.trim()) {
            toast.error("Vui lòng điền họ và tên.")
            return
        }
        try {
            await updateProfile({
                fullName: editFormData.fullName.trim(),
                username: editFormData.username.trim() || undefined,
                phoneNumber: editFormData.phoneNumber.trim() || undefined,
                dateOfBirth: editFormData.dateOfBirth || undefined,
            })
            toast.success("Thông tin cá nhân đã được cập nhật.")
            setIsEditDialogOpen(false)
        } catch (err) {
            const apiError = err as ApiError
            toast.error(apiError.message ?? "Đã xảy ra lỗi, vui lòng thử lại.")
        }
    }

    const handleChangePasswordSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin mật khẩu.")
            return
        }
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.")
            return
        }
        // TODO: kết nối API đổi mật khẩu khi backend hỗ trợ endpoint
        toast.success("Mật khẩu của bạn đã được cập nhật.")
        setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setIsPasswordDialogOpen(false)
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh.")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh tối đa 5 MB.")
            return
        }
        try {
            await uploadAvatar(file)
            toast.success("Cập nhật ảnh đại diện thành công")
        } catch (err) {
            const apiError = err as ApiError
            toast.error(apiError.message ?? "Đã xảy ra lỗi, vui lòng thử lại.")
        }
        e.target.value = ""
    }

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="py-16 px-4 lg:px-8">
                <div className="container mx-auto max-w-4xl space-y-6">
                    <div className="flex items-center gap-5">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="py-16 px-4 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <EmptyState title="Không thể tải thông tin" description={error} />
                </div>
            </div>
        )
    }

    if (!profile) return null

    const status = statusConfig(profile.status)

    return (
        <div className="py-16 px-4 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-5">
                    <div className="relative shrink-0">
                        {profile.avatarUrl ? (
                            <Image
                                src={profile.avatarUrl}
                                alt={profile.fullName}
                                width={80}
                                height={80}
                                className="h-20 w-20 rounded-full object-cover border border-border"
                            />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-semibold text-muted-foreground border border-border">
                                {getInitials(profile.fullName)}
                            </div>
                        )}
                        <button
                            type="button"
                            aria-label="Thay đổi ảnh đại diện"
                            disabled={isUploadingAvatar}
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {isUploadingAvatar ? (
                                <Spinner size="sm" className="text-primary-foreground" />
                            ) : (
                                <Camera className="h-3.5 w-3.5" />
                            )}
                        </button>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl mb-1 tracking-tight">
                            {profile.fullName}
                        </h1>
                        {profile.username && (
                            <p className="text-muted-foreground">@{profile.username}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Thông tin cá nhân */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Thông tin cá nhân
                            </CardTitle>
                            <CardDescription>Thông tin tài khoản của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5" />
                                        Họ và tên
                                    </Label>
                                    <p className="text-base font-medium">{profile.fullName}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <AtSign className="h-3.5 w-3.5" />
                                        Tên người dùng
                                    </Label>
                                    <p className="text-base font-medium">
                                        {profile.username ? `@${profile.username}` : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" />
                                        Email
                                    </Label>
                                    <p className="text-base font-medium">{profile.email}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5" />
                                        Số điện thoại
                                    </Label>
                                    <p className="text-base font-medium">{profile.phoneNumber ?? "—"}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Ngày sinh
                                    </Label>
                                    <p className="text-base font-medium">
                                        {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "—"}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Trạng thái tài khoản
                                    </Label>
                                    <Badge className={status.className}>{status.label}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Địa chỉ giao hàng */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Địa chỉ giao hàng
                            </CardTitle>
                            <CardDescription>Địa chỉ nhận hàng mặc định</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {address ? (
                                <div className="p-4 border border-border rounded-lg flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <Home className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm">{address.receiverName}</p>
                                                <span className="text-muted-foreground text-sm">·</span>
                                                <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {[address.addressLine, address.ward, address.district, address.province]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 flex items-center gap-1 text-xs">
                                        <Star className="h-3 w-3" />
                                        Mặc định
                                    </Badge>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<MapPin />}
                                    title="Chưa có địa chỉ giao hàng"
                                    description="Thêm địa chỉ để thanh toán nhanh hơn."
                                    action={
                                        <Button variant="outline" size="sm" className="bg-transparent" disabled>
                                            <Plus className="h-4 w-4" />
                                            Thêm địa chỉ
                                        </Button>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Thao tác tài khoản */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thao tác tài khoản</CardTitle>
                            <CardDescription>Chỉnh sửa thông tin và bảo mật</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            {/* Dialog chỉnh sửa hồ sơ */}
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="bg-transparent"
                                        onClick={openEditDialog}
                                    >
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                                        <DialogDescription>
                                            Cập nhật thông tin cá nhân của bạn
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-fullName">Họ và tên</Label>
                                            <Input
                                                id="edit-fullName"
                                                value={editFormData.fullName}
                                                onChange={(e) =>
                                                    setEditFormData({ ...editFormData, fullName: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-username">Tên người dùng</Label>
                                            <Input
                                                id="edit-username"
                                                value={editFormData.username}
                                                onChange={(e) =>
                                                    setEditFormData({ ...editFormData, username: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-phone">Số điện thoại</Label>
                                            <Input
                                                id="edit-phone"
                                                value={editFormData.phoneNumber}
                                                onChange={(e) =>
                                                    setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-dob">Ngày sinh</Label>
                                            <Input
                                                id="edit-dob"
                                                type="date"
                                                value={editFormData.dateOfBirth}
                                                onChange={(e) =>
                                                    setEditFormData({ ...editFormData, dateOfBirth: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Email</Label>
                                            <p className="text-sm px-3 py-2 border border-border rounded-md bg-secondary/40 text-muted-foreground">
                                                {profile.email}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Email không thể thay đổi.
                                            </p>
                                        </div>
                                        <div className="flex gap-2 justify-end pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsEditDialogOpen(false)}
                                            >
                                                Huỷ
                                            </Button>
                                            <Button type="submit" disabled={isUpdating}>
                                                {isUpdating && (
                                                    <Spinner size="sm" className="mr-1.5" />
                                                )}
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Dialog đổi mật khẩu */}
                            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-transparent">
                                        Đổi mật khẩu
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Lock className="h-5 w-5" />
                                            Đổi mật khẩu
                                        </DialogTitle>
                                        <DialogDescription>
                                            Cập nhật mật khẩu tài khoản của bạn
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwordFormData.currentPassword}
                                                onChange={(e) =>
                                                    setPasswordFormData({
                                                        ...passwordFormData,
                                                        currentPassword: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwordFormData.newPassword}
                                                onChange={(e) =>
                                                    setPasswordFormData({
                                                        ...passwordFormData,
                                                        newPassword: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwordFormData.confirmPassword}
                                                onChange={(e) =>
                                                    setPasswordFormData({
                                                        ...passwordFormData,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsPasswordDialogOpen(false)}
                                            >
                                                Huỷ
                                            </Button>
                                            <Button type="submit">Đổi mật khẩu</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
