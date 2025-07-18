import { FC } from 'react'

// Category mapping with colors and icons
export const categoryConfig = {
  vintage: {
    color: '#8B4A7B', // Deep purple
    icon: '👗',
    name: 'Vintage'
  },
  consignment: {
    color: '#6B73FF', // Blue
    icon: '💎',
    name: 'Consignment'
  },
  thrift: {
    color: '#E67E22', // Orange
    icon: '🛍️',
    name: 'Thrift'
  },
  antique: {
    color: '#8B4513', // Brown
    icon: '🏺',
    name: 'Antique'
  },
  furniture: {
    color: '#2E8B57', // Green
    icon: '🪑',
    name: 'Furniture'
  },
  books: {
    color: '#4169E1', // Royal blue
    icon: '📚',
    name: 'Books'
  },
  designer: {
    color: '#FF1493', // Deep pink
    icon: '✨',
    name: 'Designer'
  },
  general: {
    color: '#6d8c76', // Default earth-sage
    icon: '🏪',
    name: 'General'
  }
}

export type CategoryType = keyof typeof categoryConfig

// Smart categorization based on store name and description
export function categorizeStore(store: { name: string; cardDescription?: string | null }): CategoryType {
  const text = `${store.name} ${store.cardDescription || ''}`.toLowerCase()
  
  // Check for specific category keywords in order of specificity
  if (text.includes('vintage') || text.includes('retro')) return 'vintage'
  if (text.includes('consignment') || text.includes('consign')) return 'consignment'
  if (text.includes('antique') || text.includes('antiquary')) return 'antique'
  if (text.includes('furniture') || text.includes('chair') || text.includes('table')) return 'furniture'
  if (text.includes('book') || text.includes('library')) return 'books'
  if (text.includes('designer') || text.includes('luxury') || text.includes('couture')) return 'designer'
  if (text.includes('thrift') || text.includes('goodwill') || text.includes('salvation army')) return 'thrift'
  
  return 'general'
}

interface MapMarkerProps {
  category: CategoryType
  isHovered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const MapMarker: FC<MapMarkerProps> = ({ 
  category, 
  isHovered = false, 
  size = 'md' 
}) => {
  const config = categoryConfig[category]
  
  // Size configurations
  const sizeConfig = {
    sm: { container: 24, pin: 20, icon: 10, iconOffset: 4 },
    md: { container: 30, pin: 26, icon: 12, iconOffset: 5 },
    lg: { container: 36, pin: 32, icon: 14, iconOffset: 6 }
  }
  
  const currentSize = sizeConfig[isHovered ? 'lg' : size]
  
  return (
    <div 
      className="relative flex items-center justify-center transition-all duration-200"
      style={{
        width: `${currentSize.container}px`,
        height: `${currentSize.container}px`,
      }}
    >
      {/* Pin Shape */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${currentSize.pin}px`,
          height: `${currentSize.pin}px`,
          backgroundColor: config.color,
          borderRadius: '50% 50% 50% 0',
          border: '2px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transform: 'rotate(-45deg) translate(-50%, -50%)',
          top: '45%',
          left: '50%',
        }}
      />
      
      {/* Icon */}
      <div
        className="absolute flex items-center justify-center z-10"
        style={{
          fontSize: `${currentSize.icon}px`,
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {config.icon}
      </div>
    </div>
  )
}