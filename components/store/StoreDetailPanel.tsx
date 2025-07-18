'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Store } from '@/lib/types'
import { Card, CardContent, Badge, Button } from '@/components/ui'
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

interface StoreDetailPanelProps {
  store: Store
  onClose: () => void
}

export const StoreDetailPanel: FC<StoreDetailPanelProps> = ({ store, onClose }) => {
  const imageUrl = store.featuredImage
    ? urlFor(store.featuredImage).width(600).height(400).url()
    : getStoreImage(store._id)
  
  const priceIndicator = store.metrics?.priceLevel
    ? '$'.repeat(store.metrics.priceLevel)
    : null

  // Extract domain from website URL for display
  const getWebsiteDomain = (url: string | undefined) => {
    if (!url) return null
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[calc(100vh-2rem)] z-50">
      <Card className="overflow-y-auto bg-white shadow-2xl border-2 border-gray-200">
        {/* Header */}
        <div className="relative">
          <div className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={store.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Store name overlay */}
            <div className="absolute bottom-2 left-3 text-white">
              <h2 className="text-xl font-bold mb-1">{store.name}</h2>
              <p className="text-white/90 text-sm">
                {store.neighborhood?.name}{store.neighborhood?.region?.name && ` • ${store.neighborhood.region.name}`}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Categories and Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {store.primaryCategory && (
                <Badge variant="primary" size="sm">
                  {store.primaryCategory.name}
                </Badge>
              )}
              {store.secondaryCategories?.slice(0, 2).map((category) => (
                <Badge key={category._id} variant="secondary" size="sm">
                  {category.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {priceIndicator && (
                <span className="text-lg font-medium text-gray-700">{priceIndicator}</span>
              )}
              {store.metrics?.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">{store.metrics.rating}</span>
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm text-gray-500">
                    ({store.metrics.userRatingsTotal})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {store.editorialSummary && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">About</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{store.editorialSummary}</p>
            </div>
          )}

          {/* Address */}
          {store.formattedAddress && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Address</h3>
              <p className="text-gray-700 text-sm">{store.formattedAddress}</p>
            </div>
          )}

          {/* Hours */}
          {store.hours && Object.keys(store.hours).length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Hours</h3>
              <div className="grid grid-cols-1 gap-1 text-xs">
                {Object.entries(store.hours).slice(0, 3).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <span className="text-gray-600">{hours || 'Closed'}</span>
                  </div>
                ))}
                {Object.keys(store.hours).length > 3 && (
                  <div className="text-gray-500 text-xs">+ {Object.keys(store.hours).length - 3} more days</div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* External Links */}
            <div className="flex gap-2">
              {store.website && (
                <a
                  href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-earth-sage-100 hover:bg-earth-sage-200 text-earth-sage-700 rounded-md transition-colors duration-200 flex-1 justify-center text-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Website
                </a>
              )}
              
              {store.googleMapsUrl && (
                <a
                  href={store.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors duration-200 flex-1 justify-center text-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Directions
                </a>
              )}
            </div>

            {/* View Full Store Page */}
            <Link href={`/stores/${store.slug.current}`}>
              <Button className="w-full bg-earth-sage-600 hover:bg-earth-sage-700 text-white text-sm py-2">
                View Full Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}