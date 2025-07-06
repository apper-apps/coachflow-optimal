import pageData from '@/services/mockData/pages.json'

class PageService {
  constructor() {
    this.pages = [...pageData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.pages
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const page = this.pages.find(p => p.Id === id)
    if (!page) {
      throw new Error('Page not found')
    }
    return page
  }

async getByClientId(clientId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.pages.filter(p => p.client_id === clientId && p.portal_id === null)
  }

  async getByPortalId(portalId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.pages.filter(p => p.portal_id === parseInt(portalId))
  }

async create(pageData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPage = {
      ...pageData,
      Id: Math.max(...this.pages.map(p => p.Id)) + 1,
      created_at: new Date().toISOString(),
      block_count: 0,
      portal_id: pageData.portal_id || null
    }
    this.pages.push(newPage)
    return newPage
  }

  async createForPortal(portalId, pageData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPage = {
      ...pageData,
      Id: Math.max(...this.pages.map(p => p.Id)) + 1,
      portal_id: parseInt(portalId),
      client_id: null,
      created_at: new Date().toISOString(),
      block_count: 0
    }
    this.pages.push(newPage)
    return newPage
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.pages.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Page not found')
    }
    this.pages[index] = { ...this.pages[index], ...updates }
    return this.pages[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.pages.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Page not found')
    }
    this.pages.splice(index, 1)
    return true
  }
}

export const pageService = new PageService()