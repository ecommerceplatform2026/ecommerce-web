export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Vietnamese mobile: 03x, 05x, 07x, 08x, 09x — 10 digits
export function isValidPhone(phone: string): boolean {
    return /^(0[3578])\d{8}$/.test(phone.replace(/\s/g, ''))
}

export function isValidPassword(password: string): boolean {
    return password.length >= 6
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export function isNonEmpty(value: string): boolean {
    return value.trim().length > 0
}