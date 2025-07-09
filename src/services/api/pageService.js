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

  async createDefaultPages(portalId) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const defaultPages = [
      { title: 'Welcome', slug: 'welcome', icon: 'Home', sort_order: 1 },
      { title: 'Get Started', slug: 'get-started', icon: 'Play', sort_order: 2 },
      { title: 'Inbox', slug: 'inbox', icon: 'Inbox', sort_order: 3 },
      { title: 'Your Deliverables', slug: 'your-deliverables', icon: 'Package', sort_order: 4 }
    ]
    
    const createdPages = []
    for (const pageData of defaultPages) {
      const newPage = await this.createForPortal(portalId, pageData)
      createdPages.push(newPage)
    }
    return createdPages
  }

  async reorderPages(portalId, pageIds) {
    await new Promise(resolve => setTimeout(resolve, 300))
    pageIds.forEach((pageId, index) => {
      const pageIndex = this.pages.findIndex(p => p.Id === pageId && p.portal_id === parseInt(portalId))
      if (pageIndex !== -1) {
        this.pages[pageIndex].sort_order = index
      }
    })
    return true
  }

  async toggleVisibility(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const page = this.pages.find(p => p.Id === id)
    if (!page) {
      throw new Error('Page not found')
    }
    page.is_visible = !page.is_visible
    return page
  }

  async duplicatePage(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const original = this.pages.find(p => p.Id === id)
    if (!original) {
      throw new Error('Page not found')
    }
    
    const duplicate = {
      ...original,
      Id: Math.max(...this.pages.map(p => p.Id)) + 1,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      sort_order: Math.max(...this.pages.filter(p => p.portal_id === original.portal_id).map(p => p.sort_order)) + 1,
      created_at: new Date().toISOString(),
      block_count: 0
    }
    
    this.pages.push(duplicate)
    return duplicate
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