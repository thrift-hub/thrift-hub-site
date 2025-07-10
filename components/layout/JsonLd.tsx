import { FC } from 'react'
import Head from 'next/head'
import { Store } from '@/lib/types'

interface StoreJsonLdProps {
  store: Store
}

export const StoreJsonLd: FC<StoreJsonLdProps> = ({ store }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.name,
    description: store.cardDescription || store.editorialSummary || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/stores/${store.slug.current}`,
    telephone: '', // Add if available
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.formattedAddress.split(',')[0],
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: store.formattedAddress.match(/\d{5}/)?.[0] || '',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.location.lat,
      longitude: store.location.lng,
    },
    openingHours: store.hours?.weekdayText || [],
    priceRange: store.metrics?.priceLevel ? '$'.repeat(store.metrics.priceLevel) : undefined,
    aggregateRating: store.metrics?.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: store.metrics.rating,
          reviewCount: store.metrics.userRatingsTotal,
        }
      : undefined,
  }
  
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}

interface BlogPostJsonLdProps {
  title: string
  description: string
  author: string
  publishedTime: string
  url: string
  image?: string
}

export const BlogPostJsonLd: FC<BlogPostJsonLdProps> = ({
  title,
  description,
  author,
  publishedTime,
  url,
  image,
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedTime,
    url,
    image: image ? `${process.env.NEXT_PUBLIC_SITE_URL}${image}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'ThriftHub NYC',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  }
  
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}