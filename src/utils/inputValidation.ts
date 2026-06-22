import type { KeyboardEvent } from 'react'

export function hasEdgeWhitespace(value: string) {
    return value !== value.trim()
}

export function rejectEdgeWhitespace(value: string) {
    return !hasEdgeWhitespace(value)
}

export function preventInvalidNumberInput(event: KeyboardEvent<HTMLInputElement>) {
    if (['-', '+', 'e', 'E'].includes(event.key)) {
        event.preventDefault()
    }
}

export function toNonNegativeNumberDraft(value: string) {
    if (value.startsWith('-')) return value.slice(1)
    return value.replace(/[+eE-]/g, '')
}
