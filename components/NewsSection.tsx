'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlitchTitle from './GlitchTitle'

interface NewsItem {
  id: string
  date: string
  category: string
  title: string
  description: string
  link?: string
  isNew?: boolean
}

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?lang=ja')
        const data = await response.json()
        setNewsItems(data)
      } catch (error) {
        console.error('Failed to load news:', error)
        setNewsItems([
          {
            id: '1',
            date: '2025.01.10',
            category: 'update',
            title: 'ウェブサイトをリニューアルしました',
            description: '新しいデザインと機能でより使いやすくなりました。',
            isNew: true
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  const categories = [
    { id: 'all', label: 'すべて', color: 'gray' },
    { id: 'update', label: 'お知らせ', color: 'blue' },
    { id: 'service', label: 'サービス', color: 'green' },
    { id: 'event', label: 'イベント', color: 'blue' },
    { id: 'achievement', label: '実績', color: 'yellow' },
  ]

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'update': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'rgba(59,130,246,0.3)' }
      case 'service': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', glow: 'rgba(34,197,94,0.3)' }
      case 'event': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'rgba(59,130,246,0.3)' }
      case 'achievement': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'rgba(234,179,8,0.3)' }
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', glow: 'rgba(107,114,128,0.3)' }
    }
  }

  const filteredNews = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory)

  const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 3)

  return (
    <section id="news" className="py-20 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
              NEWS
            </GlitchTitle>
            <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
              お知らせ
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['HackGen']">
              最新情報をお届けします
            </p>
          </div>

          {/* Category Filter - Glass Style */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20'
                }`} />
                <span className="relative z-10 font-['HackGen'] text-sm">{cat.label}</span>
              </motion.button>
            ))}
          </div>

          {/* News List - Glass Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-500/20 blur-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedNews.map((item, index) => {
                const categoryStyle = getCategoryColor(item.category)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative group rounded-2xl cursor-pointer"
                  >
                    {/* Glass Card Background */}
                    <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-white/[0.07] transition-all duration-300" />

                    {/* Hover Glow */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 blur-sm -z-10 transition-all duration-300" />

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Date & Category */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Date Badge */}
                          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 font-['HackGen35']">
                            {item.date}
                          </span>

                          {/* Category Badge */}
                          <span className={`px-3 py-1.5 rounded-lg ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} text-xs font-medium backdrop-blur-sm`}>
                            {categories.find(c => c.id === item.category)?.label}
                          </span>

                          {/* NEW Badge */}
                          {item.isNew && (
                            <span className="relative px-2 py-1 text-xs font-bold text-white rounded-lg overflow-hidden">
                              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 animate-pulse" />
                              <span className="relative z-10">NEW</span>
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors font-['HackGen35']">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 leading-relaxed font-['HackGen'] text-sm">
                            {item.description}
                          </p>
                          {item.link && (
                            <a
                              href={item.link}
                              className="inline-flex items-center gap-2 mt-3 text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-sm font-medium">詳細を見る</span>
                              <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* View More/Less Button - Glass Style */}
          {filteredNews.length > 3 && (
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => setShowAll(!showAll)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-8 py-3 rounded-xl font-bold text-white overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-500/30 rounded-xl transition-all duration-300 group-hover:from-cyan-500/30 group-hover:to-blue-500/30" />
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
                <span className="relative z-10 font-['HackGen35']">
                  {showAll ? '閉じる' : `もっと見る (${filteredNews.length - 3})`}
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
