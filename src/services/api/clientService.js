import { toast } from 'react-toastify'

class ClientService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'client'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "last_login" } },
          { field: { Name: "created_at" } },
          { field: { Name: "open_deliverables" } },
          { field: { Name: "total_deliverables" } },
          { field: { Name: "phone" } },
          { field: { Name: "timezone" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast.error("Failed to fetch clients")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "last_login" } },
          { field: { Name: "created_at" } },
          { field: { Name: "open_deliverables" } },
          { field: { Name: "total_deliverables" } },
          { field: { Name: "phone" } },
          { field: { Name: "timezone" } },
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
      console.error(`Error fetching client with ID ${id}:`, error)
      toast.error("Failed to fetch client")
      return null
    }
  }

  async create(clientData) {
    try {
      const params = {
        records: [{
          Name: clientData.Name,
          email: clientData.email,
          status: clientData.status || 'active',
          phone: clientData.phone,
          timezone: clientData.timezone,
          Tags: clientData.Tags,
          open_deliverables: clientData.open_deliverables || 0,
          total_deliverables: clientData.total_deliverables || 0,
          created_at: new Date().toISOString()
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
          toast.success('Client created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error("Failed to create client")
      return null
    }
  }

  async update(id, updates) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...updates
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
          toast.success('Client updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client")
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
          toast.success('Client deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client")
      return false
    }
  }
}

export const clientService = new ClientService()