import { useState, useEffect, useCallback } from 'react'
import type { AppNotification, NotificationType } from '@/types/notification'

const STORAGE_KEY = 'app_notifications'
const SEEN_PREFIX = 'notified_seen_'
const MAX_ITEMS = 50

function load(): AppNotification[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AppNotification[]
  } catch {
    return []
  }
}

function save(items: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage full or unavailable
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(load)

  useEffect(() => {
    save(notifications)
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const add = useCallback((type: NotificationType, title: string, message: string, link?: string) => {
    const item: AppNotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    }
    setNotifications((prev) => [item, ...prev].slice(0, MAX_ITEMS))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  function markSeen(key: string) {
    try {
      localStorage.setItem(`${SEEN_PREFIX}${key}`, '1')
    } catch {
      // ignore
    }
  }

  function hasSeen(key: string): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(`${SEEN_PREFIX}${key}`)
  }

  return { notifications, unreadCount, add, markRead, markAllRead, markSeen, hasSeen }
}
