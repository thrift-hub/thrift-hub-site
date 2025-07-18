'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Store } from '@/lib/types'

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapComponentProps {
  stores: Store[]
  selectedStore: Store | null
  onStoreSelect: (store: Store) => void
}

export default function MapComponent({ stores, selectedStore, onStoreSelect }: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
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
  
  // Update markers when stores change
  useEffect(() => {
    if (!map.current) return
    
    // Wait for map to be fully loaded
    const addMarkers = () => {
      if (!map.current) return
      
      // Remove existing markers
      Object.values(markers.current).forEach(marker => marker.remove())
      markers.current = {}
      
      // Add new markers
      stores.forEach(store => {
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
          
          // Only add to map if map is still available
          if (map.current) {
            marker.addTo(map.current)
            
            // Add click handler
            el.addEventListener('click', () => {
              onStoreSelect(store)
            })
            
            markers.current[store._id] = marker
          }
        } catch (error) {
          // Silently skip markers that fail to add
        }
      })
      
      // Fit bounds to show all markers
      if (stores.length > 0 && map.current) {
        try {
          const bounds = new mapboxgl.LngLatBounds()
          stores.forEach(store => {
            if (store.location && store.location.lng && store.location.lat) {
              bounds.extend([store.location.lng, store.location.lat])
            }
          })
          map.current.fitBounds(bounds, { padding: 50 })
        } catch (error) {
          // Silently handle bounds fitting errors
        }
      }
    }
    
    // If map is loaded, add markers immediately
    if (map.current.loaded()) {
      addMarkers()
    } else {
      // Otherwise wait for map to load
      map.current.on('load', addMarkers)
    }
  }, [stores, onStoreSelect])
  
  // Handle selected store
  useEffect(() => {
    if (!selectedStore || !map.current) return
    
    // Check if selected store has valid location
    if (!selectedStore.location || !selectedStore.location.lng || !selectedStore.location.lat) {
      return
    }
    
    try {
      // Fly to selected store
      map.current.flyTo({
        center: [selectedStore.location.lng, selectedStore.location.lat],
        zoom: 15,
        duration: 1000,
      })
      
      // Open popup for selected marker
      const marker = markers.current[selectedStore._id]
      if (marker) {
        marker.togglePopup()
      }
    } catch (error) {
      // Silently handle selected store errors
    }
  }, [selectedStore])
  
  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Not Available</h3>
          <p className="text-sm text-gray-600 max-w-md">{mapError}</p>
          <p className="text-xs text-gray-500 mt-2">Token: {mapboxgl.accessToken ? 'Present' : 'Missing'}</p>
          <p className="text-xs text-gray-500">Stores: {stores.length}</p>
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