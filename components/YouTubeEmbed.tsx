'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import * as gtag from '@/lib/gtag'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  description?: string
  duration?: string
}

export default function YouTubeEmbed({ 
  videoId, 
  title = 'YouTube Video', 
  description = '',
  duration = 'PT0S' 
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const handleLoad = () => {
    setIsLoaded(true)
    
    // GA4イベント送信
    gtag.event({
      action: 'video_play',
      category: 'engagement',
      label: videoId,
      value: 1
    })
  }

  const videoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description || title,
    thumbnailUrl: thumbnailUrl,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
    duration: duration,
    uploadDate: new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'VR/ARソリューション開発 RYURYU',
      url: 'https://unitymarket.netlify.app'
    }
  }

  if (!isLoaded) {
    return (
      <>
        <Script
          id={`video-structured-data-${videoId}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }}
          strategy="afterInteractive"
        />
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-800 cursor-pointer group"
             onClick={handleLoad}>
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <button
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <div className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}