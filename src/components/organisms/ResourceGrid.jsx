import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { resourceService } from '@/services/api/resourceService'
import { formatDistanceToNow } from 'date-fns'

const ResourceGrid = ({ onCreateResource }) => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await resourceService.getAll()
      setResources(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'FileText'
      case 'doc':
      case 'docx':
        return 'FileText'
      case 'xls':
      case 'xlsx':
        return 'FileSpreadsheet'
      case 'ppt':
      case 'pptx':
        return 'Presentation'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image'
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'Video'
      case 'mp3':
      case 'wav':
        return 'Music'
      default:
        return 'File'
    }
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadResources} />
  if (resources.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No resources yet"
        description="Start building your resource library by uploading your first coaching material."
        actionLabel="Add Resource"
        onAction={onCreateResource}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="p-6 hover:shadow-card transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <ApperIcon 
                    name={getFileIcon(resource.file_url)} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    v{resource.version}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {resource.is_global && (
                  <Badge variant="primary">Global</Badge>
                )}
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MoreHorizontal" size={16} />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {resource.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags?.slice(0, 3).map(tag => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags?.length > 3 && (
                <Badge variant="default" className="text-xs">
                  +{resource.tags.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{resource.assignments || 0} assignments</span>
              <span>
                {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1">
                <ApperIcon name="Send" size={16} className="mr-2" />
                Assign
              </Button>
              <Button variant="secondary" size="sm">
                <ApperIcon name="Eye" size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Download" size={16} />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default ResourceGrid