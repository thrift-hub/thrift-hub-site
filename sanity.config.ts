import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'

import { schemaTypes } from './sanity/schemas'

// Environment variables for Sanity
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6hwn9xgi'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

console.log('Sanity config loading with:', { projectId, dataset })

export default defineConfig({
  name: 'thrift-hub-studio',
  title: 'ThriftHub NYC Studio',
  
  projectId,
  dataset,
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Stores section with filters
            S.listItem()
              .title('Stores')
              .icon(() => '🏪')
              .child(
                S.list()
                  .title('Store Management')
                  .items([
                    // All stores with search and filters
                    S.listItem()
                      .title('All Stores')
                      .icon(() => '🏪')
                      .child(
                        S.documentTypeList('store')
                          .title('All Stores (366)')
                          .filter('_type == "store"')
                          .defaultOrdering([{field: 'name', direction: 'asc'}])
                      ),
                    
                    S.divider(),
                    
                    // By Region/Borough
                    S.listItem()
                      .title('By Region')
                      .icon(() => '🗺️')
                      .child(
                        S.list()
                          .title('Stores by Region')
                          .items([
                            S.listItem()
                              .title('Manhattan')
                              .child(
                                S.documentTypeList('store')
                                  .title('Manhattan Stores')
                                  .filter('_type == "store" && neighborhood->region->name == "Manhattan"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Brooklyn')
                              .child(
                                S.documentTypeList('store')
                                  .title('Brooklyn Stores')
                                  .filter('_type == "store" && neighborhood->region->name == "Brooklyn"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Queens')
                              .child(
                                S.documentTypeList('store')
                                  .title('Queens Stores')
                                  .filter('_type == "store" && neighborhood->region->name == "Queens"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Bronx')
                              .child(
                                S.documentTypeList('store')
                                  .title('Bronx Stores')
                                  .filter('_type == "store" && neighborhood->region->name == "Bronx"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Staten Island')
                              .child(
                                S.documentTypeList('store')
                                  .title('Staten Island Stores')
                                  .filter('_type == "store" && neighborhood->region->name == "Staten Island"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                          ])
                      ),
                    
                    // By Category
                    S.listItem()
                      .title('By Category')
                      .icon(() => '🏷️')
                      .child(
                        S.list()
                          .title('Stores by Category')
                          .items([
                            S.listItem()
                              .title('Thrift Stores')
                              .child(
                                S.documentTypeList('store')
                                  .title('Thrift Stores')
                                  .filter('_type == "store" && (primaryCategory->name == "Thrift" || "thrift" in secondaryCategories[]->slug.current)')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Vintage Shops')
                              .child(
                                S.documentTypeList('store')
                                  .title('Vintage Shops')
                                  .filter('_type == "store" && (primaryCategory->name == "Vintage" || "vintage" in secondaryCategories[]->slug.current)')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Consignment Stores')
                              .child(
                                S.documentTypeList('store')
                                  .title('Consignment Stores')
                                  .filter('_type == "store" && (primaryCategory->name == "Consignment" || "consignment" in secondaryCategories[]->slug.current)')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Second Hand Shops')
                              .child(
                                S.documentTypeList('store')
                                  .title('Second Hand Shops')
                                  .filter('_type == "store" && primaryCategory->name == "Second Hand"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                          ])
                      ),
                    
                    // By Neighborhood (Top 10)
                    S.listItem()
                      .title('By Neighborhood')
                      .icon(() => '🏘️')
                      .child(
                        S.list()
                          .title('Stores by Popular Neighborhoods')
                          .items([
                            S.listItem()
                              .title('SoHo')
                              .child(
                                S.documentTypeList('store')
                                  .title('SoHo Stores')
                                  .filter('_type == "store" && neighborhood->name == "SoHo"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('East Village')
                              .child(
                                S.documentTypeList('store')
                                  .title('East Village Stores')
                                  .filter('_type == "store" && neighborhood->name == "East Village"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Williamsburg')
                              .child(
                                S.documentTypeList('store')
                                  .title('Williamsburg Stores')
                                  .filter('_type == "store" && neighborhood->name == "Williamsburg"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Upper East Side')
                              .child(
                                S.documentTypeList('store')
                                  .title('Upper East Side Stores')
                                  .filter('_type == "store" && neighborhood->name == "Upper East Side"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                            S.listItem()
                              .title('Greenwich Village')
                              .child(
                                S.documentTypeList('store')
                                  .title('Greenwich Village Stores')
                                  .filter('_type == "store" && neighborhood->name == "Greenwich Village"')
                                  .defaultOrdering([{field: 'name', direction: 'asc'}])
                              ),
                          ])
                      ),
                  ])
              ),
            
            // Blog section  
            S.listItem()
              .title('Blog Posts')
              .icon(() => '📝')
              .child(
                S.documentTypeList('blogPost')
                  .title('All Blog Posts')
                  .filter('_type == "blogPost"')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
            
            S.divider(),
            
            // Location hierarchy
            S.listItem()
              .title('Locations')
              .icon(() => '📍')
              .child(
                S.list()
                  .title('Location Management')
                  .items([
                    S.listItem()
                      .title('Cities')
                      .child(
                        S.documentTypeList('city')
                          .title('Cities')
                          .defaultOrdering([{field: 'name', direction: 'asc'}])
                      ),
                    S.listItem()
                      .title('Regions/Boroughs')
                      .child(
                        S.documentTypeList('region')
                          .title('Regions')
                          .defaultOrdering([{field: 'name', direction: 'asc'}])
                      ),
                    S.listItem()
                      .title('Neighborhoods')
                      .child(
                        S.documentTypeList('neighborhood')
                          .title('Neighborhoods')
                          .defaultOrdering([{field: 'name', direction: 'asc'}])
                      ),
                  ])
              ),
            
            // Categories
            S.listItem()
              .title('Categories')
              .icon(() => '🏷️')
              .child(
                S.documentTypeList('category')
                  .title('Store Categories')
                  .filter('_type == "category"')
                  .defaultOrdering([{field: 'name', direction: 'asc'}])
              ),
          ])
    }),
    visionTool(),
    colorInput(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  tools: (prev) => {
    // Only show the vision tool in development
    if (process.env.NODE_ENV === 'development') {
      return prev
    }
    return prev.filter((tool) => tool.name !== 'vision')
  },
})