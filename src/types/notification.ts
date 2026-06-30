export type NotificationType = 'order' | 'points' | 'system' | 'promo'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
}
