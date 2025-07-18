import { FC } from 'react'
import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton: FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }
  
  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  }
  
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variants[variant],
        className
      )}
      style={style}
    />
  )
}