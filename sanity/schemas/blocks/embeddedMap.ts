import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'embeddedMap',
  title: 'Embedded Map',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Map Title',
      type: 'string',
      description: 'Optional title for the map section',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what the map shows',
    }),
    defineField({
      name: 'mapType',
      title: 'Map Type',
      type: 'string',
      options: {
        list: [
          { title: 'Featured Stores', value: 'stores' },
          { title: 'Neighborhood View', value: 'neighborhood' },
          { title: 'Category Filter', value: 'category' },
          { title: 'Custom Selection', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'stores',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredStores',
      title: 'Featured Stores',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'store' }] }],
      description: 'Specific stores to highlight on the map',
      hidden: ({ parent }) => parent?.mapType !== 'stores' && parent?.mapType !== 'custom',
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood Focus',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
      description: 'Focus the map on a specific neighborhood',
      hidden: ({ parent }) => parent?.mapType !== 'neighborhood',
    }),
    defineField({
      name: 'category',
      title: 'Category Filter',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Show only stores from this category',
      hidden: ({ parent }) => parent?.mapType !== 'category',
    }),
    defineField({
      name: 'mapSettings',
      title: 'Map Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'height',
          title: 'Map Height',
          type: 'string',
          options: {
            list: [
              { title: 'Small (300px)', value: 'small' },
              { title: 'Medium (400px)', value: 'medium' },
              { title: 'Large (500px)', value: 'large' },
              { title: 'Extra Large (600px)', value: 'xlarge' },
            ],
            layout: 'dropdown',
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'showControls',
          title: 'Show Map Controls',
          type: 'boolean',
          initialValue: true,
          description: 'Show zoom and navigation controls',
        }),
        defineField({
          name: 'allowFullscreen',
          title: 'Allow Fullscreen',
          type: 'boolean',
          initialValue: true,
          description: 'Show fullscreen button',
        }),
        defineField({
          name: 'showStoreList',
          title: 'Show Store List',
          type: 'boolean',
          initialValue: false,
          description: 'Display a list of stores below the map',
        }),
      ],
    }),
    defineField({
      name: 'centerLocation',
      title: 'Custom Center Location',
      type: 'object',
      description: 'Override the default map center',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
        }),
        defineField({
          name: 'zoom',
          title: 'Zoom Level',
          type: 'number',
          initialValue: 13,
          validation: (Rule) => Rule.min(1).max(20),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      mapType: 'mapType',
      storeCount: 'featuredStores',
      neighborhood: 'neighborhood.name',
      category: 'category.name',
    },
    prepare({ title, description, mapType, storeCount, neighborhood, category }) {
      let subtitle = `${mapType || 'stores'} map`
      
      if (mapType === 'stores' && storeCount) {
        subtitle += ` • ${storeCount.length} store${storeCount.length !== 1 ? 's' : ''}`
      } else if (mapType === 'neighborhood' && neighborhood) {
        subtitle += ` • ${neighborhood}`
      } else if (mapType === 'category' && category) {
        subtitle += ` • ${category}`
      }
      
      return {
        title: title || 'Embedded Map',
        subtitle,
      }
    },
  },
})