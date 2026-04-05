import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import { blogPostType } from './blogPostType'
import {authorType} from './authorType'
import { memberType } from './memberType'
import { teamPageType } from './teamType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, blogPostType, authorType, memberType, teamPageType],
}
