import { Store, Category, Neighborhood, City, BlogPost } from '@/lib/types'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// Sanity GROQ queries
const storeQuery = groq`
  *[_type == "store"] {
    _id,
    name,
    slug,
    cardDescription,
    description,
    editorialSummary,
    location,
    formattedAddress,
    placeId,
    hours,
    primaryCategory->{
      _id,
      name,
      slug
    },
    secondaryCategories[]->{
      _id,
      name,
      slug
    },
    neighborhood->{
      _id,
      name,
      slug,
      region->{
        _id,
        name,
        slug,
        city->{
          _id,
          name,
          slug,
          state,
          center,
          defaultZoom
        }
      }
    },
    metrics,
    website,
    googleMapsUrl
  }
`

const categoryQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    slug
  }
`

const neighborhoodQuery = groq`
  *[_type == "neighborhood"] {
    _id,
    name,
    slug,
    region->{
      _id,
      name,
      slug,
      city->{
        _id,
        name,
        slug,
        state,
        center,
        defaultZoom
      }
    }
  }
`

const cityQuery = groq`
  *[_type == "city"][0] {
    _id,
    name,
    slug,
    state,
    center,
    defaultZoom
  }
`

const blogPostQuery = groq`
  *[_type == "blogPost"] {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    featuredImage,
    content,
    categories[]->{
      _id,
      name,
      slug
    },
    featuredStores[]->{
      _id,
      name,
      slug
    }
  }
