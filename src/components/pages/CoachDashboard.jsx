import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ClientTable from '@/components/organisms/ClientTable'

const CoachDashboard = () => {
  const [showCreateClient, setShowCreateClient] = useState(false)

  const stats = [
    { name: 'Total Clients', value: 12, icon: 'Users', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Active Workspaces', value: 8, icon: 'Monitor', color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Pending Deliverables', value: 5, icon: 'Package', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { name: 'Resources Shared', value: 24, icon: 'BookOpen', color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your clients and track their progress</p>
        </div>
        <Button onClick={() => setShowCreateClient(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Invite Client
        </Button>
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
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <ApperIcon name={stat.icon} size={24} className={stat.color} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Clients</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <ApperIcon name="Filter" size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        <ClientTable onCreateClient={() => setShowCreateClient(true)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'deliverable', client: 'Sarah Johnson', action: 'submitted new deliverable', time: '2 hours ago' },
              { type: 'login', client: 'Mike Chen', action: 'logged into workspace', time: '4 hours ago' },
              { type: 'comment', client: 'Emma Davis', action: 'added comment to deliverable', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.client}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <ApperIcon name="UserPlus" size={16} className="mr-3" />
              Invite New Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ApperIcon name="Upload" size={16} className="mr-3" />
              Upload Resource
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ApperIcon name="FileText" size={16} className="mr-3" />
              Create Template
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ApperIcon name="BarChart" size={16} className="mr-3" />
              View Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CoachDashboard