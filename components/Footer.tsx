'use client'

import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'SERVICES', href: '#services' },
    { label: 'PORTFOLIO', href: '#video-portfolio' },
    { label: 'NEWS', href: '#news' },
    { label: 'FAQ', href: '#faq' },
    { label: 'CONTACT', href: '#contact' },
  ]
  
  const seoLinks = [
    { label: 'VR開発', href: '#services' },
    { label: 'Unity開発', href: '#services' },
    { label: 'Meta Quest対応', href: '#services' },
    { label: 'Cluster開発', href: '#services' },
    { label: 'AR開発', href: '#services' },
  ]
  
  const urlData = [
    { key: 'twitter', label: 'X', url: 'https://twitter.com/RYURYU_GAME_MFG' },
  ]
  
  const socialIcons: { [key: string]: React.ReactElement } = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  }
  
  const socialLinks = urlData.map(item => ({
    name: item.label,
    url: item.url,
    icon: socialIcons[item.key] || socialIcons.twitter
  }))
  
  return (
    <footer className="text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content - Single Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          {/* Company Info and Links Combined */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-4">
              <div className="relative h-8 w-32 md:h-10 md:w-40">
                <Image
                  src="/Logo_yoko.png"
                  alt="ゲーム開発所RYURYU - VR/AR開発に特化したスタジオのロゴ"
                  width={135}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="hidden md:block text-gray-600">|</span>
              <p className="hidden md:block text-gray-400 text-sm">
                Unity・VR・メタバース開発専門スタジオ
              </p>
            </div>
            
            {/* Quick Links - Horizontal */}
            <nav className="flex flex-wrap gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-2">
            {socialLinks && socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label={social.name}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* SEO Keywords Section */}
        <div className="py-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">関連サービス:</span>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {seoLinks.map((link, index) => (
                <span key={index} className="flex items-center">
                  <a
                    href={link.href}
                    className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                    onClick={() => {
                      // GA4 SEOリンククリックイベント
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'click_navigation', {
                          event_category: 'seo_links',
                          event_label: link.label,
                          content_type: 'footer_seo_link'
                        })
                      }
                    }}
                  >
                    {link.label}
                  </a>
                  {index < seoLinks.length - 1 && (
                    <span className="ml-2 text-gray-600">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
            <div className="text-xs text-gray-500">
              © {currentYear} ゲーム開発所RYURYU. All rights reserved.
            </div>
            <div className="text-xs text-gray-500">
              プロフェッショナルなソリューションを提供します
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}