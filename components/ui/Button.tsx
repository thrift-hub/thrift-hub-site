import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-earth-sage-600 text-white hover:bg-earth-sage-700 focus:ring-earth-sage-500',
    secondary: 'bg-earth-terracotta-500 text-white hover:bg-earth-terracotta-600 focus:ring-earth-terracotta-500',
    ghost: 'hover:bg-earth-stone-100 text-earth-stone-700 focus:ring-earth-stone-400',
    outline: 'border border-earth-stone-300 hover:bg-earth-stone-50 text-earth-stone-700 focus:ring-earth-stone-400',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}