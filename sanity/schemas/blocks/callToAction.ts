import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading for the CTA section',
    }),
    defineField({
      name: 'text',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Supporting text for the call-to-action',
    }),
    defineField({
      name: 'buttons',
      title: 'Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Store Page', value: 'store' },
                  { title: 'Map View', value: 'map' },
                  { title: 'External URL', value: 'external' },
                  { title: 'Internal Page', value: 'internal' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'store',
              title: 'Store',
              type: 'reference',
              to: [{ type: 'store' }],
              hidden: ({ parent }) => parent?.linkType !== 'store',
            }),
            defineField({
              name: 'mapParams',
              title: 'Map Parameters',
              type: 'object',
              fields: [
                defineField({
                  name: 'stores',
                  title: 'Featured Stores',
                  type: 'array',
                  of: [{ type: 'reference', to: [{ type: 'store' }] }],
                }),
                defineField({
                  name: 'category',
                  title: 'Category Filter',
                  type: 'reference',
                  to: [{ type: 'category' }],
                }),
                defineField({
                  name: 'neighborhood',
                  title: 'Neighborhood Filter',
                  type: 'reference',
                  to: [{ type: 'neighborhood' }],
                }),
              ],
              hidden: ({ parent }) => parent?.linkType !== 'map',
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({ parent }) => parent?.linkType !== 'external',
            }),
            defineField({
              name: 'internalPath',
              title: 'Internal Path',
              type: 'string',
              description: 'e.g., /blog, /about',
              hidden: ({ parent }) => parent?.linkType !== 'internal',
            }),
            defineField({
              name: 'style',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Outline', value: 'outline' },
                  { title: 'Ghost', value: 'ghost' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: {
              title: 'text',
              linkType: 'linkType',
              style: 'style',
            },
            prepare({ title, linkType, style }) {
              return {
                title: title || 'Untitled Button',
                subtitle: `${linkType || 'no-link'} • ${style || 'primary'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Left Aligned', value: 'left' },
          { title: 'Right Aligned', value: 'right' },
          { title: 'Full Width', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Light Gray', value: 'light' },
          { title: 'Earth Sage', value: 'sage' },
          { title: 'Earth Cream', value: 'cream' },
          { title: 'Earth Terracotta', value: 'terracotta' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      text: 'text',
      buttons: 'buttons',
    },
    prepare({ heading, text, buttons }) {
      const buttonCount = buttons?.length || 0
      return {
        title: heading || 'Call to Action',
        subtitle: `${buttonCount} button${buttonCount !== 1 ? 's' : ''} • ${text || 'No description'}`,
      }
    },
  },
})