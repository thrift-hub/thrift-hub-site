import groq from 'groq'

export const storeFields = groq`
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
  metrics,
  website,
  googleMapsUrl,
  featuredImage,
  gallery,
  primaryCategory-> {
    _id,
    name,
    slug
  },
  secondaryCategories[]-> {
    _id,
    name,
    slug
  },
  neighborhood-> {
    _id,
    name,
    slug,
    region-> {
      _id,
      name,
      slug,
      city-> {
        _id,
        name,
        slug
      }
    }
  }
`

export const STORES_QUERY = groq`
  *[_type == "store" && neighborhood->region->city->slug.current == $city] {
    ${storeFields}
  } | order(name asc)
`

export const STORE_BY_SLUG_QUERY = groq`
  *[_type == "store" && slug.current == $slug][0] {
    ${storeFields}
  }
`

export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    icon
  }
`

export const NEIGHBORHOODS_QUERY = groq`
  *[_type == "neighborhood" && region->city->slug.current == $city] | order(name asc) {
    _id,
    name,
    slug,
    bounds,
    region-> {
      _id,
      name,
      slug
    }
  }
`

export const BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    featuredImage,
    categories[]-> {
      _id,
      name,
      slug
    },
    "featuredStoreCount": count(featuredStores)
  }
`

export const BLOG_POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    featuredImage,
    content,
    categories[]-> {
      _id,
      name,
      slug
    },
    featuredStores[]-> {
      ${storeFields}
    },
    seo
  }
`

export const CITY_QUERY = groq`
  *[_type == "city" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    state,
    center,
    defaultZoom
  }
`