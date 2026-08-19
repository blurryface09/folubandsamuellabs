import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/student/', '/instructor/', '/admin/'],
    },
    sitemap: 'https://folubandsamuellabs.com/sitemap.xml',
  }
}
