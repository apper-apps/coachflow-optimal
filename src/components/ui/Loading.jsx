const Loading = ({ variant = 'default' }) => {
  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  )

  if (variant === 'skeleton') {
    return renderSkeleton()
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
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