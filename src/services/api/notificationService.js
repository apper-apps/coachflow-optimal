import notificationData from '@/services/mockData/notifications.json'

class NotificationService {
  constructor() {
    this.notifications = [...notificationData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.notifications
  }

  async getUnread() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.notifications.filter(n => !n.is_read)
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const notification = this.notifications.find(n => n.Id === id)
    if (!notification) {
      throw new Error('Notification not found')
    }
    return notification
  }

  async create(notificationData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newNotification = {
      ...notificationData,
      Id: Math.max(...this.notifications.map(n => n.Id)) + 1,
      created_at: new Date().toISOString(),
      is_read: false
    }
    this.notifications.push(newNotification)
    return newNotification
  }

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.notifications.findIndex(n => n.Id === id)
    if (index === -1) {
      throw new Error('Notification not found')
    }
    this.notifications[index].is_read = true
    return this.notifications[index]
  }

  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, 300))
    this.notifications.forEach(n => n.is_read = true)
    return true
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.notifications.findIndex(n => n.Id === id)
    if (index === -1) {
      throw new Error('Notification not found')
    }
    this.notifications.splice(index, 1)
    return true
  }
}

export const notificationService = new NotificationService()