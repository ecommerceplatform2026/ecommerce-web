import { useCallback, useState } from "react"

const FALLBACK_PRODUCT = "/placeholder.svg"

export function getProductImage(url: string | null | undefined): string {
    return url?.trim() || FALLBACK_PRODUCT
}

export function buildImageUrl(path: string): string {
    if (!path) return FALLBACK_PRODUCT
    if (path.startsWith("http")) return path
    return `${process.env.NEXT_PUBLIC_API_URL ?? ""}${path}`
}

export function useImageErrorFallback(src: string) {
    const [imgSrc, setImgSrc] = useState(src)
    const onError = useCallback(() => setImgSrc(FALLBACK_PRODUCT), [])
    return [imgSrc, onError] as const
}