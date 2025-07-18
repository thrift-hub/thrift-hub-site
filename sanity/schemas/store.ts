import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'store',
  title: 'Store',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Info',
      default: true,
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'location',
      title: 'Location',
    },
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'media',
      title: 'Media',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Store Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCategory',
      title: 'Primary Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCategories',
      title: 'Secondary Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'basic',
    }),
    defineField({
      name: 'cardDescription',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short description for store cards (150-200 characters)',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'editorialSummary',
      title: 'Editorial Summary',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Brief editorial note about the store',
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
      group: 'location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'formattedAddress',
      title: 'Formatted Address',
      type: 'string',
      group: 'location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Coordinates',
      type: 'object',
      group: 'location',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'object',
      group: 'details',
      fields: [
        defineField({
          name: 'weekdayText',
          title: 'Weekday Text',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics & Ratings',
      type: 'object',
      group: 'details',
      fields: [
        defineField({
          name: 'priceLevel',
          title: 'Price Level',
          type: 'number',
          description: '1-4 scale (1 = $, 4 = $$$$)',
          validation: (Rule) => Rule.min(1).max(4),
        }),
        defineField({
          name: 'rating',
          title: 'Rating',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'userRatingsTotal',
          title: 'Total User Ratings',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'placeId',
      title: 'Google Place ID',
      type: 'string',
      group: 'details',
      description: 'Internal reference for Google Places API',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'neighborhood.name',
      media: 'featuredImage',
    },
  },
})