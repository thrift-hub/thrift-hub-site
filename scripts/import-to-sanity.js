const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

// Read the stores-export.json file
const storesExportPath = path.join(__dirname, '..', 'stores-export.json');
const storesData = JSON.parse(fs.readFileSync(storesExportPath, 'utf8'));

// Helper functions
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

function convertHtmlToPortableText(html) {
  if (!html) return null;
  
  // Basic HTML to Portable Text conversion
  // This is a simplified version - for production, use a proper HTML to Portable Text converter
  const cleanText = html
    .replace(/<div class="store-description">/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<div class="section">/g, '\n\n')
    .replace(/<h4[^>]*>/g, '')
    .replace(/<\/h4>/g, '\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return [
    {
      _key: generateKey(),
      _type: 'block',
      style: 'normal',
      children: [
        {
          _key: generateKey(),
          _type: 'span',
          text: cleanText
        }
      ]
    }
  ];
}

// Create or get documents
async function createOrGetCity() {
  const cityId = 'new-york-city';
  
  try {
    const existingCity = await client.getDocument(cityId);
    console.log('✅ Found existing city:', existingCity.name);
    return existingCity;
  } catch (error) {
    console.log('📍 Creating New York City document...');
    const city = {
      _id: cityId,
      _type: 'city',
      name: 'New York City',
      slug: { current: 'new-york' },
      state: 'NY',
      center: { lat: 40.7128, lng: -74.0060 },
      defaultZoom: 12
    };
    
    return await client.createOrReplace(city);
  }
}

async function createOrGetRegion(regionName, cityRef) {
  const regionId = `region-${createSlug(regionName)}`;
  
  try {
    const existingRegion = await client.getDocument(regionId);
    console.log(`✅ Found existing region: ${existingRegion.name}`);
    return existingRegion;
  } catch (error) {
    console.log(`🏙️ Creating region: ${regionName}`);
    const region = {
      _id: regionId,
      _type: 'region',
      name: regionName,
      slug: { current: createSlug(regionName) },
      city: { _type: 'reference', _ref: cityRef._id }
    };
    
    return await client.createOrReplace(region);
  }
}

async function createOrGetNeighborhood(neighborhoodName, regionRef) {
  const neighborhoodId = `neighborhood-${createSlug(neighborhoodName)}`;
  
  try {
    const existingNeighborhood = await client.getDocument(neighborhoodId);
    console.log(`✅ Found existing neighborhood: ${existingNeighborhood.name}`);
    return existingNeighborhood;
  } catch (error) {
    console.log(`🏘️ Creating neighborhood: ${neighborhoodName}`);
    const neighborhood = {
      _id: neighborhoodId,
      _type: 'neighborhood',
      name: neighborhoodName,
      slug: { current: createSlug(neighborhoodName) },
      region: { _type: 'reference', _ref: regionRef._id }
    };
    
    return await client.createOrReplace(neighborhood);
  }
}

async function createOrGetCategory(categoryData) {
  if (!categoryData || !categoryData.name) return null;
  
  const categoryId = `category-${categoryData.slug || createSlug(categoryData.name)}`;
  
  try {
    const existingCategory = await client.getDocument(categoryId);
    console.log(`✅ Found existing category: ${existingCategory.name}`);
    return existingCategory;
  } catch (error) {
    console.log(`🏷️ Creating category: ${categoryData.name}`);
    const category = {
      _id: categoryId,
      _type: 'category',
      name: categoryData.name,
      slug: { current: categoryData.slug || createSlug(categoryData.name) }
    };
    
    return await client.createOrReplace(category);
  }
}

async function importStore(storeData) {
  const storeId = storeData._id;
  
  try {
    // Check if store already exists
    const existingStore = await client.getDocument(storeId);
    console.log(`⚠️ Store already exists: ${existingStore.name} - skipping`);
    return existingStore;
  } catch (error) {
    // Store doesn't exist, create it
    console.log(`🏪 Creating store: ${storeData.name}`);
    
    // Get or create location references
    const city = await createOrGetCity();
    const region = await createOrGetRegion(storeData.neighborhood?.region?.name || 'Manhattan', city);
    const neighborhood = await createOrGetNeighborhood(storeData.neighborhood?.name || 'Unknown', region);
    
    // Get or create category references
    const primaryCategory = await createOrGetCategory(storeData.primaryCategory);
    const secondaryCategories = [];
    
    if (storeData.secondaryCategories) {
      for (const catData of storeData.secondaryCategories) {
        const category = await createOrGetCategory(catData);
        if (category) {
          secondaryCategories.push({ 
            _key: generateKey(),
            _type: 'reference', 
            _ref: category._id 
          });
        }
      }
    }
    
    // Create the store document
    const store = {
      _id: storeId,
      _type: 'store',
      name: storeData.name,
      slug: { current: createSlug(storeData.name) },
      cardDescription: storeData.card_description,
      description: convertHtmlToPortableText(storeData.description),
      editorialSummary: storeData.editorial_summary,
      location: storeData.location,
      formattedAddress: storeData.formatted_address,
      placeId: storeData.place_id,
      hours: storeData.hours,
      primaryCategory: primaryCategory ? { _type: 'reference', _ref: primaryCategory._id } : null,
      secondaryCategories: secondaryCategories,
      neighborhood: { _type: 'reference', _ref: neighborhood._id },
      metrics: {
        priceLevel: storeData.metrics?.price_level,
        rating: storeData.metrics?.rating,
        userRatingsTotal: storeData.metrics?.user_ratings_total
      },
      website: storeData.website,
      googleMapsUrl: storeData.url
    };
    
    // Remove null values
    Object.keys(store).forEach(key => {
      if (store[key] === null || store[key] === undefined || store[key] === '') {
        delete store[key];
      }
    });
    
    return await client.createOrReplace(store);
  }
}

// Main import function
async function importData() {
  console.log('🚀 Starting Sanity import...');
  console.log(`📊 Found ${storesData.length} stores to import`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < storesData.length; i++) {
    const store = storesData[i];
    try {
      await importStore(store);
      successCount++;
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`📈 Progress: ${i + 1}/${storesData.length} stores processed`);
      }
    } catch (error) {
      console.error(`❌ Error importing store ${store.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Import completed!');
  console.log(`✅ Successfully imported: ${successCount} stores`);
  console.log(`❌ Errors: ${errorCount} stores`);
  
  if (errorCount > 0) {
    console.log('\n💡 Tip: Check your Sanity token permissions and schema deployment');
  }
}

// Check environment variables
function checkEnvironment() {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET', 
    'SANITY_API_TOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Make sure your .env.local file is properly configured');
    process.exit(1);
  }
  
  console.log('✅ Environment variables check passed');
}

// Run the import
async function run() {
  try {
    checkEnvironment();
    await importData();
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  run();
}

module.exports = { importData, createSlug, convertHtmlToPortableText };