`

// Get all stores
export async function getAllStores(): Promise<Store[]> {
  try {
    const stores = await client.fetch(storeQuery)
    console.log(`getAllStores found ${stores?.length || 0} total stores`)
    return stores || []
  } catch (error) {
    console.error('Error fetching stores from Sanity:', error)
    return []
  }
}

// Get stores by city slug
export async function getStoresByCity(citySlug: string): Promise<Store[]> {
  try {
    // First, let's debug what we're getting
    console.log('Getting stores for city:', citySlug)
    
    // First, let's check how many stores we have without any filter
    const allStoresQuery = groq`
      *[_type == "store"] {
        _id,
        name,
        neighborhood->{
          name,
          region->{
            name,
            city->{
              name,
              slug
            }
          }
        }
      }
    `
    const allStores = await client.fetch(allStoresQuery)
    console.log(`Total stores in DB: ${allStores?.length || 0}`)
    
    // Check how many have complete neighborhood->region->city chain
    const withCompleteChain = allStores?.filter((store: any) => 
      store.neighborhood?.region?.city?.slug?.current
    ) || []
    console.log(`Stores with complete neighborhood->region->city: ${withCompleteChain.length}`)
    
    // Check unique cities
    const uniqueCities = [...new Set(
      withCompleteChain.map((store: any) => store.neighborhood?.region?.city?.slug?.current)
    )]
    console.log('Unique cities in data:', uniqueCities)
    
    const query = groq`
      *[_type == "store" && neighborhood->region->city->slug.current == $citySlug] {
        _id,
        name,
        slug,
        cardDescription,
        description,
        editorialSummary,
        location,
        formattedAddress,
        placeId,
        hours,
        primaryCategory->{
          _id,
          name,
          slug
        },
        secondaryCategories[]->{
          _id,
          name,
          slug
        },
        neighborhood->{
          _id,
          name,
          slug,
          region->{
            _id,
            name,
            slug,
            city->{
              _id,
              name,
              slug,
              state,
              center,
              defaultZoom
            }
          }
        },
        metrics,
        website,
        googleMapsUrl
      }
    `
    const stores = await client.fetch(query, { citySlug })
    console.log(`Found ${stores?.length || 0} stores for city ${citySlug}`)
    
    // Debug: Let's also check a sample store's neighborhood data
    if (stores && stores.length > 0) {
      console.log('Sample store neighborhood data:', {
        store: stores[0].name,
        neighborhood: stores[0].neighborhood?.name,
        region: stores[0].neighborhood?.region?.name,
        city: stores[0].neighborhood?.region?.city?.name
      })
    }
    
    return stores || []
  } catch (error) {
    console.error('Error fetching stores by city from Sanity:', error)
    return []
  }
}

// Get store by slug
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const query = groq`
      *[_type == "store" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        cardDescription,
        description,
        editorialSummary,
        location,
        formattedAddress,
        placeId,
        hours,
        primaryCategory->{
          _id,
          name,
          slug
        },
        secondaryCategories[]->{
          _id,
          name,
          slug
        },
        neighborhood->{
          _id,
          name,
          slug,
          region->{
            _id,
            name,
            slug,
            city->{
              _id,
              name,
              slug,
              state,
              center,
              defaultZoom
            }
          }
        },
        metrics,
        website,
        googleMapsUrl
      }
    `
    const store = await client.fetch(query, { slug })
    return store || null
  } catch (error) {
    console.error('Error fetching store by slug from Sanity:', error)
    return null
  }
}

// Get all unique categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch(categoryQuery)
    return categories?.sort((a: Category, b: Category) => a.name.localeCompare(b.name)) || []
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error)
    return []
  }
}

// Get all unique neighborhoods
export async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  try {
    const neighborhoods = await client.fetch(neighborhoodQuery)
    return neighborhoods?.sort((a: Neighborhood, b: Neighborhood) => a.name.localeCompare(b.name)) || []
  } catch (error) {
    console.error('Error fetching neighborhoods from Sanity:', error)
    return []
  }
}

// Get neighborhoods by city slug
export async function getNeighborhoodsByCity(citySlug: string): Promise<Neighborhood[]> {
  try {
    const query = groq`
      *[_type == "neighborhood" && region->city->slug.current == $citySlug] {
        _id,
        name,
        slug,
        region->{
          _id,
          name,
          slug,
          city->{
            _id,
            name,
            slug,
            state,
            center,
            defaultZoom
          }
        }
      }
    `
    const neighborhoods = await client.fetch(query, { citySlug })
    return neighborhoods?.sort((a: Neighborhood, b: Neighborhood) => a.name.localeCompare(b.name)) || []
  } catch (error) {
    console.error('Error fetching neighborhoods by city from Sanity:', error)
    return []
  }
}

// Get NYC city data
export async function getCityData(): Promise<City> {
  try {
    const city = await client.fetch(cityQuery)
    return city || {
      _id: 'new-york',
      name: 'New York City',
      slug: { current: 'new-york' },
      state: 'NY',
      center: { lat: 40.7128, lng: -74.0060 },
      defaultZoom: 12
    }
  } catch (error) {
    console.error('Error fetching city data from Sanity:', error)
    return {
      _id: 'new-york',
      name: 'New York City',
      slug: { current: 'new-york' },
      state: 'NY',
      center: { lat: 40.7128, lng: -74.0060 },
      defaultZoom: 12
    }
  }
}

// Filter stores by category and/or neighborhood
export async function filterStores(filters: {
  categories?: string[]
  neighborhoods?: string[]
  storeIds?: string[]
  citySlug?: string
}): Promise<Store[]> {
  try {
    let filterConditions = []
    
    // Add city filter if provided
    if (filters.citySlug) {
      filterConditions.push(`neighborhood->region->city->slug.current == "${filters.citySlug}"`)
    }
    
    if (filters.categories && filters.categories.length > 0) {
      const categoryConditions = filters.categories.map(cat => 
        `primaryCategory->slug.current == "${cat}" || "${cat}" in secondaryCategories[]->slug.current`
      ).join(' || ')
      filterConditions.push(`(${categoryConditions})`)
    }
    
    if (filters.neighborhoods && filters.neighborhoods.length > 0) {
      const neighborhoodConditions = filters.neighborhoods.map(neighborhood => 
        `neighborhood->slug.current == "${neighborhood}"`
      ).join(' || ')
      filterConditions.push(`(${neighborhoodConditions})`)
    }
    
    if (filters.storeIds && filters.storeIds.length > 0) {
      const storeIdConditions = filters.storeIds.map(id => 
        `_id == "${id}"`
      ).join(' || ')
      filterConditions.push(`(${storeIdConditions})`)
    }
    
    const whereClause = filterConditions.length > 0 ? 
      ` && (${filterConditions.join(' && ')})` : ''
    
    const query = groq`
      *[_type == "store"${whereClause}] {
        _id,
        name,
        slug,
        cardDescription,
        description,
        editorialSummary,
        location,
        formattedAddress,
        placeId,
        hours,
        primaryCategory->{
          _id,
          name,
          slug
        },
        secondaryCategories[]->{
          _id,
          name,
          slug
        },
        neighborhood->{
          _id,
          name,
          slug,
          region->{
            _id,
            name,
            slug,
            city->{
              _id,
              name,
              slug,
              state,
              center,
              defaultZoom
            }
          }
        },
        metrics,
        website,
        googleMapsUrl
      }
    `
    
    const stores = await client.fetch(query)
    return stores || []
  } catch (error) {
    console.error('Error filtering stores from Sanity:', error)
    return []
  }
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(blogPostQuery)
    if (posts && posts.length > 0) {
      return posts.sort((a: BlogPost, b: BlogPost) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    }
    
    // Return mock data if no blog posts found in Sanity
    return [
      {
        _id: '1',
        title: 'The Ultimate Guide to Thrifting in Brooklyn',
        slug: { current: 'ultimate-guide-thrifting-brooklyn' },
        author: 'Sarah Chen',
        publishedAt: '2024-01-15T10:00:00Z',
        excerpt: 'Discover the best thrift stores in Brooklyn, from Williamsburg vintage boutiques to hidden gems in Bed-Stuy.',
        featuredImage: {
          _type: 'image',
          asset: { _ref: 'image-1', _type: 'reference' }
        },
        content: [],
        categories: [
          { _id: 'vintage', name: 'Vintage', slug: { current: 'vintage' } },
          { _id: 'thrift', name: 'Thrift', slug: { current: 'thrift' } }
        ]
      },
      {
        _id: '2',
        title: '10 Designer Consignment Stores You Need to Know',
        slug: { current: '10-designer-consignment-stores' },
        author: 'Marcus Johnson',
        publishedAt: '2024-01-10T10:00:00Z',
        excerpt: 'From the Upper East Side to SoHo, these consignment shops offer luxury fashion at fraction of retail prices.',
        featuredImage: {
          _type: 'image',
          asset: { _ref: 'image-2', _type: 'reference' }
        },
        content: [],
        categories: [
          { _id: 'consignment', name: 'Consignment', slug: { current: 'consignment' } }
        ]
      }
    ]
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error)
    // Return mock data on error
    return [
      {
        _id: '1',
        title: 'The Ultimate Guide to Thrifting in Brooklyn',
        slug: { current: 'ultimate-guide-thrifting-brooklyn' },
        author: 'Sarah Chen',
        publishedAt: '2024-01-15T10:00:00Z',
        excerpt: 'Discover the best thrift stores in Brooklyn, from Williamsburg vintage boutiques to hidden gems in Bed-Stuy.',
        featuredImage: {
          _type: 'image',
          asset: { _ref: 'image-1', _type: 'reference' }
        },
        content: [],
        categories: [
          { _id: 'vintage', name: 'Vintage', slug: { current: 'vintage' } },
          { _id: 'thrift', name: 'Thrift', slug: { current: 'thrift' } }
        ]
      }
    ]
  }
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const query = groq`
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        author,
        publishedAt,
        excerpt,
        featuredImage,
        content,
        categories[]->{
          _id,
          name,
          slug
        },
        featuredStores[]->{
          _id,
          name,
          slug,
          location,
          neighborhood->{
            name,
            region->{
              name
            }
          }
        }
      }
    `
    const post = await client.fetch(query, { slug })
    if (post) {
      return post
    }
    
    // Fall back to mock data if not found in Sanity
    const mockPosts = await getAllBlogPosts()
    return mockPosts.find(post => post.slug.current === slug) || null
  } catch (error) {
    console.error('Error fetching blog post by slug from Sanity:', error)
    // Fall back to mock data on error
    const mockPosts = await getAllBlogPosts()
    return mockPosts.find(post => post.slug.current === slug) || null
  }
}