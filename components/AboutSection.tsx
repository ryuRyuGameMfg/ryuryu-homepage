'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSectionData } from '@/hooks/useSectionData'
import GlitchTitle from './GlitchTitle'
import YouTubeEmbed from './YouTubeEmbed'

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [typedContent, setTypedContent] = useState<string>('')
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const [hasTyped, setHasTyped] = useState(false)
  const { sectionData } = useSectionData('about')
  
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
  
  // タイピングアニメーション処理
  const startTypingAnimation = useCallback(() => {
    const content = 'ゲーム開発所RYURYUは、VR・AR・Unity開発に特化したスタジオです。個人開発者から企業まで、あらゆる規模のプロジェクトに対応。Meta Quest・Apple Vision Proなど最新デバイスから、cluster・VRChatなどメタバース空間まで幅広く開発実績があります。「作りたいものを、確実に形にする」をモットーに、高品質な開発サービスを提供します。'

    // 状態をリセット
    setTypedContent('')
    setCurrentParagraph(0)

    let contentIndex = 0

    // タイピング
    const typeContent = setInterval(() => {
      if (contentIndex < content.length) {
        setTypedContent(content.substring(0, contentIndex + 1))
        contentIndex++
      } else {
        clearInterval(typeContent)
        setCurrentParagraph(1)
      }
    }, 20)
  }, [])
  
  // タイピングアニメーション用のObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTyped) {
            setHasTyped(true)
            startTypingAnimation()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (storyRef.current) {
      observer.observe(storyRef.current)
    }

    return () => observer.disconnect()
  }, [hasTyped, startTypingAnimation])
  
  // YouTube動画のID
  const youtubeVideoId = 'fzEPIabqv5Q'
  
  return (
    <section id="about" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
              {sectionData?.title || 'ABOUT US'}
            </GlitchTitle>
            <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
              {sectionData?.subtitle || '私たちについて'}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4"></div>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto font-['HackGen']">
              {sectionData?.description || 'VR・AR・Unity開発で、あなたの想像を現実に'}
            </p>
          </div>

          {/* Story Section */}
          <div ref={storyRef} className={`mt-12 mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg md:text-xl font-bold text-white mb-8 text-center font-['HackGen35']">
                ゲーム開発所RYURYUのストーリー
              </h3>

              <div className="space-y-6 text-gray-300 leading-relaxed font-['HackGen']">
                <p className="text-base whitespace-pre-line">
                  {typedContent}
                  {currentParagraph === 0 && typedContent.length > 0 && typedContent.length < 'ゲーム開発所RYURYUは、VR・AR・Unity開発に特化したスタジオです。個人開発者から企業まで、あらゆる規模のプロジェクトに対応。Meta Quest・Apple Vision Proなど最新デバイスから、cluster・VRChatなどメタバース空間まで幅広く開発実績があります。「作りたいものを、確実に形にする」をモットーに、高品質な開発サービスを提供します。'.length && (
                    <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Video Container */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <YouTubeEmbed
              videoId={youtubeVideoId}
              title="ゲーム開発所RYURYU - サービス紹介動画"
            />
          </div>
        </div>
      </div>
    </section>
  )
}