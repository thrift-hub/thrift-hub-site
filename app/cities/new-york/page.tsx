import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllStores, getAllCategories, getAllNeighborhoods } from '@/lib/data/local-store-service'
import { StoreCard } from '@/components/store/StoreCard'
import { Button, Select } from '@/components/ui'

export const metadata: Metadata = {
  title: 'NYC Thrift Stores - All Locations',
  description: 'Browse all thrift stores, vintage shops, and consignment boutiques in New York City. Find your next treasure in Manhattan, Brooklyn, Queens, and beyond.',
}

export default async function NewYorkCityPage() {
  const [stores, categories, neighborhoods] = await Promise.all([
    getAllStores(),
    getAllCategories(),
    getAllNeighborhoods(),
  ])
  
  // Group stores by region
  const storesByRegion = stores.reduce((acc, store) => {
    const region = store.neighborhood?.region?.name || 'Unknown'
    if (!acc[region]) {
      acc[region] = []
    }
    acc[region].push(store)
    return acc
  }, {} as Record<string, typeof stores>)
  
  // Sort regions by number of stores
  const sortedRegions = Object.entries(storesByRegion)
    .sort(([, a], [, b]) => b.length - a.length)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white shadow-sm overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="New York City skyline"
            fill
            className="object-cover opacity-5"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              New York City Thrift Stores
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore {stores.length} curated second-hand stores across all five boroughs. 
              From vintage boutiques in Brooklyn to designer consignment on the Upper East Side.
            </p>
            <Link href="/cities/new-york/map">
              <Button size="lg">
                Open Interactive Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Bar */}
      <section className="bg-earth-sage-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stores.length}</div>
              <div className="text-sm text-gray-600">Total Stores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{neighborhoods.length}</div>
              <div className="text-sm text-gray-600">Neighborhoods</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{sortedRegions.length}</div>
              <div className="text-sm text-gray-600">Boroughs</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stores by Region */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {sortedRegions.map(([region, regionStores]) => (
            <div key={region} className="mb-12">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                {region} ({regionStores.length} stores)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionStores.slice(0, 6).map((store) => (
                  <StoreCard key={store._id} store={store} />
                ))}
              </div>
              {regionStores.length > 6 && (
                <div className="mt-6 text-center">
                  <Link href={`/cities/new-york/map?region=${region.toLowerCase()}`}>
                    <Button variant="outline">
                      View all {regionStores.length} stores in {region}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our interactive map to filter stores by category, neighborhood, and more. 
            Find exactly what you're looking for.
          </p>
          <Link href="/cities/new-york/map">
            <Button size="lg">
              Open Discovery Map
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}