import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://unitymarket.netlify.app'
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          ja: `${baseUrl}`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: 'weekly', 
      priority: 0.9,
      alternates: {
        languages: {
          ja: `${baseUrl}/#services`,
          en: `${baseUrl}/en#services`,
        },
      },
    },
    {
      url: `${baseUrl}/#video-portfolio`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ja: `${baseUrl}/#video-portfolio`,
          en: `${baseUrl}/en#video-portfolio`,
        },
      },
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ja: `${baseUrl}/#about`,
          en: `${baseUrl}/en#about`,
        },
      },
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ja: `${baseUrl}/#faq`,
          en: `${baseUrl}/en#faq`,
        },
      },
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ja: `${baseUrl}/#contact`,
          en: `${baseUrl}/en#contact`,
        },
      },
    },
    {
      url: `${baseUrl}/#news`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          ja: `${baseUrl}/#news`,
          en: `${baseUrl}/en#news`,
        },
      },
    },
  ]
}