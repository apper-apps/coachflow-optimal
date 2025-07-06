import portalData from '@/services/mockData/portals.json'

class PortalService {
  constructor() {
    this.portals = [...portalData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.portals]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const portal = this.portals.find(p => p.Id === parseInt(id))
    if (!portal) {
      throw new Error('Portal not found')
    }
    return { ...portal }
  }

  async getByOwnerId(ownerId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.portals.filter(p => p.owner_id === parseInt(ownerId))
  }

  async create(portalData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPortal = {
      ...portalData,
      Id: Math.max(...this.portals.map(p => p.Id)) + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.portals.push(newPortal)
    return { ...newPortal }
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.portals.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Portal not found')
    }
    this.portals[index] = { 
      ...this.portals[index], 
      ...updates,
      updated_at: new Date().toISOString()
    }
    return { ...this.portals[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.portals.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Portal not found')
    }
    this.portals.splice(index, 1)
    return true
  }

  async setActive(id, isActive) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.portals.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Portal not found')
    }
    this.portals[index].is_active = isActive
    this.portals[index].updated_at = new Date().toISOString()
    return { ...this.portals[index] }
  }
}

export const portalService = new PortalService()