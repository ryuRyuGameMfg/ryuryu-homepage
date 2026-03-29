interface WebVitalsMetric {
  id: string
  name: string
  value: number
  label?: string
}

// gtagの型定義はgtag.tsで統一管理されています

export const reportWebVitals = (metric: WebVitalsMetric) => {
  if (metric.label === 'web-vital') {
    // Google Analyticsへの送信例
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
    
    // コンソールログ（開発環境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`${metric.name}:`, metric.value)
    }
  }
}