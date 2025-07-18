import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Discover NYC Thrift Stores - Interactive Map',
  description: 'Explore thrift stores, vintage shops, and consignment boutiques across New York City with our interactive map. Filter by category and neighborhood.',
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-sage-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}