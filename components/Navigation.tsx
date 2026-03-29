'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText } from 'lucide-react'
import * as gtag from '@/lib/gtag'

export default function Navigation() {
  const navItems = useMemo(() => [
    { label: 'HOME', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'SERVICES', href: '#services' },
    { label: 'PORTFOLIO', href: '#video-portfolio' },
    { label: 'NEWS', href: '#news' },
    { label: 'CONTACT', href: '#contact' },
    { label: 'FAQ', href: '#faq' },
  ], [])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''))
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    // クエリパラメータを分離
    const [hash, queryString] = href.includes('?') ? href.split('?') : [href, '']

    // ハッシュ部分のみでスクロール
    const element = document.querySelector(hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // スクロール完了後に完全なハッシュを設定（パラメータ込み）
      setTimeout(() => {
        window.location.hash = queryString ? `${hash}?${queryString}` : hash
      }, 500)

      // GA4イベント送信
      gtag.event({
        action: 'navigation_click',
        category: 'engagement',
        label: hash.replace('#', ''),
      })
    }
    setIsMenuOpen(false)
  }
  
  return (
    <>
      {/* Main Navigation Bar */}
      <nav 
        className="fixed top-0 w-full z-50 transition-all duration-300 bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-40 md:h-12 md:w-48">
                <Image
                  src="/Logo_yoko.png"
                  alt="ゲーム開発所RYURYU - Unity・VR・メタバース開発専門スタジオのロゴ"
                  width={135}
                  height={48}
                  className="transition-all duration-300"
                  priority
                  sizes="135px"
                />
              </div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3 py-2 text-sm transition-all duration-200 hover:scale-105 ${
                      isActive 
                        ? 'text-cyan-400 font-bold' 
                        : 'text-gray-300 hover:text-cyan-400 font-medium'
                    }`}
                    style={{ fontFamily: 'Melete, Orbitron, sans-serif', fontWeight: 500 }}
                  >
                    {item.label}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div 
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600"
                      />
                    )}
                  </a>
                )
              })}

              {/* 資料請求ボタン - Desktop */}
              <a
                href="#contact?type=document"
                onClick={(e) => handleNavClick(e, "#contact?type=document")}
                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span className="font-['HackGen35']">資料請求</span>
              </a>
            </div>
            
            {/* Mobile Menu Toggle and Document Request */}
            <div className="flex items-center gap-2 md:hidden">
              {/* 資料請求ボタン - Mobile Icon */}
              <a
                href="#contact?type=document"
                onClick={(e) => handleNavClick(e, "#contact?type=document")}
                className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                <FileText className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 rounded-md transition-colors text-gray-100 hover:bg-gray-800"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="absolute top-16 left-4 right-4 bg-gray-900 rounded-lg shadow-2xl p-6 border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block px-4 py-3 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-400 font-bold' 
                        : 'text-gray-300 hover:bg-gray-800 font-medium'
                    }`}
                    style={{ fontFamily: 'Melete, Orbitron, sans-serif', fontWeight: 500 }}
                  >
                    {item.label}
                  </a>
                )
              })}

              {/* 資料請求ボタン - Mobile Menu */}
              <div className="pt-4 mt-4 border-t border-gray-700">
                <a
                  href="#contact?type=document"
                  onClick={(e) => handleNavClick(e, "#contact?type=document")}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium"
                >
                  <span className="font-['HackGen35']">資料請求</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}