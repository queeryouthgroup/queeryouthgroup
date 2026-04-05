// @/sanity/schemaTypes/memberType.ts
import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const memberType = defineType({
    name: 'member',
    title: 'Personnel Pool',
    type: 'document',
    icon: UserIcon,
    fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'role', title: 'Default Role', type: 'string' }),
    defineField({ name: 'pronoun', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})