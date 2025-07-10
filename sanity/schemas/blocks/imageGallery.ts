import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      description: 'Optional title for the gallery section',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'alt',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Untitled Image',
                subtitle: subtitle || 'No alt text',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),
    defineField({
      name: 'layout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (2 columns)', value: 'grid-2' },
          { title: 'Grid (3 columns)', value: 'grid-3' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Single Row', value: 'row' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'grid-2',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Square (1:1)', value: 'square' },
          { title: 'Landscape (4:3)', value: 'landscape' },
          { title: 'Portrait (3:4)', value: 'portrait' },
          { title: 'Wide (16:9)', value: 'wide' },
          { title: 'Original', value: 'original' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'original',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
      layout: 'layout',
    },
    prepare({ title, images, layout }) {
      const imageCount = images?.length || 0
      return {
        title: title || 'Image Gallery',
        subtitle: `${imageCount} image${imageCount !== 1 ? 's' : ''} • ${layout || 'grid-2'}`,
        media: images?.[0]?.image,
      }
    },
  },
})