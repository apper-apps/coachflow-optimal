import portalMemberData from '@/services/mockData/portalMembers.json'

class PortalMemberService {
  constructor() {
    this.portalMembers = [...portalMemberData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.portalMembers]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const member = this.portalMembers.find(m => m.Id === parseInt(id))
    if (!member) {
      throw new Error('Portal member not found')
    }
    return { ...member }
  }

  async getByPortalId(portalId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.portalMembers.filter(m => m.portal_id === parseInt(portalId) && m.is_active)
  }

  async getByClientId(clientId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.portalMembers.filter(m => m.client_id === parseInt(clientId) && m.is_active)
  }

  async create(memberData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newMember = {
      ...memberData,
      Id: Math.max(...this.portalMembers.map(m => m.Id)) + 1,
      joined_at: new Date().toISOString(),
      is_active: true
    }
    this.portalMembers.push(newMember)
    return { ...newMember }
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.portalMembers.findIndex(m => m.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Portal member not found')
    }
    this.portalMembers[index] = { ...this.portalMembers[index], ...updates }
    return { ...this.portalMembers[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.portalMembers.findIndex(m => m.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Portal member not found')
    }
    this.portalMembers.splice(index, 1)
    return true
  }

  async addMemberToPortal(portalId, clientId, role = 'member') {
    await new Promise(resolve => setTimeout(resolve, 350))
    
    // Check if member already exists
    const existingMember = this.portalMembers.find(m => 
      m.portal_id === parseInt(portalId) && 
      m.client_id === parseInt(clientId) && 
      m.is_active
    )
    
    if (existingMember) {
      throw new Error('Client is already a member of this portal')
    }

    const newMember = {
      Id: Math.max(...this.portalMembers.map(m => m.Id)) + 1,
      portal_id: parseInt(portalId),
      client_id: parseInt(clientId),
      role,
      joined_at: new Date().toISOString(),
      is_active: true
    }
    
    this.portalMembers.push(newMember)
    return { ...newMember }
  }

  async removeMemberFromPortal(portalId, clientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.portalMembers.findIndex(m => 
      m.portal_id === parseInt(portalId) && 
      m.client_id === parseInt(clientId) && 
      m.is_active
    )
    
    if (index === -1) {
      throw new Error('Portal member not found')
    }
    
    this.portalMembers[index].is_active = false
    return true
  }
}

export const portalMemberService = new PortalMemberService()