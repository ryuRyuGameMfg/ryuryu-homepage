import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface ServiceData {
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
}


export interface TestimonialData {
  id: string
  text: string
  author: string
  platform: string
  rating: number
}

export interface SectionData {
  id: string
  title: string
  subtitle: string
  description: string
  extraText: string
}

export interface NewsData {
  id: string
  date: string
  category: string
  title: string
  description: string
  link?: string
  isNew?: boolean
}

export interface FAQData {
  id: string
  category: string
  question: string
  answer: string
}

function loadCSV<T>(filename: string, lang: string = 'ja'): T[] {
  const filePath = path.join(process.cwd(), 'data', 'csv', lang, filename)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
  
  return records.map((record: any) => {
    const processedRecord: any = {}
    
    for (const [key, value] of Object.entries(record)) {
      if (key === 'features' || key === 'process') {
        processedRecord[key] = value ? (value as string).split('|') : []
      } else if (key === 'rating') {
        processedRecord[key] = parseInt(value as string, 10)
      } else if (key === 'isNew') {
        processedRecord[key] = value === 'TRUE' || value === 'true'
      } else {
        processedRecord[key] = value
      }
    }
    
    return processedRecord as T
  })
}

export function loadServices(lang: string = 'ja'): ServiceData[] {
  return loadCSV<ServiceData>('services.csv', lang)
}


export function loadTestimonials(lang: string = 'ja'): TestimonialData[] {
  return loadCSV<TestimonialData>('testimonials.csv', lang)
}

export function loadSections(lang: string = 'ja'): SectionData[] {
  return loadCSV<SectionData>('sections.csv', lang)
}

export function loadNews(lang: string = 'ja'): NewsData[] {
  return loadCSV<NewsData>('news.csv', lang)
}

export function loadFAQ(lang: string = 'ja'): FAQData[] {
  return loadCSV<FAQData>('faq.csv', lang)
}