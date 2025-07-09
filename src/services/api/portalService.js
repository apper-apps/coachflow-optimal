import { toast } from 'react-toastify'

class PortalService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'portal'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "is_active" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "owner_id" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "title", sorttype: "ASC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching portals:", error)
      toast.error("Failed to fetch portals")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "is_active" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "owner_id" } },
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
      console.error(`Error fetching portal with ID ${id}:`, error)
      toast.error("Failed to fetch portal")
      return null
    }
  }

  async getByOwnerId(ownerId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "is_active" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "owner_id" } },
          { field: { Name: "Tags" } }
        ],
        where: [{ FieldName: "owner_id", Operator: "EqualTo", Values: [parseInt(ownerId)] }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching portals by owner:", error)
      return []
    }
  }

  async create(portalData) {
    try {
      const params = {
        records: [{
          Name: portalData.Name,
          title: portalData.title,
          description: portalData.description,
          is_active: portalData.is_active !== undefined ? portalData.is_active : true,
          created_at: portalData.created_at || new Date().toISOString(),
          updated_at: portalData.updated_at || new Date().toISOString(),
          owner_id: parseInt(portalData.owner_id),
          Tags: portalData.Tags
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
          toast.success('Portal created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating portal:", error)
      toast.error("Failed to create portal")
      return null
    }
  }

  async update(id, updates) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...updates,
          updated_at: new Date().toISOString()
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
          toast.success('Portal updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating portal:", error)
      toast.error("Failed to update portal")
      return null
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
          toast.success('Portal deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting portal:", error)
      toast.error("Failed to delete portal")
      return false
    }
  }

  async setActive(id, isActive) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          is_active: isActive,
          updated_at: new Date().toISOString()
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
          toast.success('Portal status updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating portal status:", error)
      toast.error("Failed to update portal status")
      return null
    }
  }
}

export const portalService = new PortalService()