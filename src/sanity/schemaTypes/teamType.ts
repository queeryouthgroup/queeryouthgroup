// @/sanity/schemaTypes/teamPageType.ts
import {UsersIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const teamPageType = defineType({
  name: 'teamPage',
  title: 'Team Pages',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ 
      name: 'slug', 
      type: 'slug', 
      options: { source: 'title' },
      validation: Rule => Rule.required() 
    }),
    defineField({
      name: 'sections',
      title: 'Sections / Departments',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'sectionTitle', type: 'string' }),
            defineField({
              name: 'members',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'member' }] })]
            })
          ]
        })
      ]
    })
  ]
})