import { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-earth-stone-100 text-earth-stone-800',
    primary: 'bg-earth-sage-100 text-earth-sage-800',
    secondary: 'bg-earth-terracotta-100 text-earth-terracotta-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-earth-cream-200 text-earth-cream-800',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}