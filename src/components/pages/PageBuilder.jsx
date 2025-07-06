import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import PageBuilderComponent from '@/components/organisms/PageBuilder'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { pageService } from '@/services/api/pageService'

const PageBuilder = () => {
  const { clientId, pageId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pageService.getById(parseInt(pageId))
      setPage(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await pageService.update(parseInt(pageId), page)
      toast.success('Page saved successfully')
    } catch (error) {
      console.error('Failed to save page:', error)
      toast.error('Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    navigate(`/client/${clientId}/workspace`)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPage} />
  if (!page) return <Error message="Page not found" />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Workspace
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
            <p className="text-gray-600">{page.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Page Title"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={page.is_visible}
              onChange={(e) => setPage({ ...page, is_visible: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="visible" className="text-sm text-gray-700">
              Page is visible to client
            </label>
          </div>
        </div>
      </div>

      <PageBuilderComponent pageId={parseInt(pageId)} onSave={handleSave} />
    </div>
  )
}

export default PageBuilder