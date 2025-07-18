'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getStoresByCity, getAllCategories, getNeighborhoodsByCity, getRegionsByCity } from '@/lib/data/local-store-service'
import { Store, Category, Neighborhood } from '@/lib/types'
import { StoreCard } from '@/components/store/StoreCard'
import { StoreDetailPanel } from '@/components/store/StoreDetailPanel'
import { Select, Input, Button, Badge } from '@/components/ui'
import MapComponent from '@/components/map/MapComponent'

type Region = {
  _id: string
  name: string
  slug: { current: string }
}

export default function DiscoveryMapPage() {
  const searchParams = useSearchParams()
  
  // State
  const [stores, setStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null)
  const [isFilteringStores, setIsFilteringStores] = useState(false)
  const [detailPanelStore, setDetailPanelStore] = useState<Store | null>(null)
  const [activeFilterTab, setActiveFilterTab] = useState<'categories' | 'regions'>('categories')
  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Get city slug from the URL path
        const citySlug = 'new-york' // Since this is /cities/new-york/map
        
        const [storesData, categoriesData, neighborhoodsData, regionsData] = await Promise.all([
          getStoresByCity(citySlug),
          getAllCategories(),
          getNeighborhoodsByCity(citySlug),
          getRegionsByCity(citySlug),
        ])
        
        setStores(storesData)
        setCategories(categoriesData)
        setNeighborhoods(neighborhoodsData)
        setRegions(regionsData)
        
        // Check for URL parameters
        const categoryParam = searchParams.get('category')
        const neighborhoodParam = searchParams.get('neighborhood')
        const regionParam = searchParams.get('region')
        const storesParam = searchParams.get('stores')
        
        if (categoryParam) {
          setSelectedCategories(categoryParam.split(','))
        }
        if (neighborhoodParam) {
          setSelectedNeighborhoods(neighborhoodParam.split(','))
        }
        if (regionParam) {
          setSelectedRegions(regionParam.split(','))
        }
        // Note: storesParam filtering will be handled by the memoized filteredStores
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [searchParams])
  
  // Memoized filtering logic - runs client-side only
  const filteredStores = useMemo(() => {
    if (!stores.length) return []
    
    let filtered = stores // Start with all loaded stores
    
    
    // Apply category, neighborhood, and region filters if any are selected
    if (selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || selectedRegions.length > 0) {
      filtered = filtered.filter(store => {
        let matchesCategory = true
        let matchesNeighborhood = true
        let matchesRegion = true
        
        // Check category filter
        if (selectedCategories.length > 0) {
          matchesCategory = selectedCategories.some(catSlug => {
            // Check primary category
            if (store.primaryCategory?.slug?.current === catSlug) return true
            // Check secondary categories
            return store.secondaryCategories?.some(cat => cat.slug?.current === catSlug)
          })
        }
        
        // Check neighborhood filter
        if (selectedNeighborhoods.length > 0) {
          matchesNeighborhood = selectedNeighborhoods.includes(store.neighborhood?.slug?.current)
        }
        
        // Check region filter
        if (selectedRegions.length > 0) {
          matchesRegion = selectedRegions.includes(store.neighborhood?.region?.slug?.current)
        }
        
        return matchesCategory && matchesNeighborhood && matchesRegion
      })
    }
    
    // Apply search query last
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.cardDescription?.toLowerCase().includes(query) ||
        store.neighborhood.name.toLowerCase().includes(query)
      )
    }
    return filtered
  }, [stores, selectedCategories, selectedNeighborhoods, selectedRegions, searchQuery])

  // Simple effect to show filtering animation
  useEffect(() => {
    if (stores.length > 0) {
      setIsFilteringStores(true)
      const timer = setTimeout(() => setIsFilteringStores(false), 200)
      return () => clearTimeout(timer)
    }
  }, [selectedCategories, selectedNeighborhoods, selectedRegions, searchQuery])
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    }
    if (selectedNeighborhoods.length > 0) {
      params.set('neighborhood', selectedNeighborhoods.join(','))
    }
    if (selectedRegions.length > 0) {
      params.set('region', selectedRegions.join(','))
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [selectedCategories, selectedNeighborhoods, selectedRegions])
  
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

  const handleRegionChange = (value: string) => {
    if (value && !selectedRegions.includes(value)) {
      setSelectedRegions([...selectedRegions, value])
    }
  }
  
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category))
  }
  
  const removeNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== neighborhood))
  }

  const removeRegion = (region: string) => {
    setSelectedRegions(selectedRegions.filter(r => r !== region))
  }
  
  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedNeighborhoods([])
    setSelectedRegions([])
    setSearchQuery('')
  }

  const handleStoreCardClick = (store: Store) => {
    setSelectedStore(store) // This will zoom the map
    setDetailPanelStore(store) // This will show the detail panel
  }

  const handleMapStoreSelect = (store: Store) => {
    setSelectedStore(store) // This will zoom the map
    setDetailPanelStore(store) // This will show the detail panel
  }

  const handleCloseDetailPanel = () => {
    setDetailPanelStore(null)
    setSelectedStore(null) // Also clear map selection
  }
  
  const hasActiveFilters = selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || selectedRegions.length > 0 || searchQuery

  // Get filtered neighborhoods based on selected regions (memoized for performance)
  const filteredNeighborhoods = useMemo(() => {
    if (selectedRegions.length === 0) return neighborhoods
    return neighborhoods.filter(n => selectedRegions.includes(n.region?.slug?.current))
  }, [neighborhoods, selectedRegions])
  
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left Panel - Store List */}
      <div className="w-full md:w-1/3 lg:w-2/5 overflow-y-auto bg-white shadow-lg transition-all duration-300">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Discover NYC Stores
            </h1>
            {isFilteringStores && (
              <div className="flex items-center gap-2 text-earth-sage-600">
                <div className="w-4 h-4 border-2 border-earth-sage-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Filtering...</span>
              </div>
            )}
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Input
              type="search"
              placeholder="Search stores, neighborhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-earth-sage-500 focus:border-earth-sage-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setActiveFilterTab('categories')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilterTab === 'categories'
                    ? 'bg-white text-earth-sage-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Categories
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-earth-sage-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center inline-flex">
                    {selectedCategories.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveFilterTab('regions')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilterTab === 'regions'
                    ? 'bg-white text-earth-sage-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Regions
                {(selectedRegions.length > 0 || selectedNeighborhoods.length > 0) && (
                  <span className="ml-2 bg-earth-sage-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center inline-flex">
                    {selectedRegions.length + selectedNeighborhoods.length}
                  </span>
                )}
              </button>
            </div>

            {/* Categories Tab Content */}
            {activeFilterTab === 'categories' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <Select
                  options={categories.map(cat => ({
                    value: cat.slug.current,
                    label: cat.name
                  }))}
                  placeholder="Select a category..."
                  value=""
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-earth-sage-500"
                />
              </div>
            )}

            {/* Regions Tab Content */}
            {activeFilterTab === 'regions' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                <div className="relative">
                  <Select
                    options={regions.map(r => ({
                      value: r.slug.current,
                      label: r.name
                    }))}
                    placeholder="Select a region..."
                    value=""
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-earth-sage-500"
                  />
                  {selectedRegions.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-earth-sage-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedRegions.length}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Select
                    options={filteredNeighborhoods.map(n => ({
                      value: n.slug.current,
                      label: n.name
                    }))}
                    placeholder={selectedRegions.length > 0 ? "Select a neighborhood..." : "Select a region first..."}
                    value=""
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-earth-sage-500"
                    disabled={selectedRegions.length === 0}
                  />
                  {selectedNeighborhoods.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-earth-sage-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedNeighborhoods.length}
                    </span>
                  )}
                </div>
                {selectedRegions.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Select a region to filter neighborhoods</p>
                )}
              </div>
            )}
          </div>
          
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="animate-in slide-in-from-top-2 duration-300 mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCategories.map((cat, index) => {
                  const category = categories.find(c => c.slug.current === cat)
                  return category ? (
                    <div key={cat} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                      <Badge 
                        variant="primary" 
                        className="flex items-center gap-1"
                      >
                        📂 {category.name}
                        <button
                          onClick={() => removeCategory(cat)}
                          className="ml-1 hover:text-gray-700 transition-colors duration-150"
                        >
                          ×
                        </button>
                      </Badge>
                    </div>
                  ) : null
                })}
                {selectedRegions.map((r, index) => {
                  const region = regions.find(rg => rg.slug.current === r)
                  return region ? (
                    <div key={r} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${(selectedCategories.length + index) * 50}ms` }}>
                      <Badge 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        🏙️ {region.name}
                        <button
                          onClick={() => removeRegion(r)}
                          className="ml-1 hover:text-gray-700 transition-colors duration-150"
                        >
                          ×
                        </button>
                      </Badge>
                    </div>
                  ) : null
                })}
                {selectedNeighborhoods.map((n, index) => {
                  const neighborhood = neighborhoods.find(nh => nh.slug.current === n)
                  return neighborhood ? (
                    <div key={n} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${(selectedCategories.length + selectedRegions.length + index) * 50}ms` }}>
                      <Badge 
                        variant="default" 
                        className="flex items-center gap-1"
                      >
                        📍 {neighborhood.name}
                        <button
                          onClick={() => removeNeighborhood(n)}
                          className="ml-1 hover:text-gray-700 transition-colors duration-150"
                        >
                          ×
                        </button>
                      </Badge>
                    </div>
                  ) : null
                })}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-earth-sage-600 transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 transition-all duration-300">
              <span className="font-medium">{filteredStores.length}</span> 
              {filteredStores.length === 1 ? ' store' : ' stores'} found
            </p>
            {hasActiveFilters && (
              <div className="flex items-center gap-1 text-xs text-earth-sage-600">
                <div className="w-2 h-2 bg-earth-sage-500 rounded-full animate-pulse"></div>
                Filtered
              </div>
            )}
          </div>
        </div>
        
        {/* Store List */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isFilteringStores ? (
            <div className="space-y-4">
              {filteredStores.slice(0, 3).map((store, index) => (
                <div 
                  key={store._id}
                  className="opacity-50 pointer-events-none transition-opacity duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <StoreCard 
                    store={store} 
                    variant="list"
                    isSelected={false}
                    isHovered={false}
                  />
                </div>
              ))}
              <div className="flex items-center justify-center py-8 text-earth-sage-600">
                <div className="w-6 h-6 border-2 border-earth-sage-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Updating results...</span>
              </div>
            </div>
          ) : filteredStores.length > 0 ? (
            <div className="space-y-4">
              {filteredStores.map((store, index) => (
                <div
                  key={store._id}
                  onMouseEnter={() => setHoveredStore(store)}
                  onMouseLeave={() => setHoveredStore(null)}
                  className={`transition-all duration-200 ease-in-out transform animate-in fade-in slide-in-from-bottom-4 ${
                    selectedStore?._id === store._id 
                      ? 'ring-2 ring-earth-sage-500 shadow-lg scale-[1.02]' 
                      : hoveredStore?._id === store._id
                      ? 'shadow-md scale-[1.01] bg-gray-50'
                      : 'hover:shadow-md hover:scale-[1.01] hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <StoreCard 
                    store={store} 
                    variant="list"
                    isSelected={selectedStore?._id === store._id}
                    isHovered={hoveredStore?._id === store._id}
                    onClick={() => handleStoreCardClick(store)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results."
                  : "No stores match your current criteria."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-earth-sage-600 text-white rounded-lg hover:bg-earth-sage-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Panel - Map */}
      <div className="w-full md:w-2/3 lg:w-3/5 relative">
        <MapComponent
          stores={filteredStores}
          allStores={stores}
          selectedStore={selectedStore}
          hoveredStore={hoveredStore}
          onStoreSelect={handleMapStoreSelect}
          onStoreHover={setHoveredStore}
        />
      </div>
      
      {/* Store Detail Panel */}
      {detailPanelStore && (
        <StoreDetailPanel 
          store={detailPanelStore} 
          onClose={handleCloseDetailPanel}
        />
      )}
    </div>
  )
}