import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Store } from '@/lib/types'
import { Card, CardContent, Badge } from '@/components/ui'
import { urlFor } from '@/lib/sanity/client'

// Generate store images based on store ID for consistency
const getStoreImage = (storeId: string) => {
  const images = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  ]
  // Create a consistent hash from store ID
  const hash = storeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return images[hash % images.length]
}

interface StoreCardProps {
  store: Store
  variant?: 'grid' | 'list'
}

export const StoreCard: FC<StoreCardProps> = ({ store, variant = 'grid' }) => {
  const imageUrl = store.featuredImage
    ? urlFor(store.featuredImage).width(400).height(300).url()
    : getStoreImage(store._id)
  
  const priceIndicator = store.metrics?.priceLevel
    ? '$'.repeat(store.metrics.priceLevel)
    : null
  
  if (variant === 'list') {
    return (
      <Card hover className="p-4">
        <Link href={`/stores/${store.slug.current}`} className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
              {store.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {store.neighborhood?.name}{store.neighborhood?.region?.name && ` • ${store.neighborhood.region.name}`}
            </p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {store.cardDescription}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {store.primaryCategory && (
                <Badge variant="primary" size="sm">
                  {store.primaryCategory.name}
                </Badge>
              )}
              {priceIndicator && (
                <span className="text-sm text-gray-600">{priceIndicator}</span>
              )}
              {store.metrics?.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{store.metrics.rating}</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-500">
                    ({store.metrics.userRatingsTotal})
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>
    )
  }
  
  return (
    <Card hover className="overflow-hidden">
      <Link href={`/stores/${store.slug.current}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={store.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {store.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {store.neighborhood?.name || 'NYC'}
          </p>
          <p className="text-sm text-gray-700 line-clamp-3 mb-3">
            {store.cardDescription}
          </p>
          <div className="flex items-center justify-between">
            {store.primaryCategory && (
              <Badge variant="primary" size="sm">
                {store.primaryCategory.name}
              </Badge>
            )}
            <div className="flex items-center gap-2">
              {priceIndicator && (
                <span className="text-sm text-gray-600">{priceIndicator}</span>
              )}
              {store.metrics?.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{store.metrics.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}