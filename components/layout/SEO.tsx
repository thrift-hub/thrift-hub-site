import { FC } from 'react'
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
  noindex?: boolean
}

export const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  image = '/images/og-default.jpg',
  type = 'website',
  publishedTime,
  author,
  noindex = false,
}) => {
  const siteName = 'ThriftHub NYC'
  const fullTitle = `${title} | ${siteName}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thrifthub.nyc'
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl)
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  )
}