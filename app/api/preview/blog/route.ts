import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug } from '@/lib/data/sanity-store-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const documentId = searchParams.get('id')

  if (!slug && !documentId) {
    return NextResponse.json({ error: 'Missing slug or document ID' }, { status: 400 })
  }

  try {
    // Get the blog post data
    const post = await getBlogPostBySlug(slug || documentId)
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Return the preview data
    return NextResponse.json({
      post,
      previewUrl: `/blog/${post.slug.current}?preview=true`,
    })
  } catch (error) {
    console.error('Preview API error:', error)
    return NextResponse.json({ error: 'Failed to fetch preview data' }, { status: 500 })
  }
}