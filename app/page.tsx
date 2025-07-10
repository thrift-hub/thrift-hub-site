import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'

export default function Home() {
  const features = [
    {
      title: 'Interactive Map',
      description: 'Explore NYC\'s thrift scene with our powerful map tool. Filter by category, neighborhood, and more.',
      icon: '🗺️',
    },
    {
      title: 'Curated Selection',
      description: 'Every store is hand-picked and reviewed by our team of thrifting experts.',
      icon: '✨',
    },
    {
      title: 'Editorial Content',
      description: 'Read shopping guides, trend reports, and insider tips from local thrifting enthusiasts.',
      icon: '📝',
    },
    {
      title: 'Community Driven',
      description: 'Built for and by the NYC thrifting community. Share your favorite finds and hidden gems.',
      icon: '🤝',
    },
  ]
  
  const categories = [
    { name: 'Vintage', count: 42, emoji: '👗' },
    { name: 'Thrift', count: 38, emoji: '🛍️' },
    { name: 'Consignment', count: 25, emoji: '💎' },
    { name: 'Furniture', count: 15, emoji: '🪑' },
  ]
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-earth-sage-50 via-white to-thrift-cream overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="NYC street with vintage shops"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              Discover NYC's Best<br />
              <span className="text-earth-sage-600">Second-Hand Stores</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your curated guide to thrift stores, vintage shops, and consignment boutiques across New York City.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cities/new-york/map">
                <Button size="lg">
                  Explore the Map
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Read Shopping Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                <div className="text-sm text-gray-600">{category.name} Stores</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Everything You Need to Thrift Smart
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ThriftHub makes it easy to discover, explore, and shop at the best second-hand stores in NYC.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-earth-sage-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Ready to Start Thrifting?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of New Yorkers who use ThriftHub to find unique fashion, vintage treasures, and sustainable style.
          </p>
          <Link href="/cities/new-york/map">
            <Button size="lg">
              Explore NYC Stores
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}