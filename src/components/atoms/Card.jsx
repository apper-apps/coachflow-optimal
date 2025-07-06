import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ 
  className, 
  variant = 'default',
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-soft',
    elevated: 'bg-white border border-gray-200 shadow-card',
    premium: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-elevated',
    glass: 'glass-effect border border-white/20 shadow-soft'
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Card.displayName = 'Card'

export default Card