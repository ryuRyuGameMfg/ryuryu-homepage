export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Google Ads conversion tracking
export const conversion = ({ 
  conversionId, 
  conversionLabel,
  value,
  currency = 'JPY'
}: {
  conversionId: string
  conversionLabel?: string
  value?: number
  currency?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const sendTo = conversionLabel 
      ? `${conversionId}/${conversionLabel}`
      : conversionId
    
    window.gtag('event', 'conversion', {
      send_to: sendTo,
      value: value,
      currency: currency,
    })
  }
}

declare global {
  interface Window {
    gtag: (
      command: string,
      ...args: unknown[]
    ) => void
  }
}