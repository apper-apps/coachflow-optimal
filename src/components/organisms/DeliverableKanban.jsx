import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { deliverableService } from '@/services/api/deliverableService'
import { formatDistanceToNow } from 'date-fns'

const DeliverableKanban = ({ onCreateDeliverable }) => {
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { id: 'submitted', title: 'Submitted', color: 'bg-blue-50 border-blue-200' },
    { id: 'reviewed', title: 'Reviewed', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'needs_changes', title: 'Needs Changes', color: 'bg-red-50 border-red-200' },
    { id: 'approved', title: 'Approved', color: 'bg-green-50 border-green-200' }
  ]

  useEffect(() => {
    loadDeliverables()
  }, [])

  const loadDeliverables = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await deliverableService.getAll()
      setDeliverables(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId

    try {
      await deliverableService.updateStatus(parseInt(draggableId), newStatus)
      setDeliverables(prev => 
        prev.map(item => 
          item.Id === parseInt(draggableId) 
            ? { ...item, status: newStatus }
            : item
        )
      )
    } catch (error) {
      console.error('Failed to update deliverable status:', error)
    }
  }

  const getDeliverablesByStatus = (status) => {
    return deliverables.filter(item => item.status === status)
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadDeliverables} />
  if (deliverables.length === 0) {
    return (
      <Empty
        icon="Package"
        title="No deliverables yet"
        description="Deliverables will appear here once your clients start submitting their work."
        actionLabel="View Clients"
        onAction={onCreateDeliverable}
      />
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col">
            <div className={`p-4 rounded-lg border-2 ${column.color} mb-4`}>
              <h3 className="font-medium text-gray-900 mb-1">{column.title}</h3>
              <p className="text-sm text-gray-600">
                {getDeliverablesByStatus(column.id).length} items
              </p>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-h-[200px] rounded-lg p-2 transition-colors ${
                    snapshot.isDraggedOver ? 'bg-gray-100' : 'bg-transparent'
                  }`}
                >
                  {getDeliverablesByStatus(column.id).map((deliverable, index) => (
                    <Draggable
                      key={deliverable.Id}
                      draggableId={deliverable.Id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 ${snapshot.isDragging ? 'drag-ghost' : ''}`}
                          layout
                        >
                          <Card className="p-4 hover:shadow-card transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {deliverable.title}
                              </h4>
                              <StatusBadge status={deliverable.status} />
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-xs">
                                  {deliverable.client_name?.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {deliverable.client_name}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">
                              Submitted {formatDistanceToNow(new Date(deliverable.submitted_at), { addSuffix: true })}
                            </p>

                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" className="flex-1">
                                <ApperIcon name="MessageCircle" size={14} className="mr-1" />
                                {deliverable.comments || 0}
                              </Button>
                              <Button size="sm" variant="ghost">
                                <ApperIcon name="Eye" size={14} />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

export default DeliverableKanban