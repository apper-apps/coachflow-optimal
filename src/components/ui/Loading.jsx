import { motion } from 'framer-motion'

const Loading = ({ variant = 'dashboard' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'table':
        return (
          <div className="space-y-4">
            <div className="skeleton h-12 w-full rounded-lg"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 w-full rounded-lg"></div>
            ))}
          </div>
        )
      
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 w-full rounded-lg"></div>
            ))}
          </div>
        )
      
      case 'form':
        return (
          <div className="space-y-6">
            <div className="skeleton h-8 w-32 rounded"></div>
            <div className="skeleton h-12 w-full rounded-lg"></div>
            <div className="skeleton h-8 w-24 rounded"></div>
            <div className="skeleton h-32 w-full rounded-lg"></div>
            <div className="skeleton h-12 w-32 rounded-lg"></div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            <div className="skeleton h-8 w-48 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-32 w-full rounded-lg"></div>
              ))}
            </div>
            <div className="skeleton h-64 w-full rounded-lg"></div>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="animate-pulse">
        {renderSkeleton()}
      </div>
    </motion.div>
  )
}

export default Loading