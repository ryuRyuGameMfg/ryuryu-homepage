'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import * as gtag from '@/lib/gtag'

// ページビューを送信するコンポーネント
function GoogleAnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gtag.GA_TRACKING_ID) return
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // ページビューイベントを送信
    gtag.pageview(url)
    
  }, [pathname, searchParams])

  // スクロール深度の追跡
  useEffect(() => {
    if (!gtag.GA_TRACKING_ID) return

    let maxScroll = 0
    const scrollDepths = [25, 50, 75, 90, 100]
    const sentDepths = new Set<number>()

    const handleScroll = () => {
      const scrollPercentage = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage
        
        scrollDepths.forEach(depth => {
          if (maxScroll >= depth && !sentDepths.has(depth)) {
            sentDepths.add(depth)
            
            // スクロール深度イベントを送信
            gtag.event({
              action: 'scroll',
              category: 'engagement',
              label: `${depth}%`,
              value: depth
            })
            
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // ページ滞在時間の追跡（time_on_page イベント）
  useEffect(() => {
    if (!gtag.GA_TRACKING_ID) return

    const startTime = Date.now()
    const timeThresholds = [10, 30, 60, 180] // 秒単位の閾値
    const sentThresholds = new Set<number>()
    
    const checkTimeSpent = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      
      timeThresholds.forEach(threshold => {
        if (timeSpent >= threshold && !sentThresholds.has(threshold)) {
          sentThresholds.add(threshold)
          
          // time_on_page イベントを送信
          gtag.event({
            action: 'time_on_page',
            category: 'engagement',
            label: `${threshold}_seconds`,
            value: threshold
          })
          
        }
      })
    }
    
    // 定期的にチェック（5秒ごと）
    const intervalId = setInterval(checkTimeSpent, 5000)
    
    const sendEngagementTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      
      if (timeSpent > 0) {
        gtag.event({
          action: 'page_engagement_time',
          category: 'engagement',
          label: pathname,
          value: timeSpent
        })
        
      }
    }

    // ページ離脱時に送信
    return () => {
      clearInterval(intervalId)
      sendEngagementTime()
    }
  }, [pathname])

  return null
}

// Suspense境界でラップしたエクスポート
export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  )
}