import { toast } from 'react-toastify'

class DeliverableService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'deliverable'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "submitted_at" } },
          { field: { Name: "file_url" } },
          { field: { Name: "comments" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_id" } },
          { field: { Name: "coach_id" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "submitted_at", sorttype: "DESC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching deliverables:", error)
      toast.error("Failed to fetch deliverables")
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
          { field: { Name: "status" } },
          { field: { Name: "submitted_at" } },
          { field: { Name: "file_url" } },
          { field: { Name: "comments" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_id" } },
          { field: { Name: "coach_id" } },
          { field: { Name: "portal_id" } },
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
      console.error(`Error fetching deliverable with ID ${id}:`, error)
      toast.error("Failed to fetch deliverable")
      return null
    }
  }

  async getByClientId(clientId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "submitted_at" } },
          { field: { Name: "file_url" } },
          { field: { Name: "comments" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_id" } },
          { field: { Name: "coach_id" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "Tags" } }
        ],
        where: [{ FieldName: "client_id", Operator: "EqualTo", Values: [parseInt(clientId)] }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching deliverables by client:", error)
      return []
    }
  }

  async getByPortalId(portalId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "submitted_at" } },
          { field: { Name: "file_url" } },
          { field: { Name: "comments" } },
          { field: { Name: "client_name" } },
          { field: { Name: "client_id" } },
          { field: { Name: "coach_id" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "Tags" } }
        ],
        where: [{ FieldName: "portal_id", Operator: "EqualTo", Values: [parseInt(portalId)] }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching deliverables by portal:", error)
      return []
    }
  }

  async create(deliverableData) {
    try {
      const params = {
        records: [{
          Name: deliverableData.Name,
          title: deliverableData.title,
          description: deliverableData.description,
          status: deliverableData.status || 'submitted',
          submitted_at: deliverableData.submitted_at || new Date().toISOString(),
          file_url: deliverableData.file_url,
          comments: deliverableData.comments || 0,
          client_name: deliverableData.client_name,
          client_id: parseInt(deliverableData.client_id),
          coach_id: parseInt(deliverableData.coach_id),
          portal_id: deliverableData.portal_id ? parseInt(deliverableData.portal_id) : null,
          Tags: deliverableData.Tags
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
          toast.success('Deliverable created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating deliverable:", error)
      toast.error("Failed to create deliverable")
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
          toast.success('Deliverable updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating deliverable:", error)
      toast.error("Failed to update deliverable")
      return null
    }
  }

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status: status
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
          toast.success('Deliverable status updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating deliverable status:", error)
      toast.error("Failed to update deliverable status")
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
          toast.success('Deliverable deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting deliverable:", error)
      toast.error("Failed to delete deliverable")
      return false
    }
  }
}

export const deliverableService = new DeliverableService()