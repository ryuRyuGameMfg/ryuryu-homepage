'use client'

import Link from 'next/link'
import Script from 'next/script'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('#') 
        ? `https://unitymarket.netlify.app${item.href}`
        : item.href
    }))
  }

  return (
    <>
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        strategy="afterInteractive"
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-400">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 mx-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {index === items.length - 1 ? (
                <span className="text-gray-300 font-medium">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-cyan-400 transition-colors"
                  onClick={() => {
                    // GA4 ナビゲーションクリックイベント
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'click_navigation', {
                        event_category: 'navigation',
                        event_label: `breadcrumb_${item.name}`,
                        content_type: 'breadcrumb'
                      })
                    }
                  }}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}