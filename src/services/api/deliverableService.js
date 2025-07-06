import deliverableData from '@/services/mockData/deliverables.json'

class DeliverableService {
  constructor() {
    this.deliverables = [...deliverableData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.deliverables
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const deliverable = this.deliverables.find(d => d.Id === id)
    if (!deliverable) {
      throw new Error('Deliverable not found')
    }
    return deliverable
  }

async getByClientId(clientId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.deliverables.filter(d => d.client_id === clientId)
  }

  async getByPortalId(portalId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.deliverables.filter(d => d.portal_id === parseInt(portalId))
  }

async create(deliverableData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newDeliverable = {
      ...deliverableData,
      Id: Math.max(...this.deliverables.map(d => d.Id)) + 1,
      submitted_at: new Date().toISOString(),
      status: 'submitted',
      comments: 0,
      portal_id: deliverableData.portal_id || null
    }
    this.deliverables.push(newDeliverable)
    return newDeliverable
  }

  async createForPortal(portalId, deliverableData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newDeliverable = {
      ...deliverableData,
      Id: Math.max(...this.deliverables.map(d => d.Id)) + 1,
      portal_id: parseInt(portalId),
      submitted_at: new Date().toISOString(),
      status: 'submitted',
      comments: 0
    }
    this.deliverables.push(newDeliverable)
    return newDeliverable
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.deliverables.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deliverable not found')
    }
    this.deliverables[index] = { ...this.deliverables[index], ...updates }
    return this.deliverables[index]
  }

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.deliverables.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deliverable not found')
    }
    this.deliverables[index].status = status
    return this.deliverables[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.deliverables.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deliverable not found')
    }
    this.deliverables.splice(index, 1)
    return true
  }
}

export const deliverableService = new DeliverableService()