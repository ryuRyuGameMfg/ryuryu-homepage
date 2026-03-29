'use client'

import { useSectionData } from '@/hooks/useSectionData'
import GlitchTitle from './GlitchTitle'
import YouTubeEmbed from './YouTubeEmbed'

export default function VideoPortfolioSection() {
  const { sectionData } = useSectionData('video')
  
  // YouTubeのURLから埋め込み用URLを生成
  const videoId = 'YvGvPh0SjuA'

  return (
    <section id="video-portfolio" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
            {sectionData?.title || 'PORTFOLIO VIDEO'}
          </GlitchTitle>
          <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
            {sectionData?.subtitle || '制作実績'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-['HackGen']">
            {sectionData?.description || '過去の制作実績をご紹介'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <YouTubeEmbed
            videoId={videoId}
            title="ゲーム開発所RYURYU - ポートフォリオ動画"
          />
        </div>
      </div>
    </section>
  )
}