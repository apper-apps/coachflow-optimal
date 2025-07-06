import resourceData from '@/services/mockData/resources.json'

class ResourceService {
  constructor() {
    this.resources = [...resourceData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.resources
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const resource = this.resources.find(r => r.Id === id)
    if (!resource) {
      throw new Error('Resource not found')
    }
    return resource
  }

  async getByClientId(clientId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    // Return resources assigned to client or global resources
    return this.resources.filter(r => r.client_id === clientId || r.is_global)
  }

  async create(resourceData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newResource = {
      ...resourceData,
      Id: Math.max(...this.resources.map(r => r.Id)) + 1,
      created_at: new Date().toISOString(),
      version: 1,
      assignments: 0
    }
    this.resources.push(newResource)
    return newResource
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.resources.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Resource not found')
    }
    this.resources[index] = { ...this.resources[index], ...updates }
    return this.resources[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.resources.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Resource not found')
    }
    this.resources.splice(index, 1)
    return true
  }

  async assignToClient(resourceId, clientId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    // This would typically create a ResourceAssignment record
    // For now, we'll just increment the assignments count
    const resource = this.resources.find(r => r.Id === resourceId)
    if (resource) {
      resource.assignments = (resource.assignments || 0) + 1
    }
    return true
  }
}

export const resourceService = new ResourceService()