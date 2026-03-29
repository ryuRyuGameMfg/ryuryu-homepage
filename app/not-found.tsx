'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, MessageCircle, Glasses } from 'lucide-react'

export default function NotFound() {

  useEffect(() => {
    // GA4 404エラーイベントを送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'error_404', {
        event_category: 'error',
        event_label: window.location.pathname,
        page_location: window.location.href,
        page_title: '404 - Page Not Found'
      })

    }
  }, [])

  const handleHomeClick = () => {
    // ホームページリンククリックをトラッキング
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_cta', {
        event_category: 'error_recovery',
        event_label: '404_to_home',
        content_type: 'navigation_link'
      })
    }
  }

  const handleContactClick = () => {
    // お問い合わせリンククリックをトラッキング
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_cta', {
        event_category: 'error_recovery',
        event_label: '404_to_contact',
        content_type: 'navigation_link'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404アニメーション */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse mb-4">
            404
          </div>
          <div className="text-2xl font-bold text-white mb-4">
            ページが見つかりません
          </div>
          <p className="text-gray-400 text-lg">
            お探しのページは移動、削除されたか、存在しない可能性があります。
          </p>
        </div>

        {/* VRテーマの装飾 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Glasses className="w-16 h-16 text-cyan-400 mb-4" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="space-y-4">
          <Link 
            href="/"
            onClick={handleHomeClick}
            className="block w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              ホームページに戻る
            </span>
          </Link>

          <Link
            href="/#contact"
            onClick={handleContactClick}
            className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              お問い合わせ
            </span>
          </Link>
        </div>

        {/* 推奨リンク */}
        <div className="mt-8 text-gray-500">
          <p className="text-sm mb-4">
            こちらもご覧ください：
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link href="/#services" className="hover:text-cyan-400 transition-colors">
              VR/ARサービス
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/#portfolio" className="hover:text-cyan-400 transition-colors">
              ポートフォリオ
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/#about" className="hover:text-cyan-400 transition-colors">
              会社概要
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}