import { toast } from 'react-toastify'

class NotificationService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'app_Notification'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "ref_id" } },
          { field: { Name: "message" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to fetch notifications")
      return []
    }
  }

  async getUnread() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "ref_id" } },
          { field: { Name: "message" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } }
        ],
        where: [{ FieldName: "is_read", Operator: "EqualTo", Values: [false] }],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching unread notifications:", error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "ref_id" } },
          { field: { Name: "message" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching notification with ID ${id}:`, error)
      toast.error("Failed to fetch notification")
      return null
    }
  }

  async create(notificationData) {
    try {
      const params = {
        records: [{
          Name: notificationData.Name,
          type: notificationData.type,
          ref_id: notificationData.ref_id,
          message: notificationData.message,
          is_read: notificationData.is_read || false,
          created_at: notificationData.created_at || new Date().toISOString(),
          user_id: parseInt(notificationData.user_id),
          Tags: notificationData.Tags
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Notification created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating notification:", error)
      toast.error("Failed to create notification")
      return null
    }
  }

  async markAsRead(id) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          is_read: true
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
      return null
    }
  }

  async markAllAsRead() {
    try {
      // First get all unread notifications
      const unreadNotifications = await this.getUnread()
      
      if (unreadNotifications.length === 0) {
        return true
      }
      
      // Mark all as read
      const params = {
        records: unreadNotifications.map(notification => ({
          Id: parseInt(notification.Id),
          is_read: true
        }))
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('All notifications marked as read')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
      return false
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Notification deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
      return false
    }
  }
}

export const notificationService = new NotificationService()