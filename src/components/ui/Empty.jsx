import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  icon = "Package", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full">
        <ApperIcon 
          name={icon} 
          size={48} 
          className="text-gray-400"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty