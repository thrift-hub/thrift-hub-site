'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogPostPreview from '@/components/preview/BlogPostPreview'

function PreviewContent() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('id')
  const slug = searchParams.get('slug')

  if (!documentId && !slug) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Error</h1>
          <p className="text-gray-600">Missing document ID or slug parameter</p>
        </div>
      </div>
    )
  }

  return <BlogPostPreview documentId={documentId || ''} slug={slug || undefined} />
}

export default function BlogPreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}