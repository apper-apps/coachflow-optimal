import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PageBuilder from '@/components/organisms/PageBuilder'
import { portalService } from '@/services/api/portalService'
import { pageService } from '@/services/api/pageService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const PortalBuilder = () => {
  const { portalId } = useParams()
  const navigate = useNavigate()
  const [portal, setPortal] = useState(null)
  const [portalPages, setPortalPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPortalData()
  }, [portalId])

  const loadPortalData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const portalData = await portalService.getById(parseInt(portalId))
      setPortal(portalData)
      
      const pages = await pageService.getByPortalId(parseInt(portalId))
      setPortalPages(pages)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load portal data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePage = async (pageData) => {
    try {
      const newPage = await pageService.createForPortal(parseInt(portalId), pageData)
      setPortalPages(prev => [...prev, newPage])
      toast.success('Page created successfully')
      return newPage
    } catch (err) {
      toast.error('Failed to create page')
      throw err
    }
  }

  const handleUpdatePage = async (pageId, updates) => {
    try {
      const updatedPage = await pageService.update(pageId, updates)
      setPortalPages(prev => prev.map(p => p.Id === pageId ? updatedPage : p))
      toast.success('Page updated successfully')
      return updatedPage
    } catch (err) {
      toast.error('Failed to update page')
      throw err
    }
  }

  const handleDeletePage = async (pageId) => {
    try {
      await pageService.delete(pageId)
      setPortalPages(prev => prev.filter(p => p.Id !== pageId))
      toast.success('Page deleted successfully')
    } catch (err) {
      toast.error('Failed to delete page')
      throw err
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPortalData} />

  return (
    <div className="h-full flex flex-col">
      {/* Portal Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/portals')}
            className="mr-4"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Portals
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{portal?.title}</h1>
            <p className="text-sm text-gray-600">Portal Builder - Shared Template</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Eye" size={16} className="mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Users" size={16} className="mr-2" />
            Manage Members
          </Button>
        </div>
      </div>

      {/* Page Builder */}
      <div className="flex-1 overflow-hidden">
        <PageBuilder
          mode="portal"
          portalId={parseInt(portalId)}
          pages={portalPages}
          onCreatePage={handleCreatePage}
          onUpdatePage={handleUpdatePage}
          onDeletePage={handleDeletePage}
        />
      </div>
    </div>
  )
}

export default PortalBuilder