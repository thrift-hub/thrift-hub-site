'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Store } from '@/lib/types'

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapComponentProps {
  stores: Store[] // Currently filtered stores
  allStores?: Store[] // All available stores (for marker initialization)
  selectedStore: Store | null
  hoveredStore?: Store | null
  onStoreSelect: (store: Store) => void
  onStoreHover?: (store: Store | null) => void
}

export default function MapComponent({ stores, allStores, selectedStore, hoveredStore, onStoreSelect, onStoreHover }: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
  
  // Memoize store IDs to trigger effect properly when stores change
  const storeIds = useMemo(() => stores.map(s => s._id), [stores])
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
  
  // Callback ref to get notified when the DOM element is available
  const mapContainerRef = (node: HTMLDivElement | null) => {
    setMapContainer(node)
  }
  
  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer) {
        setMapError('Map container not found')
        return
      }
      
      if (map.current) {
        return
      }
    
      if (!mapboxgl.accessToken) {
        setMapError('Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
        return
      }
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.0060, 40.7128], // NYC coordinates
          zoom: 12,
        })
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
        
        // Add fullscreen control
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
        
        // Set loaded state when map is ready
        map.current.on('load', () => {
          setMapLoaded(true)
        })
        
        map.current.on('error', (e) => {
          setMapError('Map failed to load: ' + e.error?.message)
        })
        
        // Also listen for idle event
        map.current.on('idle', () => {
          if (!mapLoaded) {
            setMapLoaded(true)
          }
        })
        
        // Force map to show after 3 seconds regardless
        setTimeout(() => {
          setMapLoaded(true)
        }, 3000)
        
      } catch (error) {
        setMapError('Failed to initialize map. Please check your Mapbox configuration.')
      }
    }
    
    // Initialize when container becomes available
    if (mapContainer && !map.current) {
      initializeMap()
    }
    
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapContainer, mapLoaded])
  
  // Initialize all markers once when all stores are available
  useEffect(() => {
    if (!map.current || !mapLoaded || !allStores || allStores.length === 0) return
    
    const initializeAllMarkers = () => {
      if (!map.current) return
      
      // Clear existing markers
      Object.values(markers.current).forEach(marker => marker.remove())
      markers.current = {}
      
      // Create markers for ALL stores (but don't worry about visibility yet)
      allStores.forEach(store => {
        if (!store.location || !store.location.lng || !store.location.lat) {
          return
        }
        
        // Create custom marker element
        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.style.width = '30px'
        el.style.height = '30px'
        el.style.backgroundImage = 'url(/images/map-pin.svg)'
        el.style.backgroundSize = 'contain'
        el.style.cursor = 'pointer'
        el.style.transition = 'width 0.2s ease-out, height 0.2s ease-out'
        
        // If no custom pin image, use a colored div
        if (!el.style.backgroundImage) {
          el.style.backgroundColor = '#6d8c76'
          el.style.borderRadius = '50%'
          el.style.border = '3px solid white'
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
        }
        
        try {
          // Create marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([store.location.lng, store.location.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-semibold">${store.name}</h3>
                    <p class="text-sm text-gray-600">${store.neighborhood.name}</p>
                    <p class="text-sm mt-1">${store.primaryCategory.name}</p>
                  </div>
                `)
            )
          
          // Create marker but don't add to map yet (filtering will control visibility)
          if (map.current) {
            // Add click handler
            el.addEventListener('click', () => {
              onStoreSelect(store)
            })
            
            // Add hover handlers for map markers
            el.addEventListener('mouseenter', () => {
              onStoreHover?.(store)
            })
            
            el.addEventListener('mouseleave', () => {
              onStoreHover?.(null)
            })
            
            // Store marker with reference to store ID
            markers.current[store._id] = marker
          }
        } catch (error) {
          // Silently skip markers that fail to add
        }
      })
    }
    
    initializeAllMarkers()
  }, [allStores, mapLoaded])
  
  // Update marker visibility when filtered stores change
  useEffect(() => {
    if (!map.current || Object.keys(markers.current).length === 0) return
    
    // Get IDs of stores that should be visible
    const visibleStoreIds = new Set(stores.map(store => store._id))
    
    // Show/hide markers based on current filter using Mapbox methods
    Object.entries(markers.current).forEach(([storeId, marker]) => {
      const shouldBeVisible = visibleStoreIds.has(storeId)
      
      if (shouldBeVisible) {
        // Add marker to map if not already added
        if (!marker._map) {
          marker.addTo(map.current!)
        }
      } else {
        // Remove marker from map
        marker.remove()
      }
    })
    
    // Update map bounds to fit visible markers only (with delay to avoid race condition)
    if (stores.length > 0 && map.current) {
      setTimeout(() => {
        if (!map.current) return
        try {
          const bounds = new mapboxgl.LngLatBounds()
          stores.forEach(store => {
            if (store.location && store.location.lng && store.location.lat) {
              bounds.extend([store.location.lng, store.location.lat])
            }
          })
          
          // Only fit bounds if we have valid bounds
          if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50 })
          }
        } catch (error) {
          // Silently handle bounds fitting errors
        }
      }, 100)
    }
  }, [storeIds])
  
  // Update marker styles based on hover and selection states
  useEffect(() => {
    Object.entries(markers.current).forEach(([storeId, marker]) => {
      const markerElement = marker.getElement()
      const isHovered = hoveredStore?._id === storeId
      
      // Simple hover scaling - make marker larger when hovered
      if (isHovered) {
        markerElement.style.width = '36px'
        markerElement.style.height = '36px'
        markerElement.style.zIndex = '50'
      } else {
        markerElement.style.width = '30px'
        markerElement.style.height = '30px'
        markerElement.style.zIndex = '1'
      }
    })
  }, [hoveredStore])
  
  // Handle selected store - zoom in when clicked, fit bounds when deselected
  useEffect(() => {
    if (!map.current) return
    
    if (selectedStore) {
      // Check if selected store has valid location
      if (!selectedStore.location || !selectedStore.location.lng || !selectedStore.location.lat) {
        return
      }
      
      try {
        // Zoom in to selected store
        map.current.flyTo({
          center: [selectedStore.location.lng, selectedStore.location.lat],
          zoom: 16,
          duration: 800,
        })
        
        // Open popup for selected marker
        const marker = markers.current[selectedStore._id]
        if (marker) {
          marker.togglePopup()
        }
      } catch (error) {
        // Silently handle selected store errors
      }
    } else if (stores.length > 0) {
      // No store selected, revert to showing all filtered stores
      try {
        const bounds = new mapboxgl.LngLatBounds()
        stores.forEach(store => {
          if (store.location && store.location.lng && store.location.lat) {
            bounds.extend([store.location.lng, store.location.lat])
          }
        })
        
        // Only fit bounds if we have valid bounds
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, { padding: 50, duration: 800 })
        }
      } catch (error) {
        // Silently handle bounds fitting errors
      }
    }
  }, [selectedStore, stores])
  
  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Not Available</h3>
          <p className="text-sm text-gray-600 max-w-md">{mapError}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      {!mapLoaded && !mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🗺️</div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Not Available</h3>
            <p className="text-sm text-gray-600 max-w-md">{mapError}</p>
          </div>
        </div>
      ) : (
        // Map is loaded - Mapbox will render into this container
        <></>
      )}
    </div>
  )
}