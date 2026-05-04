import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ryuryugame.netlify.app'
  const currentDate = new Date()
  // Landing pages have stable creation dates — use a recent fixed date so
  // <lastmod> doesn't churn every build (avoids Google's "low-value churn" demotion).
  const landingLastMod = new Date('2026-05-04T00:00:00+09:00')

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // ===== Static SEO Landing Pages (iter16-18 で新設・JSON-LD 完備) =====
    // priority 0.9: 高検索意図キーワードを単独でキャプチャするため top 階層相当に位置付け
    {
      url: `${baseUrl}/cluster-world-seisaku.html`,
      lastModified: landingLastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/unity-kaigai.html`,
      lastModified: landingLastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/meta-quest-vr.html`,
      lastModified: landingLastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // ===== Hash-anchor sections (single-page navigation) =====
    {
      url: `${baseUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#video-portfolio`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#news`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
