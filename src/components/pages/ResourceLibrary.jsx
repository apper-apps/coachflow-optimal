import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import FormField from '@/components/molecules/FormField'
import SearchBar from '@/components/molecules/SearchBar'
import ResourceGrid from '@/components/organisms/ResourceGrid'

const ResourceLibrary = () => {
  const [showCreateResource, setShowCreateResource] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-600 mt-1">Manage and share your coaching resources</p>
        </div>
        <Button onClick={() => setShowCreateResource(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Resource
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search resources..."
            onSearch={setSearchQuery}
            className="w-80"
          />
          <Button variant="secondary" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <ApperIcon name="Grid3x3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ApperIcon name="List" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {[
                { name: 'All Resources', count: 24 },
                { name: 'Worksheets', count: 8 },
                { name: 'Videos', count: 6 },
                { name: 'Templates', count: 4 },
                { name: 'Guides', count: 6 }
              ].map(category => (
                <button
                  key={category.name}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['Goal Setting', 'Productivity', 'Mindset', 'Leadership', 'Communication'].map(tag => (
                  <button
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <ResourceGrid onCreateResource={() => setShowCreateResource(true)} />
        </div>
      </div>

      {showCreateResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Resource</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateResource(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form className="space-y-4">
              <FormField
                label="Title"
                placeholder="Enter resource title..."
                required
              />
              <FormField
                label="Description"
                placeholder="Brief description..."
                as="textarea"
                rows={3}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ApperIcon name="Upload" size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag & drop files here, or click to select
                </p>
                <Button variant="secondary" size="sm">
                  Choose Files
                </Button>
              </div>
              <FormField
                label="Tags"
                placeholder="Add tags (comma separated)..."
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="global"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="global" className="text-sm text-gray-700">
                  Make this resource available to all clients
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Resource
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateResource(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ResourceLibrary