'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import LenisProvider from '@/components/LenisProvider'
import { GA_TRACKING_ID } from '@/lib/gtag'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ParticleBackground from '@/components/ParticleBackground'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

function LayoutContent({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ゲーム開発所RYURYU',
    alternateName: 'RYURYU',
    url: 'https://ryuryugame.netlify.app',
    logo: 'https://ryuryugame.netlify.app/logo.png',
    description: 'Meta Quest、Meta Quest 2、Meta Quest 3専門のVR/AR開発スタジオ。産業用VRトレーニング、ARソリューション、メタバース構築。実績220件以上・平均4.9評価。',
    sameAs: [
      'https://coconala.com/users/1772507',
      'https://www.lancers.jp/profile/Ryuya_RStar'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '220',
      bestRating: '5',
      worstRating: '1'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'VR/AR開発サービス',
      itemListElement: [
        {
          '@type': 'Service',
          name: 'VR/ARアプリ開発',
          description: 'Meta Questシリーズ、HoloLens、モバイルAR対応。産業用トレーニング、教育コンテンツ、没入体験の開発。',
          provider: {
            '@type': 'Organization',
            name: 'ゲーム開発所RYURYU'
          },
          category: 'VR Development',
          offers: {
            '@type': 'Offer',
            price: '300000',
            priceCurrency: 'JPY',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31'
          }
        },
        {
          '@type': 'Service',
          name: 'Unityゲーム開発',
          description: 'Unity エンジンを使用したカスタムゲーム開発。モバイル、PC、コンソール対応。',
          provider: {
            '@type': 'Organization',
            name: 'ゲーム開発所RYURYU'
          },
          category: 'Game Development',
          offers: {
            '@type': 'Offer',
            price: '200000',
            priceCurrency: 'JPY',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31'
          }
        },
        {
          '@type': 'Service',
          name: 'Clusterワールド制作',
          description: 'Clusterプラットフォームでのメタバース空間制作。バーチャルイベント、展示会、ソーシャル体験の構築。',
          provider: {
            '@type': 'Organization',
            name: 'ゲーム開発所RYURYU'
          },
          category: 'Metaverse Development',
          offers: {
            '@type': 'Offer',
            price: '50000',
            priceCurrency: 'JPY',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31'
          }
        },
        {
          '@type': 'Service',
          name: 'Unity開発サポート',
          description: '30日間無制限チャットサポートと60分ビデオレクチャーでUnity開発をサポート。',
          provider: {
            '@type': 'Organization',
            name: 'ゲーム開発所RYURYU'
          },
          category: 'Technical Support',
          offers: {
            '@type': 'Offer',
            price: '20000',
            priceCurrency: 'JPY',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31'
          }
        }
      ]
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Japanese', 'English'],
      url: 'https://ryuryugame.netlify.app/#contact'
    }
  }

  return (
    <>
      {/* Google Analytics */}
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname
                });
              `,
            }}
          />
        </>
      )}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '対応しているVR/ARプラットフォームは何ですか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Meta Quest（Quest 1、Quest 2、Quest 3）、HoloLens、PC VR（Steam VR）、モバイルAR（ARKit/ARCore）、ウェブベースVRソリューションに対応しています。'
                }
              },
              {
                '@type': 'Question',
                name: 'VR/AR開発にはどれくらいの期間がかかりますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '複雑さに応じて開発期間は変動します。シンプルなプロトタイプは1-2週間、完全なVRアプリケーションは2-6ヶ月程度です。相談時に詳細なスケジュールをご提示します。'
                }
              },
              {
                '@type': 'Question',
                name: 'VR/AR開発の費用はどれくらいですか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'シンプルなClusterワールドは5万円から、Unityゲームは20万円から、完全なVR/ARアプリケーションは30万円からとなります。Meta Questプロジェクトは20%割引いたします。'
                }
              },
              {
                '@type': 'Question',
                name: '開発後のサポートは提供していますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'はい、30日間無制限チャットサポート（2万円）と60分ビデオ相談セッション（1万円）を提供しています。必要に応じてメンテナンスとアップデートも行います。'
                }
              },
              {
                '@type': 'Question',
                name: '海外のクライアントとも仕事ができますか？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'もちろんです！日本語と英語でサービスを提供しています。世界中のクライアントとの実績があり、異なるタイムゾーンでのコミュニケーションにも対応できます。'
                }
              }
            ]
          })
        }}
        strategy="afterInteractive"
      />
      <GoogleAnalytics />
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>Meta Quest VR/AR開発専門 RYURYU | Unity・VR・メタバース・XR開発外注</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Meta Quest・Meta Quest 2・Meta Quest 3対応VR/AR開発専門。Unity VRアプリ開発、AR産業ソリューション、Clusterメタバース構築。VR開発外注・見積もり対応。実績220件以上・平均4.9評価。" />
        <meta name="keywords" content="VR開発 依頼, VR アプリ 開発 外注, Meta Quest 開発, Meta Quest 2 VR, Meta Quest 3 対応, Unity VR 開発, AR開発 見積もり, VRコンテンツ制作, 産業用VR開発, VRトレーニング, ARソリューション, メタバース開発, Cluster ワールド制作, XR開発会社, HoloLens開発, VR development outsourcing, Unity VR solutions" />
        <meta name="author" content="ゲーム開発所RYURYU" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/Melete-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Melete-Medium.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Melete-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />

        {/* Preload critical images */}
        <link rel="preload" href="/services/game-development.webp" as="image" type="image/webp" />
        <link rel="preload" href="/services/cluster-world.webp" as="image" type="image/webp" />
        <link rel="preload" href="/services/chat-support-30day.webp" as="image" type="image/webp" />
        
        {/* Preconnect to speed up font loading */}
        <link rel="preconnect" href="/" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ryuryugame.netlify.app" />
        <meta property="og:title" content="Meta Quest VR/AR開発専門 RYURYU | Unity・VR・メタバース・XR開発外注" />
        <meta property="og:description" content="Meta Quest・Quest 2・Quest 3対応VR/AR開発。Unity VRアプリ、産業用VRトレーニング、Clusterメタバース構築。VR開発外注・見積もり対応。実績220件以上・平均4.9評価。" />
        <meta property="og:site_name" content="ゲーム開発所RYURYU" />
        <meta property="og:image" content="https://ryuryugame.netlify.app/ogp-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="VR/AR Solution Development RYURYU - Meta Quest・XR Solutions" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meta Quest VR開発専門 RYURYU | Unity VR/ARアプリ開発外注・見積もり対応" />
        <meta name="twitter:description" content="Meta Quest専門VR開発。Unity VRアプリ、産業用VR、Clusterメタバース。外注・見積もり対応。実績220件以上・平均4.9評価。" />
        <meta name="twitter:creator" content="@ryuryugame" />
        <meta name="twitter:image" content="https://ryuryugame.netlify.app/twitter-image.png" />
        <link rel="canonical" href="https://ryuryugame.netlify.app" />
        <link rel="alternate" hrefLang="ja" href="https://ryuryugame.netlify.app" />
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={inter.className}>
        <ParticleBackground />
        <LenisProvider>
          <LayoutContent>{children}</LayoutContent>
        </LenisProvider>
      </body>
    </html>
  )
}