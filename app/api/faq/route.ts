import { NextResponse } from 'next/server'
import { loadFAQ } from '@/utils/csvLoader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ja'
    const faq = loadFAQ(lang)
    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error loading FAQ:', error)
    return NextResponse.json({ error: 'Failed to load FAQ' }, { status: 500 })
  }
}