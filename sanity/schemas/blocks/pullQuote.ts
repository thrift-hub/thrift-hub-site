import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: 'The main quote text',
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          description: 'Name of the person being quoted',
        }),
        defineField({
          name: 'title',
          title: 'Title/Role',
          type: 'string',
          description: 'e.g., "Store Owner", "Customer", "Vintage Expert"',
        }),
        defineField({
          name: 'store',
          title: 'Associated Store',
          type: 'reference',
          to: [{ type: 'store' }],
          description: 'Optional: Link to a store if relevant',
        }),
      ],
    }),
    defineField({
      name: 'style',
      title: 'Quote Style',
      type: 'string',
      options: {
        list: [
          { title: 'Large & Centered', value: 'large-center' },
          { title: 'Side Panel', value: 'side-panel' },
          { title: 'Inline Highlight', value: 'inline' },
          { title: 'Testimonial Card', value: 'testimonial' },
        ],
        layout: 'radio',
      },
      initialValue: 'large-center',
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
          { title: 'Earth Stone', value: 'stone' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'showQuoteMarks',
      title: 'Show Quote Marks',
      type: 'boolean',
      initialValue: true,
      description: 'Display decorative quotation marks',
    }),
  ],
  preview: {
    select: {
      quote: 'quote',
      name: 'attribution.name',
      title: 'attribution.title',
      style: 'style',
    },
    prepare({ quote, name, title, style }) {
      const truncatedQuote = quote?.length > 60 ? `${quote.substring(0, 60)}...` : quote
      const attribution = name && title ? `${name}, ${title}` : name || title || 'Anonymous'
      
      return {
        title: `"${truncatedQuote || 'No quote text'}"`,
        subtitle: `${attribution} • ${style || 'large-center'}`,
      }
    },
  },
})