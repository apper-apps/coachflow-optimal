import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import { portalService } from '@/services/api/portalService'
import { portalMemberService } from '@/services/api/portalMemberService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const PortalList = () => {
  const navigate = useNavigate()
  const [portals, setPortals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPortalTitle, setNewPortalTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [memberCounts, setMemberCounts] = useState({})

  useEffect(() => {
    loadPortals()
  }, [])

  const loadPortals = async () => {
    try {
      setLoading(true)
      setError(null)
      const portalsData = await portalService.getAll()
      setPortals(portalsData)
      
      // Load member counts for each portal
      const counts = {}
      for (const portal of portalsData) {
        const members = await portalMemberService.getByPortalId(portal.Id)
        counts[portal.Id] = members.length
      }
      setMemberCounts(counts)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load portals')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePortal = async () => {
    if (!newPortalTitle.trim()) {
      toast.error('Portal title is required')
      return
    }

    try {
      setCreating(true)
      const newPortal = await portalService.create({
        title: newPortalTitle.trim(),
        owner_id: 1 // Current coach ID
      })
      setPortals(prev => [...prev, newPortal])
      setMemberCounts(prev => ({ ...prev, [newPortal.Id]: 0 }))
      setNewPortalTitle('')
      setShowCreateModal(false)
      toast.success('Portal created successfully')
    } catch (err) {
      toast.error('Failed to create portal')
    } finally {
      setCreating(false)
    }
  }

  const handleOpenBuilder = (portalId) => {
    navigate(`/portals/${portalId}/builder`)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPortals} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portals</h1>
          <p className="text-gray-600 mt-1">Manage your coaching portals and shared templates</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Portal
        </Button>
      </div>

      {portals.length === 0 ? (
        <Empty
          title="No portals created yet"
          description="Create your first portal to start building shared coaching experiences"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Portal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-card transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="Globe" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{portal.title}</h3>
                      <p className="text-sm text-gray-600">
                        {memberCounts[portal.Id] || 0} member{memberCounts[portal.Id] !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Created {new Date(portal.created_at).toLocaleDateString()}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleOpenBuilder(portal.Id)}
                  >
                    <ApperIcon name="Edit" size={14} className="mr-2" />
                    Open Builder
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Portal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Portal</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portal Title
                </label>
                <Input
                  value={newPortalTitle}
                  onChange={(e) => setNewPortalTitle(e.target.value)}
                  placeholder="Enter portal title"
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePortal}
                  disabled={creating || !newPortalTitle.trim()}
                >
                  {creating ? 'Creating...' : 'Create Portal'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default PortalList