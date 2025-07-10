# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ThriftHub NYC is a curated, editorial-first discovery platform for second-hand stores in New York City. Built with Next.js 15 App Router, it combines static site generation with dynamic filtering and an interactive map experience.

## Key Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack (uses port 3001 if 3000 is taken)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
node scripts/prepare-data.js  # Analyze store data and show statistics
```

## Architecture Overview

### Data Flow Strategy
The project currently uses a **local JSON data strategy** instead of live Sanity queries:
- Raw store data lives in `stores-export.json` (365 stores)
- `lib/data/local-store-service.ts` transforms raw JSON to TypeScript interfaces
- All data queries go through this service layer for consistency
- Sanity client exists but uses mock values for future migration

### Core Architecture Patterns

**1. Static Generation with Dynamic Filtering**
- All store pages (336 total) use `generateStaticParams` for optimal SEO
- Map page implements client-side filtering with URL state synchronization
- Filter state managed through URL search params for deep linking

**2. Component Architecture**
- `components/ui/` - Base design system components (Button, Card, Badge, etc.)
- `components/store/` - Store-specific components (StoreCard, etc.)
- `components/map/` - Map-related components with Mapbox GL integration
- `components/layout/` - Layout components including SEO and JSON-LD structured data

**3. Data Layer**
- `lib/types/` - Comprehensive TypeScript interfaces for all domain entities
- `lib/data/local-store-service.ts` - Central data service with transformation logic
- `lib/sanity/` - Sanity client configuration (currently using mock values)

### Critical Configuration

**Environment Variables Required:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=    # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=       # Sanity dataset (usually "production")
SANITY_API_TOKEN=                 # Sanity read token
NEXT_PUBLIC_MAPBOX_TOKEN=         # Mapbox access token
NEXT_PUBLIC_SITE_URL=             # Site URL for metadata
```

**Next.js Configuration:**
- `next.config.ts` includes Unsplash image domain for external images
- Uses Turbopack for development builds
- TypeScript strict mode enabled

## Key Technical Decisions

### Current State vs. Intended Architecture
- **Current**: Local JSON data service for immediate development
- **Intended**: Sanity CMS integration (schemas exist in `sanity/schemas/`)
- **Migration Path**: Replace local service calls with Sanity queries when CMS is ready

### Map Implementation
- Uses Mapbox GL with client-side rendering (SSR disabled)
- Custom marker system with popup integration
- Implements proper error handling for map initialization timing
- Markers use consistent image generation based on store ID for visual consistency

### SEO Strategy
- Comprehensive metadata implementation in App Router
- JSON-LD structured data for stores and blog posts
- Static generation for all content pages
- URL-based state management for filtered views

### Styling System
- Tailwind CSS with custom earth-toned theme
- Color palette: earth-sage (primary), earth-terracotta (secondary), earth-cream, earth-stone
- Custom utility classes for line clamping and animations
- Responsive design patterns throughout

## Development Patterns

### Type Safety
- All components use proper TypeScript interfaces
- Avoid `any` types (currently 2 instances in types file that should be replaced)
- Use proper Next.js 15 patterns (`params: Promise<{}>` for dynamic routes)

### Error Handling
- Map components include comprehensive error boundaries
- Graceful degradation for missing data (location, images, etc.)
- Client-side error logging for debugging

### Performance Considerations
- Map page bundle is 334kB (largest due to Mapbox GL)
- Images use Next.js Image component with proper optimization
- Static generation for 336+ pages at build time
- Unsplash images configured for external loading

## Data Structure

### Store Data Schema
Stores have hierarchical location data: `Store -> Neighborhood -> Region -> City`
- Each store includes location coordinates, hours, categories, and metrics
- Primary and secondary categories for flexible categorization
- Rich content fields for editorial descriptions

### Content Management
- Blog posts can reference featured stores for "View on Map" functionality
- All content includes SEO metadata fields
- Image handling through Sanity image pipeline (currently using Unsplash fallbacks)

## Development Notes

### Common Issues
- Map initialization timing requires proper error handling
- Mapbox token must be configured for map functionality
- Store data validation happens in transformation layer
- Image optimization requires external domain configuration

### Testing Data
- Use `node scripts/prepare-data.js` to analyze current store data
- 365 stores across NYC neighborhoods
- Data quality checks built into the analysis script

### Future Considerations
- Bundle size optimization for map page
- Migration from local JSON to live Sanity queries
- SEO enhancements (robots.txt, sitemap.xml still needed)
- Security headers implementation for production