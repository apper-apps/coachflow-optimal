import { toast } from 'react-toastify'

class PortalMemberService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'portal_member'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "joined_at" } },
          { field: { Name: "is_active" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "client_id" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "joined_at", sorttype: "DESC" }]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching portal members:", error)
      toast.error("Failed to fetch portal members")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "joined_at" } },
          { field: { Name: "is_active" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "client_id" } },
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
      console.error(`Error fetching portal member with ID ${id}:`, error)
      toast.error("Failed to fetch portal member")
      return null
    }
  }

  async getByPortalId(portalId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "joined_at" } },
          { field: { Name: "is_active" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "client_id" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [{ fieldName: "portal_id", operator: "EqualTo", values: [parseInt(portalId)] }],
              operator: "AND"
            },
            {
              conditions: [{ fieldName: "is_active", operator: "EqualTo", values: [true] }],
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
      console.error("Error fetching portal members by portal:", error)
      return []
    }
  }

  async getByClientId(clientId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "joined_at" } },
          { field: { Name: "is_active" } },
          { field: { Name: "portal_id" } },
          { field: { Name: "client_id" } },
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
              conditions: [{ fieldName: "is_active", operator: "EqualTo", values: [true] }],
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
      console.error("Error fetching portal members by client:", error)
      return []
    }
  }

  async create(memberData) {
    try {
      const params = {
        records: [{
          Name: memberData.Name,
          role: memberData.role || 'member',
          joined_at: memberData.joined_at || new Date().toISOString(),
          is_active: memberData.is_active !== undefined ? memberData.is_active : true,
          portal_id: parseInt(memberData.portal_id),
          client_id: parseInt(memberData.client_id),
          Tags: memberData.Tags
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
          toast.success('Portal member created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating portal member:", error)
      toast.error("Failed to create portal member")
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
          toast.success('Portal member updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating portal member:", error)
      toast.error("Failed to update portal member")
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
          toast.success('Portal member deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting portal member:", error)
      toast.error("Failed to delete portal member")
      return false
    }
  }
}

export const portalMemberService = new PortalMemberService()