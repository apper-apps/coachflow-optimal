import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Clients', href: '/clients', icon: 'Users' },
    { name: 'Portals', href: '/portals', icon: 'Globe' },
    { name: 'Resources', href: '/resources', icon: 'BookOpen' },
    { name: 'Deliverables', href: '/deliverables', icon: 'Package' },
    { name: 'Templates', href: '/templates', icon: 'FileText' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-900 to-gray-800 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">CoachFlow</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-r-2 border-primary'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={18} 
                  className="mr-3 flex-shrink-0" 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">CoachFlow</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-r-2 border-primary'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={18} 
                  className="mr-3 flex-shrink-0" 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar