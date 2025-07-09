import { toast } from 'react-toastify'

class ResourceService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'resource'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "file_url" } },
          { field: { Name: "version" } },
          { field: { Name: "is_global" } },
          { field: { Name: "created_at" } },
          { field: { Name: "assignments" } },
          { field: { Name: "client_id" } },
          { field: { Name: "portal_id" } },
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
      console.error("Error fetching resources:", error)
      toast.error("Failed to fetch resources")
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
          { field: { Name: "file_url" } },
          { field: { Name: "version" } },
          { field: { Name: "is_global" } },
          { field: { Name: "created_at" } },
          { field: { Name: "assignments" } },
          { field: { Name: "client_id" } },
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
      console.error(`Error fetching resource with ID ${id}:`, error)
      toast.error("Failed to fetch resource")
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
          { field: { Name: "file_url" } },
          { field: { Name: "version" } },
          { field: { Name: "is_global" } },
          { field: { Name: "created_at" } },
          { field: { Name: "assignments" } },
          { field: { Name: "client_id" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{ fieldName: "client_id", operator: "EqualTo", values: [parseInt(clientId)] }],
              operator: "AND"
            },
            {
              conditions: [{ fieldName: "is_global", operator: "EqualTo", values: [true] }],
              operator: "AND"
            }
          ]
        }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching resources by client:", error)
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
          { field: { Name: "file_url" } },
          { field: { Name: "version" } },
          { field: { Name: "is_global" } },
          { field: { Name: "created_at" } },
          { field: { Name: "assignments" } },
          { field: { Name: "client_id" } },
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
      console.error("Error fetching resources by portal:", error)
      return []
    }
  }

  async create(resourceData) {
    try {
      const params = {
        records: [{
          Name: resourceData.Name,
          title: resourceData.title,
          description: resourceData.description,
          file_url: resourceData.file_url,
          version: resourceData.version || 1,
          is_global: resourceData.is_global || false,
          created_at: resourceData.created_at || new Date().toISOString(),
          assignments: resourceData.assignments || 0,
          client_id: resourceData.client_id ? parseInt(resourceData.client_id) : null,
          portal_id: resourceData.portal_id ? parseInt(resourceData.portal_id) : null,
          Tags: resourceData.Tags
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
          toast.success('Resource created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating resource:", error)
      toast.error("Failed to create resource")
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
          toast.success('Resource updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating resource:", error)
      toast.error("Failed to update resource")
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
          toast.success('Resource deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast.error("Failed to delete resource")
      return false
    }
  }
}

export const resourceService = new ResourceService()