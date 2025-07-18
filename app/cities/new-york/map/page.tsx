'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllStores, getAllCategories, getAllNeighborhoods, filterStores } from '@/lib/data/local-store-service'
import { Store, Category, Neighborhood } from '@/lib/types'
import { StoreCard } from '@/components/store/StoreCard'
import { Select, Input, Button, Badge } from '@/components/ui'
import MapComponent from '@/components/map/MapComponent'

export default function DiscoveryMapPage() {
  const searchParams = useSearchParams()
  
  // State
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [storesData, categoriesData, neighborhoodsData] = await Promise.all([
          getAllStores(),
          getAllCategories(),
          getAllNeighborhoods(),
        ])
        
        setStores(storesData)
        setFilteredStores(storesData)
        setCategories(categoriesData)
        setNeighborhoods(neighborhoodsData)
        
        // Check for URL parameters
        const categoryParam = searchParams.get('category')
        const neighborhoodParam = searchParams.get('neighborhood')
        const storesParam = searchParams.get('stores')
        
        if (categoryParam) {
          setSelectedCategories(categoryParam.split(','))
        }
        if (neighborhoodParam) {
          setSelectedNeighborhoods(neighborhoodParam.split(','))
        }
        if (storesParam) {
          const storeIds = storesParam.split(',')
          const filtered = await filterStores({ storeIds })
          setFilteredStores(filtered)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [searchParams])
  
  // Filter stores based on selections
  useEffect(() => {
    async function applyFilters() {
      let filtered = stores
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(store =>
          store.name.toLowerCase().includes(query) ||
          store.cardDescription?.toLowerCase().includes(query) ||
          store.neighborhood.name.toLowerCase().includes(query)
        )
      }
      
      // Apply category and neighborhood filters
      if (selectedCategories.length > 0 || selectedNeighborhoods.length > 0) {
        filtered = await filterStores({
          categories: selectedCategories,
          neighborhoods: selectedNeighborhoods,
        })
        
        // Re-apply search query if needed
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(store =>
            store.name.toLowerCase().includes(query) ||
            store.cardDescription?.toLowerCase().includes(query) ||
            store.neighborhood.name.toLowerCase().includes(query)
          )
        }
      }
      
      setFilteredStores(filtered)
    }
    
    applyFilters()
  }, [stores, selectedCategories, selectedNeighborhoods, searchQuery])
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    }
    if (selectedNeighborhoods.length > 0) {
      params.set('neighborhood', selectedNeighborhoods.join(','))
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [selectedCategories, selectedNeighborhoods])
  
  const handleCategoryChange = (value: string) => {
    if (value && !selectedCategories.includes(value)) {
      setSelectedCategories([...selectedCategories, value])
    }
  }
  
  const handleNeighborhoodChange = (value: string) => {
    if (value && !selectedNeighborhoods.includes(value)) {
      setSelectedNeighborhoods([...selectedNeighborhoods, value])
    }
  }
  
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category))
  }
  
  const removeNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== neighborhood))
  }
  
  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedNeighborhoods([])
    setSearchQuery('')
  }
  
  const hasActiveFilters = selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || searchQuery
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Store List */}
      <div className="w-full md:w-1/3 lg:w-2/5 overflow-y-auto bg-white shadow-lg">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Discover NYC Stores
          </h1>
          
          {/* Search */}
          <Input
            type="search"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          
          {/* Filters */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Select
              options={categories.map(cat => ({
                value: cat.slug.current,
                label: cat.name
              }))}
              placeholder="Category"
              value=""
              onChange={(e) => handleCategoryChange(e.target.value)}
            />
            <Select
              options={neighborhoods.map(n => ({
                value: n.slug.current,
                label: n.name
              }))}
              placeholder="Neighborhood"
              value=""
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
            />
          </div>
          
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCategories.map(cat => {
                const category = categories.find(c => c.slug.current === cat)
                return category ? (
                  <Badge key={cat} variant="primary" className="flex items-center gap-1">
                    {category.name}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ) : null
              })}
              {selectedNeighborhoods.map(n => {
                const neighborhood = neighborhoods.find(nh => nh.slug.current === n)
                return neighborhood ? (
                  <Badge key={n} variant="secondary" className="flex items-center gap-1">
                    {neighborhood.name}
                    <button
                      onClick={() => removeNeighborhood(n)}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ) : null
              })}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>
          )}
          
          <p className="text-sm text-gray-600">
            {filteredStores.length} stores found
          </p>
        </div>
        
        {/* Store List */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <div
                key={store._id}
                onClick={() => setSelectedStore(store)}
                className={`cursor-pointer transition-all ${
                  selectedStore?._id === store._id ? 'ring-2 ring-earth-sage-500' : ''
                }`}
              >
                <StoreCard store={store} variant="list" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No stores found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="text-earth-sage-600 hover:text-earth-sage-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Panel - Map */}
      <div className="w-full md:w-2/3 lg:w-3/5 relative">
        <MapComponent
          stores={filteredStores}
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
        />
      </div>
    </div>
  )
}