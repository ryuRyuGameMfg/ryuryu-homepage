'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSectionData } from '@/hooks/useSectionData'
import GlitchTitle from './GlitchTitle'
import { Glasses, Gamepad2, Globe, MessageCircle, Star } from 'lucide-react'

interface ServiceDetail {
  id: string
  title: string
  category: string
  description: string
  features: string[]
  price: string
  duration: string
  color: string
  icon: string
  detailedDescription: string
  process: string[]
  cta: string
  ctaAction: string
  image: string
  benefits?: string[]
  targetAudience?: string[]
}

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [services, setServices] = useState<ServiceDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const { sectionData } = useSectionData('services')
  
  useEffect(() => {
    // Use static service data instead of fetching from API
    const staticServices: ServiceDetail[] = [
      {
        id: 'vr-ar',
        title: 'VR/AR開発',
        category: '開発サービス',
        description: 'Meta Quest・Apple Vision Pro対応のVR/ARアプリケーション開発',
        features: ['Unity/Unreal Engine対応', 'Meta Quest・Apple Vision Pro対応', 'プロトタイプから本番環境まで'],
        price: '¥50,000~',
        duration: '2週間~',
        color: '#8b5cf6',
        icon: 'vr',
        detailedDescription: 'Meta Quest、Apple Vision Proなど最新デバイスに対応したVR/ARアプリケーションを開発。プロトタイプから本番環境まで一貫してサポートします。',
        process: ['要件定義・企画', 'プロトタイプ開発', '本開発・テスト', '納品・運用サポート'],
        cta: '今すぐ相談',
        ctaAction: 'contact',
        image: '/services/game-development.png',
        benefits: ['Unity/Unreal Engine対応', 'Meta Quest・Apple Vision Pro対応', 'プロトタイプから本番環境まで'],
        targetAudience: ['individual', 'company', 'education']
      },
      {
        id: 'game-dev',
        title: 'ゲーム開発',
        category: '開発サービス',
        description: 'Unity・Unreal Engineによる2D/3Dゲーム開発',
        features: ['Unity・Unreal Engine対応', 'マルチプラットフォーム対応', 'ゲームデザインから実装まで'],
        price: '¥100,000~',
        duration: '2週間~',
        color: '#06b6d4',
        icon: 'game',
        detailedDescription: 'Unity・Unreal Engineを使用した2D/3Dゲーム開発。PC・モバイル・コンソールまで幅広いプラットフォームに対応します。',
        process: ['企画・ゲームデザイン', 'プロトタイプ制作', '本開発・デバッグ', 'リリース・運用'],
        cta: '開発相談',
        ctaAction: 'contact',
        image: '/services/game-development.png',
        benefits: ['Unity・Unreal Engine対応', 'マルチプラットフォーム対応', 'ゲームデザインから実装まで'],
        targetAudience: ['individual', 'company', 'education']
      },
      {
        id: 'cluster',
        title: 'cluster ワールド制作',
        category: 'メタバース',
        description: 'clusterでのイベント・展示会向けワールド制作',
        features: ['cluster公式ガイドライン準拠', 'イベント・展示会向け設計', '短納期対応可能'],
        price: '¥30,000~',
        duration: '1週間~',
        color: '#a855f7',
        icon: 'globe',
        detailedDescription: 'clusterでのイベント・展示会・コミュニティスペース向けワールドを制作。公式ガイドラインに準拠した高品質なワールドを提供します。',
        process: ['コンセプト設計', 'ワールド制作', 'テスト・調整', '納品・公開サポート'],
        cta: 'ワールド制作相談',
        ctaAction: 'contact',
        image: '/services/cluster-world.png',
        benefits: ['cluster公式ガイドライン準拠', 'イベント・展示会向け設計', '短納期対応可能'],
        targetAudience: ['individual', 'company', 'community']
      },
      {
        id: 'support',
        title: '30日間チャットサポート',
        category: 'サポート',
        description: '開発に関する質問・相談を30日間チャットでサポート',
        features: ['24時間以内に返信', '技術的な質問に対応', 'コードレビュー・アドバイス'],
        price: '¥10,000',
        duration: '30日間',
        color: '#ef4444',
        icon: 'chat',
        detailedDescription: '開発に関する質問や相談を30日間チャットでサポート。Unity・VR開発の技術的な質問に専門家が回答します。',
        process: ['契約・チャット開始', '質問・相談受付', '回答・アドバイス', '継続サポート'],
        cta: 'サポート開始',
        ctaAction: 'contact',
        image: '/services/chat-support-30day.png',
        benefits: ['24時間以内に返信', '技術的な質問に対応', 'コードレビュー・アドバイス'],
        targetAudience: ['individual', 'beginner']
      }
    ]

    setServices(staticServices)
    setIsLoading(false)
  }, [])
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  // 各カード用のIntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id')
            if (cardId) {
              setVisibleCards((prev) => new Set(prev).add(cardId))
            }
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px 100px 0px' }
    )

    cardRefs.current.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [services])

  const openModal = (service: ServiceDetail) => {
    setSelectedService(service)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedService(null)
      document.body.style.overflow = 'unset'
    }, 300)
  }
  
  return (
    <>
      <section id="services" ref={sectionRef} className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
              {sectionData?.title || 'SERVICES'}
            </GlitchTitle>
            <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
              {sectionData?.subtitle || 'サービス一覧'}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['HackGen']">
              {sectionData?.description || 'VR/AR開発からゲーム制作まで、幅広いサービスを提供'}
            </p>
          </div>
          
          {/* Services List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
          <div className="max-w-5xl mx-auto">
            {/* 4サービス統一2×2グリッド */}
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {services.map((service, index) => {
                const isCardVisible = visibleCards.has(service.id)
                return (
                <div
                  key={service.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(service.id, el)
                  }}
                  data-card-id={service.id}
                  className="group cursor-pointer"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: `${index * 50}ms`,
                    opacity: isCardVisible ? 1 : 0,
                    transform: isCardVisible
                      ? 'translateY(0) scale(1) rotateX(0deg)'
                      : `translateY(30px) scale(0.95) rotateX(5deg)`,
                    transformOrigin: 'center bottom'
                  }}
                  onClick={() => openModal(service)}
                >
                  <div className={`relative h-full bg-gray-800/50 backdrop-blur-sm rounded-xl border ${
                    service.id === 'vr-ar'
                      ? 'border-blue-500/70 hover:border-blue-400 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.6)]'
                      : 'border-gray-700/60 hover:border-gray-600 hover:shadow-[0_8px_30px_-10px_rgba(6,182,212,0.2)]'
                  } overflow-hidden transition-all duration-300 hover:-translate-y-1`}>
                    {/* キラキラ粒子エフェクト - VR/ARカードのみ */}
                    {service.id === 'vr-ar' && (
                      <div className="absolute inset-0 pointer-events-none z-30">
                        <div className="absolute top-[3px] left-[20%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-[twinkle_2s_ease-in-out_infinite]"></div>
                        <div className="absolute top-[3px] right-[30%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-[twinkle_2s_ease-in-out_infinite_0.5s]"></div>
                        <div className="absolute top-[30%] right-[3px] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-[twinkle_2s_ease-in-out_infinite_1s]"></div>
                        <div className="absolute bottom-[3px] right-[25%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-[twinkle_2s_ease-in-out_infinite_1.5s]"></div>
                        <div className="absolute bottom-[3px] left-[40%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-[twinkle_2s_ease-in-out_infinite_0.3s]"></div>
                        <div className="absolute top-[20%] left-[3px] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-[twinkle_2s_ease-in-out_infinite_0.9s]"></div>
                      </div>
                    )}

                    {/* アクセントライン */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{
                      background: `linear-gradient(90deg, ${service.color} 0%, transparent 100%)`
                    }} />

                    {/* 人気No.1バッジ - VR/ARカードのみ */}
                    {service.id === 'vr-ar' && (
                      <div className="absolute top-2 right-2 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 animate-pulse"></div>
                          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                            <span className="relative z-10">人気No.1</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* サムネイル画像 */}
                    <div className="group/img relative w-full aspect-[2983/2481] overflow-hidden bg-gray-900/30 z-10">
                      <Image
                        src={service.image}
                        alt={`${service.title} - ${service.description}`}
                        fill
                        className="object-contain transition-transform duration-300 group-hover/img:scale-105"
                        sizes="(max-width: 768px) 50vw, 400px"
                        loading="lazy"
                        quality={75}
                      />
                    </div>

                    <div className="relative p-3 md:p-4 z-10">
                      <h3 className="text-sm md:text-base font-bold text-white mb-1 font-['HackGen35'] leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* 価格と詳細ボタン */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700/60">
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-base md:text-lg font-bold" style={{ color: service.color }}>
                            {service.price}
                          </p>
                          <p className="text-xs text-gray-500 hidden md:block">
                            {service.duration}
                          </p>
                        </div>
                        <button className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                          service.id === 'vr-ar'
                            ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                            : 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700'
                        }`}>
                          <span>詳細</span>
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Modal Popup - Glass Design */}
      {isModalOpen && selectedService && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Background Glow Effects */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${selectedService.color}15` }} />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Content - Glass Design */}
          <div
            className={`relative max-w-3xl w-full transform transition-all duration-300 ${
              isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer Glow */}
            <div
              className="absolute -inset-1 rounded-3xl blur-md opacity-50"
              style={{ background: `linear-gradient(135deg, ${selectedService.color}40, transparent, rgba(6,182,212,0.3))` }}
            />

            {/* Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${selectedService.color}, transparent 50%, rgba(6,182,212,0.8))` }}
              />

              {/* Modal Content Grid */}
              <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start gap-4">
                    {/* Icon Badge */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${selectedService.color}, ${selectedService.color}cc)`,
                        boxShadow: `0 0 20px ${selectedService.color}50`
                      }}
                    >
                      {selectedService.icon === 'vr' && <Glasses className="w-6 h-6" />}
                      {selectedService.icon === 'game' && <Gamepad2 className="w-6 h-6" />}
                      {selectedService.icon === 'globe' && <Globe className="w-6 h-6" />}
                      {selectedService.icon === 'chat' && <MessageCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 font-['HackGen35']">
                        {selectedService.title}
                      </h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-bold" style={{ color: selectedService.color }}>
                          {selectedService.price}
                        </span>
                        <span className="text-gray-400">{selectedService.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content - 2 Column Layout */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Left Column - Description & Benefits */}
                  <div className="space-y-5">
                    <div className="relative p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider font-['HackGen']">
                        サービス内容
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedService.detailedDescription}
                      </p>
                    </div>

                    <div className="relative p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider font-['HackGen']">
                        主な特徴
                      </h4>
                      <div className="space-y-2">
                        {(selectedService.benefits || selectedService.features.slice(0, 3)).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Process */}
                  <div className="relative p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider font-['HackGen']">
                      制作フロー
                    </h4>
                    <div className="space-y-3">
                      {selectedService.process.slice(0, 4).map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${selectedService.color}, ${selectedService.color}99)`,
                              boxShadow: `0 0 10px ${selectedService.color}30`
                            }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-gray-300 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="relative pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-gray-400 mb-2 font-['HackGen']">対象者</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedService.targetAudience || ['individual', 'company']).map((audience, index) => {
                          const audienceMap: { [key: string]: string } = {
                            individual: '個人',
                            company: '法人',
                            education: '教育機関',
                            community: 'コミュニティ',
                            beginner: '初心者'
                          }
                          return (
                          <span
                            key={index}
                            className="text-xs px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-300"
                          >
                            {audienceMap[audience] || audience}
                          </span>
                        )})}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // GA4イベント送信（スクロール前に実行）
                        if (typeof window !== 'undefined' && window.gtag && selectedService) {
                          window.gtag('event', 'click_document_request', {
                            event_category: 'engagement',
                            event_label: `service_modal_${selectedService.id}`,
                            content_type: 'service_cta',
                            service_id: selectedService.id
                          })
                        }

                        // モーダルを閉じる
                        closeModal()

                        // モーダル閉鎖アニメーション完了後にスクロール実行
                        setTimeout(() => {
                          const targetUrl = `#contact?service=${selectedService.id}&type=document`
                          const [hash, queryString] = targetUrl.includes('?') ? targetUrl.split('?') : [targetUrl, '']

                          // ハッシュ部分のみでスクロール
                          const element = document.querySelector(hash)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })

                            // スクロール完了後に完全なハッシュを設定（パラメータ込み）
                            setTimeout(() => {
                              window.location.hash = queryString ? `${hash}?${queryString}` : hash
                            }, 500)
                          }
                        }, 300) // closeModalのsetTimeoutと同じ300ms待機
                      }}
                      className="relative group px-8 py-3 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                      {/* Button Glass Background */}
                      <span
                        className="absolute inset-0 rounded-xl transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${selectedService.color}, rgba(6,182,212,0.8))`,
                          boxShadow: `0 0 20px ${selectedService.color}40`
                        }}
                      />
                      {/* Button Hover Glow */}
                      <span
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 30px ${selectedService.color}60` }}
                      />
                      <span className="relative z-10 font-['HackGen35']">
                        資料請求
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}