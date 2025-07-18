import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'neighborhood',
  title: 'Neighborhood',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bounds',
      title: 'Geographic Bounds',
      type: 'object',
      fields: [
        defineField({
          name: 'north',
          title: 'North',
          type: 'number',
        }),
        defineField({
          name: 'south',
          title: 'South',
          type: 'number',
        }),
        defineField({
          name: 'east',
          title: 'East',
          type: 'number',
        }),
        defineField({
          name: 'west',
          title: 'West',
          type: 'number',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'region.name',
    },
  },
})