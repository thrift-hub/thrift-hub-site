import { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        hover && 'transition-shadow hover:shadow-md',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
)

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent: FC<CardContentProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
)

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export const CardFooter: FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
)