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
import { toast } from 'react-toastify'

const ClientDashboard = () => {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [resources, setResources] = useState([])
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [showWidgetSelector, setShowWidgetSelector] = useState(false)
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'inbox', name: 'Inbox', enabled: true, position: 0 },
    { id: 'resources', name: 'Resources', enabled: true, position: 1 },
    { id: 'deliverables', name: 'Deliverables', enabled: true, position: 2 },
    { id: 'recent-resources', name: 'Recent Resources', enabled: true, position: 3 },
    { id: 'deliverable-list', name: 'Deliverable List', enabled: true, position: 4 },
    { id: 'progress-tracker', name: 'Progress Tracker', enabled: false, position: 5 },
    { id: 'notifications', name: 'Notifications', enabled: false, position: 6 }
  ])
  const [draggedWidget, setDraggedWidget] = useState(null)

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

  const toggleWidgetEnabled = (widgetId) => {
    setDashboardWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    )
  }

  const saveDashboardLayout = async () => {
    try {
      // In a real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Dashboard layout saved successfully!')
      setIsCustomizing(false)
    } catch (error) {
      toast.error('Failed to save dashboard layout')
    }
  }

  const resetDashboardLayout = () => {
    setDashboardWidgets([
      { id: 'inbox', name: 'Inbox', enabled: true, position: 0 },
      { id: 'resources', name: 'Resources', enabled: true, position: 1 },
      { id: 'deliverables', name: 'Deliverables', enabled: true, position: 2 },
      { id: 'recent-resources', name: 'Recent Resources', enabled: true, position: 3 },
      { id: 'deliverable-list', name: 'Deliverable List', enabled: true, position: 4 },
      { id: 'progress-tracker', name: 'Progress Tracker', enabled: false, position: 5 },
      { id: 'notifications', name: 'Notifications', enabled: false, position: 6 }
    ])
    toast.success('Dashboard layout reset to default')
  }

  const handleDragStart = (e, widget) => {
    setDraggedWidget(widget)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetWidget) => {
    e.preventDefault()
    if (!draggedWidget || draggedWidget.id === targetWidget.id) return

    const draggedIndex = dashboardWidgets.findIndex(w => w.id === draggedWidget.id)
    const targetIndex = dashboardWidgets.findIndex(w => w.id === targetWidget.id)

    const newWidgets = [...dashboardWidgets]
    newWidgets.splice(draggedIndex, 1)
    newWidgets.splice(targetIndex, 0, draggedWidget)

    // Update positions
    newWidgets.forEach((widget, index) => {
      widget.position = index
    })

    setDashboardWidgets(newWidgets)
    setDraggedWidget(null)
  }

  const renderWidget = (widget) => {
    if (!widget.enabled) return null

    const commonProps = {
      key: widget.id,
      draggable: isCustomizing,
      onDragStart: (e) => handleDragStart(e, widget),
      onDragOver: handleDragOver,
      onDrop: (e) => handleDrop(e, widget),
      className: `${isCustomizing ? 'cursor-move border-2 border-dashed border-transparent hover:border-primary' : ''}`
    }

    switch (widget.id) {
      case 'inbox':
        return (
          <Card className="p-6" {...commonProps}>
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
        )
      case 'resources':
        return (
          <Card className="p-6" {...commonProps}>
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
        )
      case 'deliverables':
        return (
          <Card className="p-6" {...commonProps}>
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
        )
      case 'recent-resources':
        return (
          <Card className="p-6" {...commonProps}>
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
        )
      case 'deliverable-list':
        return (
          <Card className="p-6" {...commonProps}>
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
        )
      case 'progress-tracker':
        return (
          <Card className="p-6" {...commonProps}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracker</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{deliverables.filter(d => d.status === 'completed').length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{deliverables.filter(d => d.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </Card>
        )
      case 'notifications':
        return (
          <Card className="p-6" {...commonProps}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <ApperIcon name="Info" size={16} className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">New resource shared</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <ApperIcon name="CheckCircle" size={16} className="text-green-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Deliverable approved</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <ApperIcon name="AlertCircle" size={16} className="text-yellow-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Deadline reminder</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </Card>
        )
      default:
        return null
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
          {isCustomizing ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={resetDashboardLayout}>
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={() => setIsCustomizing(false)}>
                Cancel
              </Button>
              <Button onClick={saveDashboardLayout}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Layout
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setIsCustomizing(true)}>
              <ApperIcon name="Settings" size={16} className="mr-2" />
              Customize Dashboard
            </Button>
          )}
        </div>
      </div>

      {isCustomizing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="Info" size={20} className="text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Customization Mode</p>
                <p className="text-sm text-blue-700">Drag widgets to reorder them, or click to add/remove widgets</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowWidgetSelector(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Widget
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardWidgets
          .filter(widget => widget.enabled && ['inbox', 'resources', 'deliverables'].includes(widget.id))
          .sort((a, b) => a.position - b.position)
          .map(widget => renderWidget(widget))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardWidgets
          .filter(widget => widget.enabled && !['inbox', 'resources', 'deliverables'].includes(widget.id))
          .sort((a, b) => a.position - b.position)
          .map(widget => renderWidget(widget))}
      </div>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Manage Widgets</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWidgetSelector(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-3">
              {dashboardWidgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                      <ApperIcon name="LayoutDashboard" size={16} className="text-primary" />
                    </div>
                    <span className="font-medium text-gray-900">{widget.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={widget.enabled ? "default" : "outline"}
                    onClick={() => toggleWidgetEnabled(widget.id)}
                  >
                    {widget.enabled ? 'Remove' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-6 mt-6 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowWidgetSelector(false)}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ClientDashboard