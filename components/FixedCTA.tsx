'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react'

export default function FixedCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Scroll position monitoring
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100

      setIsVisible(scrollPosition > 300 || scrollPercentage > 20)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleScroll()
    handleResize()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Reset form when closed
  useEffect(() => {
    if (!isBottomSheetOpen) {
      setTimeout(() => {
        setEmail('')
        setIsSuccess(false)
      }, 300)
    }
  }, [isBottomSheetOpen])

  // Prevent background scroll when open
  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isBottomSheetOpen])

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'floating_cta',
        item_id: 'bottom_sheet_trigger'
      })
    }
    setIsBottomSheetOpen(true)
    setShowTooltip(false)
  }

  const handleMouseEnter = () => {
    if (!isMobile && !isBottomSheetOpen) {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email,
          message: '資料請求',
          source: 'bottom_sheet_form'
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setEmail('')
        setTimeout(() => {
          setIsBottomSheetOpen(false)
        }, 2000)
      }
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToContact = () => {
    setIsBottomSheetOpen(false)
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Floating CTA Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
          >
            {/* Main Bubble */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Main Button */}
              <motion.button
                onClick={handleClick}
                className="relative w-[60px] h-[60px] bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center text-white overflow-hidden group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="お問い合わせ"
              >
                {/* Pulse Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />

                {/* Icon */}
                <MessageCircle className="w-6 h-6 relative z-10" />

                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ transform: 'translateY(-100%)' }}
                  animate={{
                    transform: ['translateY(100%)', 'translateY(-100%)'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.button>

              {/* Tooltip (PC hover only) */}
              <AnimatePresence>
                {showTooltip && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full mb-2 right-0 pointer-events-none"
                  >
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap relative font-['HackGen35']">
                      <span>資料をダウンロード</span>
                      <div className="absolute bottom-0 right-4 transform translate-y-full">
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notification Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              >
                <motion.div
                  className="absolute inset-0 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBottomSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />

            {/* Bottom Sheet Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8
              }}
              className="fixed bottom-0 left-0 right-0 z-[100]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass Background */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-t-3xl border-t border-x border-white/10 shadow-2xl">
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-white/30 rounded-full" />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="px-6 pb-8 max-w-md mx-auto w-full">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 font-['HackGen35']">
                      資料を今すぐダウンロード
                    </h3>
                    <p className="text-sm text-gray-400 font-['HackGen']">
                      メールアドレスのみで簡単登録
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@company.com"
                        required
                        disabled={isSubmitting || isSuccess}
                        className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl
                          focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10
                          transition-all text-base text-white placeholder-gray-500 hover:border-white/20
                          disabled:opacity-50 disabled:cursor-not-allowed font-['HackGen']"
                        autoFocus
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`relative w-full py-4 px-8 rounded-xl font-bold text-white text-lg font-['HackGen35']
                        flex items-center justify-center overflow-hidden transition-all duration-300 ${
                        isSuccess
                          ? ''
                          : isSubmitting
                          ? 'cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {/* Button Background */}
                      <span className={`absolute inset-0 transition-all duration-300 ${
                        isSuccess
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : isSubmitting
                          ? 'bg-gray-600'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      }`} />

                      {/* Button Glow */}
                      {!isSubmitting && !isSuccess && (
                        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
                      )}

                      <span className="relative z-10 flex items-center justify-center">
                        {isSuccess ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            送信完了
                          </>
                        ) : isSubmitting ? (
                          <>
                            <div className="rounded-full h-4 w-4 border-b-2 border-white mr-2 animate-spin" />
                            送信中...
                          </>
                        ) : (
                          <>
                            資料をダウンロード
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-green-400 text-sm font-medium font-['HackGen']"
                      >
                        資料のダウンロードリンクをメールで送信しました
                      </motion.div>
                    )}
                  </form>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs text-center text-gray-500 font-['HackGen']">
                      詳細なご相談をご希望の方は
                      <button
                        onClick={scrollToContact}
                        className="text-cyan-400 hover:text-cyan-300 underline font-medium ml-1 transition-colors"
                      >
                        下部の詳細フォーム
                      </button>
                      へ
                    </p>
                  </div>
                </div>

                {/* Safe Area for iPhone */}
                <div className="h-[env(safe-area-inset-bottom)] bg-gray-900/80" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
