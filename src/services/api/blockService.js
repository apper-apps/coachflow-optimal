import { toast } from 'react-toastify'

class BlockService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'block'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "page_id" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "sort_order", sorttype: "ASC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching blocks:", error)
      toast.error("Failed to fetch blocks")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "page_id" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "created_at" } },
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
      console.error(`Error fetching block with ID ${id}:`, error)
      toast.error("Failed to fetch block")
      return null
    }
  }

  async getByPageId(pageId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "page_id" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        where: [{ FieldName: "page_id", Operator: "EqualTo", Values: [parseInt(pageId)] }],
        orderBy: [{ fieldName: "sort_order", sorttype: "ASC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching blocks by page:", error)
      return []
    }
  }

  async create(blockData) {
    try {
      const params = {
        records: [{
          Name: blockData.Name,
          page_id: parseInt(blockData.page_id),
          type: blockData.type,
          content: blockData.content,
          sort_order: blockData.sort_order || 0,
          created_at: blockData.created_at || new Date().toISOString(),
          Tags: blockData.Tags
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
          toast.success('Block created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating block:", error)
      toast.error("Failed to create block")
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
          toast.success('Block updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating block:", error)
      toast.error("Failed to update block")
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
          toast.success('Block deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting block:", error)
      toast.error("Failed to delete block")
      return false
    }
  }
}

export const blockService = new BlockService()