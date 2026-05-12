const FALLBACK_PRODUCT = '/images/product-placeholder.webp'
const FALLBACK_AVATAR = '/images/avatar-placeholder.webp'

export function getProductImage(url: string | null | undefined): string {
    return url?.trim() || FALLBACK_PRODUCT
}

export function getAvatarImage(url: string | null | undefined): string {
    return url?.trim() || FALLBACK_AVATAR
}

export function buildImageUrl(path: string): string {
    if (!path) return FALLBACK_PRODUCT
    if (path.startsWith('http')) return path
    return `${process.env.NEXT_PUBLIC_API_URL ?? ''}${path}`
}