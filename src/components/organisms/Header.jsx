import { useState } from 'react'
import Button from '@/components/atoms/Button'
import NotificationBell from '@/components/molecules/NotificationBell'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex@coachflow.com',
    avatar: null
  })

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden md:block">
            <SearchBar 
              placeholder="Search clients, resources, deliverables..." 
              className="w-96"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header