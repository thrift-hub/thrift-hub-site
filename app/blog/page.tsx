import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/lib/data/local-store-service'
import { Card, CardContent, Badge } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Blog - Thrifting Guides & Tips',
  description: 'Read our latest guides, tips, and stories about thrifting in New York City. Discover the best stores, trends, and shopping strategies.',
}

// Featured images for blog posts
const getBlogPostImage = (index: number) => {
  const images = [
    "https://images.unsplash.com/photo-1559563458-527cfc738944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502570149819-b2260483d302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  ]
  return images[index % images.length]
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              ThriftHub Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your source for thrifting guides, store spotlights, and sustainable fashion insights in NYC.
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`}>
                <Card hover className="h-full">
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <Image
                      src={getBlogPostImage(index)}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex gap-2 mb-3">
                      {post.categories?.map((category) => (
                        <Badge key={category._id} size="sm" variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Coming Soon Message */}
          {posts.length < 3 && (
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                More guides and stories coming soon!
              </p>
              <Link href="/cities/new-york/map" className="text-earth-sage-600 hover:text-earth-sage-700 font-medium">
                Explore stores while you wait →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}