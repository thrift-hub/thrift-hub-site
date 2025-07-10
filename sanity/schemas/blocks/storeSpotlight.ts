import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'storeSpotlight',
  title: 'Store Spotlight',
  type: 'object',
  fields: [
    defineField({
      name: 'store',
      title: 'Featured Store',
      type: 'reference',
      to: [{ type: 'store' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customTitle',
      title: 'Custom Title',
      type: 'string',
      description: 'Optional: Override the store name with a custom title',
    }),
    defineField({
      name: 'spotlight',
      title: 'Spotlight Text',
      type: 'text',
      rows: 3,
      description: 'Brief description of why this store is featured',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlightImage',
      title: 'Highlight Image',
      type: 'image',
      description: 'Optional: Use a specific image instead of the store\'s featured image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ctaText',
      title: 'Call-to-Action Text',
      type: 'string',
      initialValue: 'View on Map',
      description: 'Text for the action button',
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Side by Side', value: 'horizontal' },
          { title: 'Stacked', value: 'vertical' },
          { title: 'Card Style', value: 'card' },
        ],
        layout: 'radio',
      },
      initialValue: 'horizontal',
    }),
  ],
  preview: {
    select: {
      title: 'store.name',
      subtitle: 'spotlight',
      media: 'highlightImage',
      fallbackMedia: 'store.featuredImage',
    },
    prepare({ title, subtitle, media, fallbackMedia }) {
      return {
        title: `Store Spotlight: ${title || 'Untitled'}`,
        subtitle: subtitle || 'No description',
        media: media || fallbackMedia,
      }
    },
  },
})