import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/academy/admin',
        '/academy/dashboard',
        '/academy/profile',
        '/academy/login',
        '/academy/register',
        '/academy/courses/*/weeks/*',
        '/academy/courses/*/modules/*',
      ],
    },
    sitemap: 'https://fslabs.tech/sitemap.xml',
  }
}
