const fs = require('fs');
const path = require('path');

// Read the stores-export.json file
const storesExportPath = path.join(__dirname, '..', 'stores-export.json');
const storesData = JSON.parse(fs.readFileSync(storesExportPath, 'utf8'));

// Create a summary of the data
console.log('📊 Data Summary:');
console.log(`Total stores: ${storesData.length}`);

// Count by primary category
const categoryCounts = {};
storesData.forEach(store => {
  const category = store.primaryCategory?.name || 'Uncategorized';
  categoryCounts[category] = (categoryCounts[category] || 0) + 1;
});

console.log('\n📁 By Category:');
Object.entries(categoryCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

// Count by neighborhood
const neighborhoodCounts = {};
storesData.forEach(store => {
  const neighborhood = store.neighborhood?.name || 'Unknown';
  neighborhoodCounts[neighborhood] = (neighborhoodCounts[neighborhood] || 0) + 1;
});

console.log('\n🏘️  By Neighborhood (Top 10):');
Object.entries(neighborhoodCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([neighborhood, count]) => {
    console.log(`  ${neighborhood}: ${count}`);
  });

// Check data quality
let missingDescription = 0;
let missingLocation = 0;
let missingHours = 0;

storesData.forEach(store => {
  if (!store.card_description) missingDescription++;
  if (!store.location || !store.location.lat || !store.location.lng) missingLocation++;
  if (!store.hours || !store.hours.weekday_text) missingHours++;
});

console.log('\n⚠️  Data Quality:');
console.log(`  Missing descriptions: ${missingDescription}`);
console.log(`  Missing locations: ${missingLocation}`);
console.log(`  Missing hours: ${missingHours}`);

console.log('\n✅ Data is ready to use!');
console.log('The local-store-service.ts is already configured to read from stores-export.json');