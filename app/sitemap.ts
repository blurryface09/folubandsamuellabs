import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    // The Academy replaced FS Exchange as the promoted product; /exchange is no
    // longer linked from anywhere public, so it is out of the sitemap.
    { url: `${BASE_URL}/training`, changeFrequency: 'monthly', priority: 0.9 },
  ]
}
