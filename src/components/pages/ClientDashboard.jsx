import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { clientService } from '@/services/api/clientService'
import { resourceService } from '@/services/api/resourceService'
import { deliverableService } from '@/services/api/deliverableService'

const ClientDashboard = () => {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [resources, setResources] = useState([])
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadClientData()
  }, [clientId])

  const loadClientData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [clientData, resourcesData, deliverablesData] = await Promise.all([
        clientService.getById(parseInt(clientId)),
        resourceService.getByClientId(parseInt(clientId)),
        deliverableService.getByClientId(parseInt(clientId))
      ])

      setClient(clientData)
      setResources(resourcesData)
      setDeliverables(deliverablesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadClientData} />
  if (!client) return <Error message="Client not found" />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {client.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">{client.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={client.status} />
          <Button variant="secondary">
            <ApperIcon name="Edit" size={16} className="mr-2" />
            Edit Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Inbox</h3>
            <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">3</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">You have 3 unread notifications</p>
          <Button size="sm" variant="outline" className="w-full">
            View All
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Resources</h3>
            <ApperIcon name="BookOpen" size={20} className="text-primary" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {resources.length} resources shared with you
          </p>
          <Button size="sm" variant="outline" className="w-full">
            Browse All
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Deliverables</h3>
            <ApperIcon name="Package" size={20} className="text-primary" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {deliverables.length} total submissions
          </p>
          <Button size="sm" variant="outline" className="w-full">
            View History
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h3>
          <div className="space-y-3">
            {resources.slice(0, 5).map(resource => (
              <div key={resource.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <ApperIcon name="File" size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{resource.title}</p>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <ApperIcon name="Download" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
            <Button size="sm">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Submit New
            </Button>
          </div>
          <div className="space-y-3">
            {deliverables.slice(0, 5).map(deliverable => (
              <div key={deliverable.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{deliverable.title}</p>
                  <p className="text-sm text-gray-600">
                    Submitted {new Date(deliverable.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={deliverable.status} />
                  <Button size="sm" variant="ghost">
                    <ApperIcon name="Eye" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ClientDashboard