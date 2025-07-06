import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Empty from '@/components/ui/Empty'

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Templates', count: 12 },
    { id: 'onboarding', name: 'Onboarding', count: 3 },
    { id: 'assessment', name: 'Assessment', count: 4 },
    { id: 'goal-setting', name: 'Goal Setting', count: 2 },
    { id: 'progress', name: 'Progress Tracking', count: 3 }
  ]

  const templates = [
    {
      Id: 1,
      name: 'Client Onboarding',
      description: 'Complete onboarding flow with welcome message, goal setting, and initial assessment.',
      category: 'onboarding',
      pages: 4,
      blocks: 12,
      usage: 18,
      preview: 'https://via.placeholder.com/300x200'
    },
    {
      Id: 2,
      name: 'Goal Setting Workshop',
      description: 'Interactive goal setting template with SMART goals framework and action planning.',
      category: 'goal-setting',
      pages: 3,
      blocks: 8,
      usage: 24,
      preview: 'https://via.placeholder.com/300x200'
    },
    {
      Id: 3,
      name: 'Progress Review',
      description: 'Weekly progress review template with reflection questions and next steps.',
      category: 'progress',
      pages: 2,
      blocks: 6,
      usage: 15,
      preview: 'https://via.placeholder.com/300x200'
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Create reusable workspace templates for your clients</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar
          placeholder="Search templates..."
          onSearch={setSearchQuery}
          className="flex-1 max-w-md"
        />
        <Button variant="secondary" size="sm">
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs opacity-75">{category.count}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {filteredTemplates.length === 0 ? (
            <Empty
              icon="FileText"
              title="No templates found"
              description="Create your first template to speed up client workspace setup."
              actionLabel="Create Template"
              onAction={() => {}}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-card transition-all duration-200 group">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                      <div className="text-center">
                        <ApperIcon name="FileText" size={32} className="text-primary mb-2" />
                        <p className="text-sm text-gray-600">Template Preview</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          <Badge variant="primary" className="mt-1">
                            {categories.find(c => c.id === template.category)?.name}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="MoreHorizontal" size={16} />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{template.pages}</p>
                          <p className="text-xs text-gray-500">Pages</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{template.blocks}</p>
                          <p className="text-xs text-gray-500">Blocks</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{template.usage}</p>
                          <p className="text-xs text-gray-500">Used</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" className="flex-1">
                          <ApperIcon name="Copy" size={16} className="mr-2" />
                          Use Template
                        </Button>
                        <Button variant="secondary" size="sm">
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Templates