import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'city',
  title: 'City',
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
      name: 'state',
      title: 'State',
      type: 'string',
    }),
    defineField({
      name: 'center',
      title: 'Map Center',
      type: 'object',
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
      ],
    }),
    defineField({
      name: 'defaultZoom',
      title: 'Default Zoom Level',
      type: 'number',
      initialValue: 12,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'state',
    },
  },
})