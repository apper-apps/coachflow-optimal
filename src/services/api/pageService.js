import { toast } from 'react-toastify'

class PageService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'page'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "is_visible" } },
          { field: { Name: "created_at" } },
          { field: { Name: "block_count" } },
          { field: { Name: "client_id" } },
          { field: { Name: "portal_id" } },
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
      console.error("Error fetching pages:", error)
      toast.error("Failed to fetch pages")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "is_visible" } },
          { field: { Name: "created_at" } },
          { field: { Name: "block_count" } },
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
      console.error(`Error fetching page with ID ${id}:`, error)
      toast.error("Failed to fetch page")
      return null
    }
  }

  async getByClientId(clientId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "is_visible" } },
          { field: { Name: "created_at" } },
          { field: { Name: "block_count" } },
          { field: { Name: "client_id" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [{ fieldName: "client_id", operator: "EqualTo", values: [parseInt(clientId)] }],
              operator: "AND"
            },
            {
              conditions: [{ fieldName: "portal_id", operator: "EqualTo", values: [null] }],
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
      console.error("Error fetching pages by client:", error)
      return []
    }
  }

  async getByPortalId(portalId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "is_visible" } },
          { field: { Name: "created_at" } },
          { field: { Name: "block_count" } },
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
      console.error("Error fetching pages by portal:", error)
      return []
    }
  }

  async create(pageData) {
    try {
      const params = {
        records: [{
          Name: pageData.Name,
          title: pageData.title,
          slug: pageData.slug,
          icon: pageData.icon,
          sort_order: pageData.sort_order || 0,
          is_visible: pageData.is_visible !== undefined ? pageData.is_visible : true,
          created_at: pageData.created_at || new Date().toISOString(),
          block_count: pageData.block_count || 0,
          client_id: pageData.client_id ? parseInt(pageData.client_id) : null,
          portal_id: pageData.portal_id ? parseInt(pageData.portal_id) : null,
          Tags: pageData.Tags
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
          toast.success('Page created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating page:", error)
      toast.error("Failed to create page")
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
          toast.success('Page updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating page:", error)
      toast.error("Failed to update page")
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
          toast.success('Page deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting page:", error)
      toast.error("Failed to delete page")
      return false
    }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}

export const pageService = new PageService()