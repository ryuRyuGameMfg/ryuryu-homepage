'use client'

import { motion } from 'framer-motion'
import ContactForm from '@/components/ContactForm'
import { useSectionData } from '@/hooks/useSectionData'
import Image from 'next/image'
import GlitchTitle from './GlitchTitle'
import * as gtag from '@/lib/gtag'
import { MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const { sectionData } = useSectionData('contact')

  const LINE_URL = 'https://lin.ee/SNtX7Fe'

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <GlitchTitle className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Melete']">
              {sectionData?.title || 'CONTACT'}
            </GlitchTitle>
            <p className="text-base text-gray-400 mb-2 font-['HackGen35']">
              {sectionData?.subtitle || 'お問い合わせ'}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mt-4 mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['HackGen']">
              {sectionData?.description || 'お気軽にご相談ください'}
            </p>
          </div>

          {/* LINE Official Account - Primary CTA */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Outer Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl opacity-50" />

            {/* Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* QR Code */}
                <div className="relative">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-green-500/30 to-emerald-500/30 blur-md" />
                  <div className="relative bg-white rounded-xl p-2 shadow-lg">
                    <Image
                      src="/logos/line-qr.png"
                      alt="LINE QR - RYURYU"
                      width={140}
                      height={140}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-['HackGen35']">
                      LINE公式アカウント
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 font-['HackGen']">
                    LINEで気軽にお問い合わせ・ご相談いただけます
                  </p>
                  <ul className="text-sm text-gray-400 mb-5 space-y-1 font-['HackGen']">
                    <li>最短即日で返信</li>
                    <li>チャットで気軽に相談</li>
                    <li>無料見積もり対応</li>
                  </ul>

                  {/* LINE Button */}
                  <motion.a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                    onClick={() => {
                      gtag.event({
                        action: 'click_platform',
                        category: 'external_link',
                        label: 'line_official',
                        value: 1
                      })
                    }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    <span className="font-['HackGen35']">友だち追加</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Divider - Form Section */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm text-gray-400 font-['HackGen']">
                または、フォームからお問い合わせ
              </span>
            </div>
          </div>

          {/* Contact Form - Secondary */}
          <ContactForm />

          {/* Platform Links - Tertiary */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs text-gray-500 font-['HackGen']">
                  安心の取引保証付きプラットフォーム
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-4 justify-center">
              {/* Coconala Card - Compact */}
              <motion.a
                href="https://coconala.com/users/1772507"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
                onClick={() => {
                  gtag.event({
                    action: 'click_platform',
                    category: 'external_link',
                    label: 'coconala',
                    value: 1
                  })
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-green-500/30 p-3 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image
                        src="/logos/coconala-logo.png"
                        alt="coconala"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors font-['HackGen']">
                      ココナラ
                    </span>
                  </div>
                </div>
              </motion.a>

              {/* Lancers Card - Compact */}
              <motion.a
                href="https://www.lancers.jp/profile/Ryuya_RStar"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
                onClick={() => {
                  gtag.event({
                    action: 'click_platform',
                    category: 'external_link',
                    label: 'lancers',
                    value: 1
                  })
                }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-cyan-500/30 p-3 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image
                        src="/logos/lancers-logo.png"
                        alt="lancers"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-cyan-400 transition-colors font-['HackGen']">
                      ランサーズ
                    </span>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
