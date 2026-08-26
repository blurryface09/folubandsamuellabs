import type { MetadataRoute } from 'next'
import { mockCourses } from '@/lib/academy/mock-data'

const BASE_URL = 'https://fslabs.tech'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/academy`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/academy/courses`, changeFrequency: 'weekly', priority: 0.9 },
    ...mockCourses.map((course) => ({
      url: `${BASE_URL}/academy/courses/${course.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ]
}
