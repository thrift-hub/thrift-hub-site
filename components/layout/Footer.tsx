import { FC } from 'react'
import Link from 'next/link'

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    explore: [
      { name: 'Discover Map', href: '/cities/new-york/map' },
      { name: 'All Stores', href: '/cities/new-york' },
      { name: 'Categories', href: '/categories' },
      { name: 'Neighborhoods', href: '/neighborhoods' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Shopping Guides', href: '/blog/guides' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    categories: [
      { name: 'Vintage', href: '/cities/new-york/map?category=vintage' },
      { name: 'Thrift', href: '/cities/new-york/map?category=thrift' },
      { name: 'Consignment', href: '/cities/new-york/map?category=consignment' },
      { name: 'Furniture', href: '/cities/new-york/map?category=furniture' },
    ],
  }
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-earth-sage-600 mb-4">ThriftHub</h3>
            <p className="text-sm text-gray-600">
              Your curated guide to the best second-hand stores in New York City.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-earth-sage-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-earth-sage-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-earth-sage-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} ThriftHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}