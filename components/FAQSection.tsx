'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import GlitchTitle from './GlitchTitle'

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
}

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch('/api/faq?lang=ja')
        const data = await response.json()
        if (Array.isArray(data)) {
          setFaqItems(data)
        } else {
          throw new Error('Invalid FAQ data format')
        }
      } catch (error) {
        console.error('Failed to load FAQ:', error)
        setFaqItems([
          {
            id: '1',
            category: 'general',
            question: 'どのような開発に対応していますか？',
            answer: 'VR/AR開発、Unity/Unreal Engineを使用したゲーム開発、clusterワールド制作など幅広く対応しています。'
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQ()
  }, [])

  const categoryMap: { [key: string]: { label: string; icon: ReactNode } } = {
    all: {
      label: 'すべて',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    general: {
      label: '一般',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    pricing: {
      label: '料金',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    technical: {
      label: '技術',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    support: {
      label: 'サポート',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    development: {
      label: '開発',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  }

  const uniqueCategories = ['all', ...new Set(Array.isArray(faqItems) ? faqItems.map(item => item.category) : [])]
  const categories = uniqueCategories.map(id => ({
    id,
    label: categoryMap[id]?.label || id,
    icon: categoryMap[id]?.icon || categoryMap.all.icon
  }))

  const filteredFAQ = Array.isArray(faqItems)
    ? (selectedCategory === 'all' ? faqItems : faqItems.filter(item => item.category === selectedCategory))
    : []

  const displayedFAQ = showAll ? filteredFAQ : filteredFAQ.slice(0, 5)

  return (
    <section id="faq" className="py-20 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
              FAQ
            </GlitchTitle>
            <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
              よくある質問
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['HackGen']">
              お客様からよく寄せられる質問にお答えします
            </p>
          </div>

          {/* Category Tabs - Glass Style */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
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
                <span className="relative z-10 flex items-center gap-2">
                  {cat.icon}
                  <span className="font-['HackGen'] text-sm">{cat.label}</span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* FAQ Items - Glass Cards (No Accordion) */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-500/20 blur-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedFAQ.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative group rounded-2xl"
                >
                  {/* Glass Card Background */}
                  <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-white/[0.07] transition-all duration-300" />

                  {/* Hover Glow */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 blur-sm -z-10 transition-all duration-300" />

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Question */}
                    <div className="flex items-start gap-4 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        Q
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-white font-['HackGen35'] pt-0.5">
                        {item.question}
                      </h3>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 ml-12" />

                    {/* Answer */}
                    <div className="flex items-start gap-4 ml-0 md:ml-0">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                        A
                      </span>
                      <p className="text-gray-300 leading-relaxed font-['HackGen'] pt-0.5">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* View More/Less Button */}
          {filteredFAQ.length > 5 && (
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
                  {showAll ? '閉じる' : `もっと見る (${filteredFAQ.length - 5})`}
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
