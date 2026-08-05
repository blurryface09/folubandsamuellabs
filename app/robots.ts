import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/exchange/dashboard', '/exchange/accounts'],
    },
    sitemap: 'https://fslabs.tech/sitemap.xml',
  }
}
