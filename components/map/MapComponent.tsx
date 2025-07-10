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
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const [mapError, setMapError] = useState<string | null>(null)
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
      return
    }
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.0060, 40.7128], // NYC coordinates
        zoom: 12,
      })
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      
      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
      
    } catch (error) {
      console.error('Error initializing map:', error)
      setMapError('Failed to initialize map. Please check your Mapbox configuration.')
    }
    
    return () => {
      map.current?.remove()
    }
  }, [])
  
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
          console.warn('Store missing location data:', store.name)
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
          console.error('Error adding marker for store:', store.name, error)
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
          console.error('Error fitting bounds:', error)
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
      console.warn('Selected store missing location data:', selectedStore.name)
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
      console.error('Error handling selected store:', error)
    }
  }, [selectedStore])
  
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
  
  return <div ref={mapContainer} className="w-full h-full" />
}