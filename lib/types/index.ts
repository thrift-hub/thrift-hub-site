export interface Store {
  _id: string
  name: string
  slug: {
    current: string
  }
  cardDescription?: string
  description?: any[]
  editorialSummary?: string
  location: {
    lat: number
    lng: number
  }
  formattedAddress: string
  placeId?: string
  hours?: {
    weekdayText?: string[]
  }
  primaryCategory: Category
  secondaryCategories?: Category[]
  neighborhood: Neighborhood
  metrics?: {
    priceLevel?: number
    rating?: number
    userRatingsTotal?: number
  }
  website?: string
  googleMapsUrl?: string
  featuredImage?: SanityImage
  gallery?: SanityImage[]
}

export interface Category {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  icon?: SanityImage
}

export interface Neighborhood {
  _id: string
  name: string
  slug: {
    current: string
  }
  region: Region
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface Region {
  _id: string
  name: string
  slug: {
    current: string
  }
  city: City
}

export interface City {
  _id: string
  name: string
  slug: {
    current: string
  }
  state?: string
  center?: {
    lat: number
    lng: number
  }
  defaultZoom?: number
}

export interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  author?: string
  publishedAt: string
  excerpt: string
  featuredImage: SanityImage
  content: any[]
  featuredStores?: Store[]
  categories?: Category[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface MapFilters {
  categories?: string[]
  neighborhoods?: string[]
  stores?: string[]
}