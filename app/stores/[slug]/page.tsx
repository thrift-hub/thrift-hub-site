import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllStores, getStoreBySlug } from '@/lib/data/local-store-service'
import { StoreJsonLd } from '@/components/layout/JsonLd'
import { Button, Badge, Card } from '@/components/ui'

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

interface StorePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const stores = await getAllStores()
  
  return stores.map((store) => ({
    slug: store.slug.current,
  }))
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  
  if (!store) {
    return {
      title: 'Store Not Found',
    }
  }
  
  const description = store.cardDescription || store.editorialSummary || `Visit ${store.name} in ${store.neighborhood?.name || 'NYC'}.`
  
  return {
    title: `${store.name} - ${store.neighborhood?.name || 'NYC'}`,
    description,
    openGraph: {
      title: store.name,
      description,
      type: 'website',
    },
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  
  if (!store) {
    notFound()
  }
  
  const priceIndicator = store.metrics?.priceLevel
    ? '$'.repeat(store.metrics.priceLevel)
    : null
  
  // Parse the HTML description to extract sections
  const descriptionSections = store.description?.[0]?.children?.[0]?.text
    ? parseHtmlDescription(store.description[0].children[0].text)
    : []
  
  return (
    <>
      <StoreJsonLd store={store} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Left Column - Store Info */}
              <div>
                <div className="mb-4">
                  <Link
                    href="/cities/new-york/map"
                    className="text-sm text-earth-sage-600 hover:text-earth-sage-700"
                  >
                    ← Back to map
                  </Link>
                </div>
                
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                  {store.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  {store.primaryCategory && (
                    <Badge variant="primary">{store.primaryCategory.name}</Badge>
                  )}
                  {priceIndicator && (
                    <span className="text-gray-600">{priceIndicator}</span>
                  )}
                  {store.metrics?.rating && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{store.metrics.rating}</span>
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-500">
                        ({store.metrics.userRatingsTotal} reviews)
                      </span>
                    </div>
                  )}
                </div>
                
                {store.editorialSummary && (
                  <p className="text-lg text-gray-700 mb-6 italic">
                    {store.editorialSummary}
                  </p>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700">{store.formattedAddress}</p>
                    {store.neighborhood && (
                      <p className="text-sm text-gray-600">
                        {store.neighborhood.name}{store.neighborhood.region && `, ${store.neighborhood.region.name}`}
                      </p>
                    )}
                  </div>
                  
                  {store.hours?.weekdayText && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
                      <ul className="space-y-1">
                        {store.hours.weekdayText.map((day, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-4">
                    {store.website && (
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline">Visit Website</Button>
                      </a>
                    )}
                    {store.googleMapsUrl && (
                      <a
                        href={store.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline">View on Google Maps</Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Store Image */}
              <div className="mt-8 lg:mt-0">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <Image
                    src={getStoreImage(store._id)}
                    alt={`${store.name} storefront`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white bg-opacity-90 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{store.name}</p>
                      <p className="text-xs text-gray-600">{store.neighborhood.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description Sections */}
        {descriptionSections.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {descriptionSections.map((section, index) => (
                <Card key={index}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </Card>
              ))}
            </div>
            
            {/* Categories */}
            {store.secondaryCategories && store.secondaryCategories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Also categorized as:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {store.secondaryCategories.map((category) => (
                    <Badge key={category._id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// Helper function to parse HTML description
function parseHtmlDescription(html: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = []
  
  // Remove HTML tags but try to preserve structure
  const cleanHtml = html
    .replace(/<div class="store-description">/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<div class="section">/g, '|||SECTION|||')
    .replace(/<h4 class="section-title">(<strong>)?/g, '|||TITLE|||')
    .replace(/(<\/strong>)?<\/h4>/g, '|||/TITLE|||')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
  
  const sectionBlocks = cleanHtml.split('|||SECTION|||').filter(Boolean)
  
  sectionBlocks.forEach(block => {
    const titleMatch = block.match(/\|\|\|TITLE\|\|\|(.*?)\|\|\|\/TITLE\|\|\|/)
    if (titleMatch) {
      const title = titleMatch[1].trim()
      const content = block
        .replace(/\|\|\|TITLE\|\|\|.*?\|\|\|\/TITLE\|\|\|/, '')
        .trim()
      
      if (title && content) {
        sections.push({ title, content })
      }
    }
  })
  
  return sections
}