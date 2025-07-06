import blockData from '@/services/mockData/blocks.json'

class BlockService {
  constructor() {
    this.blocks = [...blockData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.blocks
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const block = this.blocks.find(b => b.Id === id)
    if (!block) {
      throw new Error('Block not found')
    }
    return block
  }

  async getByPageId(pageId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.blocks
      .filter(b => b.page_id === pageId)
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  async create(blockData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newBlock = {
      ...blockData,
      Id: Math.max(...this.blocks.map(b => b.Id)) + 1,
      created_at: new Date().toISOString()
    }
    this.blocks.push(newBlock)
    return newBlock
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.blocks.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Block not found')
    }
    this.blocks[index] = { ...this.blocks[index], ...updates }
    return this.blocks[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.blocks.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Block not found')
    }
    this.blocks.splice(index, 1)
    return true
  }

  async reorderBlocks(pageId, orderedBlocks) {
    await new Promise(resolve => setTimeout(resolve, 250))
    // Update sort orders for all blocks in the page
    orderedBlocks.forEach(block => {
      const index = this.blocks.findIndex(b => b.Id === block.Id)
      if (index !== -1) {
        this.blocks[index].sort_order = block.sort_order
      }
    })
    return true
  }
}

export const blockService = new BlockService()