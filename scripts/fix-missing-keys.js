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

function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

async function fixMissingKeys() {
  console.log('🔧 Starting to fix missing _key properties...');
  
  try {
    // Get all stores that might have missing keys
    const stores = await client.fetch(`
      *[_type == "store"]{
        _id,
        _rev,
        name,
        description,
        secondaryCategories
      }
    `);
    
    console.log(`📊 Found ${stores.length} stores to check`);
    
    let fixedCount = 0;
    
    for (const store of stores) {
      let needsUpdate = false;
      const patches = [];
      
      // Fix description blocks if they exist and are missing keys
      if (store.description && Array.isArray(store.description)) {
        const fixedDescription = store.description.map(block => {
          if (!block._key) {
            needsUpdate = true;
            return {
              ...block,
              _key: generateKey(),
              children: block.children?.map(child => ({
                ...child,
                _key: child._key || generateKey()
              })) || []
            };
          }
          return {
            ...block,
            children: block.children?.map(child => ({
              ...child,
              _key: child._key || generateKey()
            })) || []
          };
        });
        
        if (needsUpdate) {
          patches.push({
            set: { description: fixedDescription }
          });
        }
      }
      
      // Fix secondaryCategories if they exist and are missing keys
      if (store.secondaryCategories && Array.isArray(store.secondaryCategories)) {
        const hasMissing = store.secondaryCategories.some(cat => !cat._key);
        
        if (hasMissing) {
          needsUpdate = true;
          const fixedCategories = store.secondaryCategories.map(cat => ({
            ...cat,
            _key: cat._key || generateKey()
          }));
          
          patches.push({
            set: { secondaryCategories: fixedCategories }
          });
        }
      }
      
      // Apply patches if needed
      if (needsUpdate && patches.length > 0) {
        try {
          const combinedPatch = patches.reduce((acc, patch) => ({
            ...acc,
            ...patch
          }), {});
          
          await client
            .patch(store._id)
            .set(combinedPatch.set)
            .commit();
          
          console.log(`✅ Fixed keys for: ${store.name}`);
          fixedCount++;
        } catch (error) {
          console.error(`❌ Error fixing ${store.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Completed! Fixed ${fixedCount} stores`);
    
  } catch (error) {
    console.error('💥 Error during key fixing:', error);
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

// Run the fix
async function run() {
  try {
    checkEnvironment();
    await fixMissingKeys();
  } catch (error) {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  run();
}

module.exports = { fixMissingKeys };