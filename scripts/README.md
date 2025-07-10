# ThriftHub Data Scripts

This directory contains scripts for managing store data in the ThriftHub project.

## Scripts

### `import-to-sanity.js`
Imports store data from `stores-export.json` into your Sanity CMS.

**Usage:**
```bash
npm run import:sanity
```

**What it does:**
- Reads the `stores-export.json` file from the project root
- Creates/updates Cities, Regions, Neighborhoods, and Categories in Sanity
- Imports all store records with proper relationships
- Converts HTML descriptions to Sanity's Portable Text format
- Handles duplicate detection to avoid re-importing existing stores

**Requirements:**
- Sanity schemas must be deployed (`npx sanity schema deploy`)
- Valid Sanity API token with write permissions
- Environment variables properly configured

### `prepare-data.js`
Analyzes the store data and provides statistics.

**Usage:**
```bash
npm run analyze:data
```

**Output:**
- Total store count
- Breakdown by category
- Top 10 neighborhoods
- Data quality metrics

## Data Structure

The import script expects JSON data with the following structure:

```json
{
  "_id": "unique-store-id",
  "name": "Store Name",
  "card_description": "Brief description for cards",
  "description": "<div>...HTML content...</div>",
  "editorial_summary": "Editorial summary",
  "formatted_address": "Full address",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "hours": {
    "weekday_text": ["Monday: 9:00 AM – 5:00 PM", ...]
  },
  "primaryCategory": {
    "name": "Second Hand",
    "slug": "second-hand"
  },
  "secondaryCategories": [
    {
      "name": "Vintage",
      "slug": "vintage"
    }
  ],
  "neighborhood": {
    "name": "SoHo",
    "region": {
      "name": "Manhattan",
      "parent": {
        "name": "New York City"
      }
    }
  },
  "metrics": {
    "price_level": 2,
    "rating": 4.5,
    "user_ratings_total": 123
  },
  "website": "https://example.com",
  "url": "https://maps.google.com/..."
}
```

## Error Handling

The import script includes:
- Environment variable validation
- Duplicate detection
- Progress tracking
- Error logging with continuation
- Graceful handling of missing or malformed data

## Tips

1. **Test first**: Run `npm run analyze:data` to validate your data structure
2. **Deploy schemas**: Ensure Sanity schemas are deployed before importing
3. **Check permissions**: Verify your Sanity API token has write access
4. **Monitor progress**: The script shows progress every 10 stores
5. **Handle errors**: Check error messages for specific issues

## Troubleshooting

**"Missing environment variables"**
- Ensure `.env.local` contains valid Sanity credentials

**"Document not found" errors**
- Deploy your schemas: `npx sanity schema deploy`

**Permission errors**
- Check your `SANITY_API_TOKEN` has write permissions

**Import taking too long**
- The script processes stores sequentially to avoid rate limits
- Large datasets may take several minutes