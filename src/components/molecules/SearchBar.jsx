import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  showShortcut = true 
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16"
        />
        {showShortcut && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-gray-100 px-2 py-1 text-xs text-gray-600">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </form>
  )
}

export default SearchBar