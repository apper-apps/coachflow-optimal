import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import SearchBar from '@/components/molecules/SearchBar'
import DeliverableKanban from '@/components/organisms/DeliverableKanban'

const DeliverableManager = () => {
  const [viewMode, setViewMode] = useState('kanban')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { name: 'Total Deliverables', value: 47, icon: 'Package', color: 'text-blue-600' },
    { name: 'Pending Review', value: 12, icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Needs Changes', value: 3, icon: 'AlertCircle', color: 'text-red-600' },
    { name: 'Approved', value: 32, icon: 'CheckCircle', color: 'text-green-600' }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
          <p className="text-gray-600 mt-1">Review and manage client submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-card transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <ApperIcon name={stat.icon} size={24} className={stat.color} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search deliverables..."
            onSearch={setSearchQuery}
            className="w-80"
          />
          <Button variant="secondary" size="sm">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            Date Range
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <ApperIcon name="Kanban" size={16} />
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

      <DeliverableKanban />
    </div>
  )
}

export default DeliverableManager