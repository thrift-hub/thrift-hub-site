'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Badge } from '@/components/ui'
import { BlogPost } from '@/lib/types'
import { urlFor } from '@/lib/sanity/client'

interface BlogPostPreviewProps {
  documentId: string
  slug?: string
}

// Custom components for rendering portable text blocks
const portableTextComponents = {
  types: {
    storeSpotlight: ({ value }: any) => (
      <div className="my-8 p-6 bg-earth-cream-50 rounded-lg border border-earth-cream-200">
        <div className="flex items-center gap-4 mb-4">
          {value.highlightImage && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={value.highlightImage}
                alt={value.store?.name || 'Store'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {value.customTitle || value.store?.name || 'Featured Store'}
            </h3>
            <p className="text-gray-600">{value.spotlight}</p>
          </div>
        </div>
        <button className="bg-earth-sage-600 text-white px-4 py-2 rounded-md hover:bg-earth-sage-700 transition-colors">
          {value.ctaText || 'View on Map'}
        </button>
      </div>
    ),
    
    imageGallery: ({ value }: any) => (
      <div className="my-8">
        {value.title && (
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{value.title}</h3>
        )}
        <div className={`grid gap-4 ${
          value.layout === 'grid-3' ? 'grid-cols-3' : 
          value.layout === 'grid-2' ? 'grid-cols-2' : 
          'grid-cols-1'
        }`}>
          {value.images?.map((img: any, index: number) => (
            <div key={index} className="relative">
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={img.image}
                  alt={img.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              {img.caption && (
                <p className="mt-2 text-sm text-gray-600">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    
    callToAction: ({ value }: any) => (
      <div className={`my-8 p-8 rounded-lg text-center ${
        value.backgroundColor === 'sage' ? 'bg-earth-sage-100' :
        value.backgroundColor === 'cream' ? 'bg-earth-cream-100' :
        value.backgroundColor === 'light' ? 'bg-gray-50' :
        'bg-white border border-gray-200'
      }`}>
        {value.heading && (
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.heading}</h3>
        )}
        {value.text && (
          <p className="text-gray-600 mb-6 text-lg">{value.text}</p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          {value.buttons?.map((button: any, index: number) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                button.style === 'primary' ? 'bg-earth-sage-600 text-white hover:bg-earth-sage-700' :
                button.style === 'secondary' ? 'bg-earth-terracotta-600 text-white hover:bg-earth-terracotta-700' :
                button.style === 'outline' ? 'border-2 border-earth-sage-600 text-earth-sage-600 hover:bg-earth-sage-50' :
                'text-earth-sage-600 hover:text-earth-sage-700'
              }`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    ),
    
    embeddedMap: ({ value }: any) => (
      <div className="my-8">
        {value.title && (
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{value.title}</h3>
        )}
        {value.description && (
          <p className="text-gray-600 mb-4">{value.description}</p>
        )}
        <div className={`bg-earth-sage-100 rounded-lg flex items-center justify-center ${
          value.mapSettings?.height === 'small' ? 'h-64' :
          value.mapSettings?.height === 'large' ? 'h-96' :
          value.mapSettings?.height === 'xlarge' ? 'h-[600px]' :
          'h-80'
        }`}>
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="font-medium">Interactive Map Preview</p>
            <p className="text-sm">{value.mapType || 'stores'} • {value.featuredStores?.length || 0} stores</p>
          </div>
        </div>
      </div>
    ),
    
    pullQuote: ({ value }: any) => (
      <div className={`my-8 p-6 rounded-lg ${
        value.backgroundColor === 'sage' ? 'bg-earth-sage-50 border-l-4 border-earth-sage-400' :
        value.backgroundColor === 'cream' ? 'bg-earth-cream-50 border-l-4 border-earth-cream-400' :
        value.backgroundColor === 'stone' ? 'bg-earth-stone-50 border-l-4 border-earth-stone-400' :
        'bg-gray-50 border-l-4 border-gray-400'
      }`}>
        <div className="flex items-start gap-4">
          {value.showQuoteMarks && (
            <div className="text-4xl text-earth-sage-400 leading-none">"</div>
          )}
          <div className="flex-1">
            <blockquote className="text-xl text-gray-900 font-medium mb-4">
              {value.quote}
            </blockquote>
            {value.attribution && (
              <cite className="text-gray-600 font-medium">
                — {value.attribution.name}
                {value.attribution.title && `, ${value.attribution.title}`}
              </cite>
            )}
          </div>
        </div>
      </div>
    ),
    
    image: ({ value }: any) => (
      <div className="my-8">
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={value.asset?.url || '/placeholder-image.jpg'}
            alt={value.alt || 'Blog image'}
            fill
            className="object-cover"
          />
        </div>
      </div>
    ),
  },
  
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-earth-sage-600 hover:text-earth-sage-700 underline">
        {children}
      </a>
    ),
  },
  
  block: {
    normal: ({ children }: any) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-semibold text-gray-900 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-medium text-gray-900 mb-3">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-earth-sage-400 pl-6 my-6 text-gray-700 italic">
        {children}
      </blockquote>
    ),
  },
}

export default function BlogPostPreview({ documentId, slug }: BlogPostPreviewProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/preview/blog?${slug ? `slug=${slug}` : `id=${documentId}`}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch preview: ${response.status}`)
        }
        
        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error('Preview fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (documentId || slug) {
      fetchPreview()
    }
  }, [documentId, slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Preview Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">No blog post found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          {post.categories?.map((category) => (
            <Badge key={category._id} variant="secondary" size="sm">
              {category.name}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
          <Image
            src={urlFor(post.featuredImage).width(800).height(400).url()}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        <PortableText
          value={post.content}
          components={portableTextComponents}
        />
      </article>
    </div>
  )
}