import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/lib/types'

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

if (!projectId || !dataset) {
  throw new Error('Missing Sanity environment variables. Please check your .env.local file.')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN for fresh data
  token: process.env.SANITY_API_TOKEN, // Only used for authenticated requests
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  // Return a placeholder URL when no image is provided
  if (!source) {
    return {
      width: () => ({
        height: () => ({
          url: () => '/images/store-placeholder.svg'
        })
      })
    }
  }
  return builder.image(source)
}