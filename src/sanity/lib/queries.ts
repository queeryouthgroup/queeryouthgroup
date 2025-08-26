import { groq } from 'next-sanity'

// Define types for your posts
export interface SanityPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  body: any; // PortableText content
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  _createdAt: string;
  _updatedAt: string;
  language?: string;
  author?: {
    name: string;
    image?: {
      asset: {
        _ref: string;
      };
    };
  };
}

// Query for getting posts by slug with locale fallback
export const getPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    mainImage,
    _createdAt,
    _updatedAt,
    language,
    author->{
      name,
      image
    }
  }
`

// Alternative: if you want to get multiple posts at once
export const getPostsBySlugPrefixQuery = groq`
  *[_type == "post" && slug.current match $slugPattern] | order(language asc) {
    _id,
    title,
    slug,
    body,
    mainImage,
    language,
    _createdAt,
    _updatedAt
  }
`