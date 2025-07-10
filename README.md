# ThriftHub NYC

A curated, editorial-first discovery platform for second-hand stores in New York City.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your:
   - Sanity.io project ID and dataset
   - Mapbox access token

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
thrift-hub-site/
├── app/                    # Next.js App Router pages
│   ├── stores/            # Store detail pages
│   ├── blog/              # Blog posts
│   └── cities/new-york/   # NYC-specific pages
│       └── map/           # Interactive discovery map
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── store/            # Store-related components
│   ├── map/              # Map components
│   ├── blog/             # Blog components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── sanity/          # Sanity client and queries
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── sanity/              # Sanity schemas
│   └── schemas/         # Document schemas
└── public/              # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity.io v3
- **Styling**: Tailwind CSS
- **Map**: Mapbox GL JS
- **Database**: Sanity Content Lake
- **Type Safety**: TypeScript
- **Build**: Turbopack (dev)

## 🗄️ Data Architecture

### Current State: **Sanity CMS Integration** ✅
- **366 stores** imported from JSON → Sanity
- **Real-time content management** via Sanity Studio
- **GROQ queries** for efficient data fetching
- **Reference relationships** between stores, neighborhoods, and categories

### Store Schema (with tabs)
- **Basic Info**: Name, slug, categories
- **Content**: Descriptions, editorial summary
- **Location**: Address, coordinates, neighborhood
- **Details**: Hours, ratings, website, price level
- **Media**: Featured image, gallery

### Hierarchical Location System
```
Store → Neighborhood → Region → City
```

### Blog Post Schema
- Editorial content with rich text
- Featured stores for "View on Map"
- SEO optimization fields
- Categories and tags

### Supporting Models
- **Category**: Store types (thrift, vintage, consignment)
- **Neighborhood**: NYC neighborhoods with region references
- **Region**: NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- **City**: New York City (center coordinates, zoom level)

## 🔑 Key Features

1. **Interactive Discovery Map**
   - Filter by category and neighborhood
   - Client-side filtering with URL state
   - Synchronized list and map views

2. **Rich Content Pages**
   - SSG for optimal performance
   - SEO optimized with metadata
   - JSON-LD structured data

3. **Editorial Platform**
   - Blog posts with featured stores
   - "View on Map" integration
   - Content managed in Sanity

## 🚧 Development

### Commands
```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build for production (336 static pages)
npm run start       # Start production server
npm run lint        # Run ESLint

# Sanity Studio
npm run studio      # Start Sanity Studio locally
npx sanity schema deploy  # Deploy schema changes

# Data Management
npm run import:sanity    # Import store data to Sanity (already done)
npm run fix:keys        # Fix missing _key properties in arrays
npm run analyze:data    # Analyze store data structure
```

### Environment Variables
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=6hwn9xgi     # ThriftHub project ID
NEXT_PUBLIC_SANITY_DATASET=production      # Production dataset
SANITY_API_TOKEN=skkQmvI3ZhRTlbnC...       # Write token for imports
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...        # Mapbox access token
NEXT_PUBLIC_SITE_URL=https://thrifthub.nyc # Domain for metadata
```

## 🏗️ Sanity Studio

### Access
- **Local**: `http://localhost:3000/studio`
- **Production**: `https://your-domain.com/studio`

### Organization (Improved)
- **Stores** (with filters)
  - All Stores (366) - alphabetical
  - By Region: Manhattan, Brooklyn, Queens, Bronx, Staten Island
  - By Category: Thrift, Vintage, Consignment, Second Hand
  - By Neighborhood: SoHo, East Village, Williamsburg, etc.
- **Blog Posts** - chronological
- **Locations** - hierarchical management
- **Categories** - alphabetical

### Content Management
- **Tabbed editing** for stores (Basic Info, Content, Location, Details, Media)
- **GROQ filtering** for efficient content discovery
- **Reference relationships** automatically maintained
- **Portable Text** for rich content editing

## 🔄 Data Migration (Completed)

### Migration Summary
✅ **366 stores** successfully imported from `stores-export.json`  
✅ **All store pages** (336 routes) building correctly  
✅ **Interactive map** fetching real data from Sanity  
✅ **City listing** with region grouping  
✅ **Blog functionality** with mock data fallback  
✅ **Studio filters** by location and category  

### Technical Details
- **Data Service**: `lib/data/sanity-store-service.ts` with GROQ queries
- **Error Handling**: Comprehensive null checks for missing references
- **Performance**: CDN disabled for fresh data, static generation for 336+ pages
- **Studio Config**: Organized navigation with filters and tabs

## 📝 License

Private project - all rights reserved.