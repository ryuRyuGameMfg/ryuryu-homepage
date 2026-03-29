'use client'

import { useState, FormEvent, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Send } from 'lucide-react'

interface FormData {
  name: string
  email: string
  company: string
  category: string
  message: string
  budget: string
  deadline: string
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    category: '',
    message: '',
    budget: '',
    deadline: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasFormStarted, setHasFormStarted] = useState(false)

  // URL Parameterからサービス情報を読み取り、message自動入力
  useEffect(() => {
    if (typeof window === 'undefined') return

    // パラメータ読み取り関数
    const loadParametersFromHash = () => {
      try {
        const hash = window.location.hash
        const queryString = hash.includes('?') ? hash.split('?')[1] : ''

        if (!queryString) return

        const params = new URLSearchParams(queryString)
        const serviceId = params.get('service')
        const requestType = params.get('type')

        if (requestType === 'document') {
          // サービス名マッピング
          const serviceNames: { [key: string]: string } = {
            'vr-ar': 'VR/AR開発',
            'game-dev': 'ゲーム開発',
            'cluster': 'Clusterワールド制作',
            'support': 'Unity開発サポート'
          }

          const serviceName = serviceId ? serviceNames[serviceId] : ''
          const message = serviceName
            ? `【資料請求】${serviceName}について詳しく知りたいです。`
            : '【資料請求】サービス資料を希望します。'

          setFormData(prev => ({
            ...prev,
            message
          }))

          // GA4イベント
          if (window.gtag) {
            window.gtag('event', 'form_prefill', {
              event_category: 'engagement',
              event_label: 'document_request',
              service_id: serviceId || 'general'
            })
          }
        }
      } catch (error) {
        console.error('URL Parameter読み取りエラー:', error)
      }
    }

    // 初回実行
    loadParametersFromHash()

    // ハッシュ変更を監視
    window.addEventListener('hashchange', loadParametersFromHash)

    return () => {
      window.removeEventListener('hashchange', loadParametersFromHash)
    }
  }, [])

  const handleFormStart = () => {
    if (!hasFormStarted) {
      setHasFormStarted(true)

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_start', {
          event_category: 'engagement',
          event_label: 'contact_form',
          form_id: 'contact_form'
        })
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須項目です'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須項目です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL

      if (!GAS_URL) {
        throw new Error('GAS URLが設定されていません')
      }

      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      setSubmitStatus('success')

      if (typeof window !== 'undefined' && window.gtag) {
        const budgetValue = {
          'under10': 50000,
          '10to30': 200000,
          '30to50': 400000,
          '50to100': 750000,
          '100to300': 2000000,
          '300to500': 4000000,
          'over500': 5000000,
          'discuss': 0
        }[formData.budget] || 0

        window.gtag('event', 'generate_lead', {
          currency: 'JPY',
          value: budgetValue,
          category: formData.category
        })

        window.gtag('event', 'form_submit', {
          form_id: 'contact_form',
          form_name: 'お問い合わせフォーム',
          category: formData.category,
          budget_range: formData.budget,
          budget_value: budgetValue
        })
      }

      setFormData({
        name: '',
        email: '',
        company: '',
        category: '',
        message: '',
        budget: '',
        deadline: '',
      })
      setErrors({})
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Outer Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg opacity-50" />

      {/* Glass Card */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2 font-['HackGen']">
              お名前 <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFormStart}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 border transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 ${
                errors.name ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
              }`}
              placeholder="お名前"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2 font-['HackGen']">
              メールアドレス <span className="text-cyan-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFormStart}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 border transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 ${
                errors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2 font-['HackGen']">
              お問い合わせ内容 <span className="text-gray-500 text-xs ml-2">任意</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 border transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 resize-y min-h-[150px] max-h-[400px] ${
                errors.message ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
              }`}
              placeholder="ご相談内容をお聞かせください"
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl"
            >
              <p className="text-green-400 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> 送信が完了しました。2営業日以内にご返信いたします。
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl"
            >
              <p className="text-red-400 font-medium">
                送信に失敗しました。しばらく時間をおいて再度お試しください。
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`relative w-full py-4 px-6 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 ${
              isSubmitting ? 'cursor-not-allowed' : ''
            }`}
          >
            {/* Button Background */}
            <span className={`absolute inset-0 transition-all duration-300 ${
              isSubmitting
                ? 'bg-gray-600'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
            }`} />

            {/* Button Glow */}
            {!isSubmitting && (
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2 font-['HackGen35']">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  送信中...
                </>
              ) : (
                <>
                  送信する
                  <Send className="w-5 h-5" />
                </>
              )}
            </span>
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-4 font-['HackGen']">
            通常2営業日以内にご返信いたします
          </p>
        </form>
      </div>
    </motion.div>
  )
}
