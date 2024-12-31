import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://links.stembayo.sch.id',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        }
    ]
}