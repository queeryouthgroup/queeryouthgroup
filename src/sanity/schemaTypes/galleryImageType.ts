// @/sanity/schemaTypes/galleryImageType.ts
import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export type GalleryImage = {
  _id: string
  _type: 'galleryImage'
  title: string
  image: {
    _type: 'image'
    asset: {
      _ref: string
    }
    alt?: string
  }
  order?: number
}

export const galleryImageType = defineType({
  name: 'galleryImage',
  title: 'Gallery Feed',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({ 
      name: 'title', 
      type: 'string', 
      title: 'Image Title/Caption',
      validation: Rule => Rule.required() 
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Display Order',
      initialValue: 0,
    }),
  ],
})