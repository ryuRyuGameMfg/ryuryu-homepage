import { NextResponse } from 'next/server'
import { loadNews } from '@/utils/csvLoader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ja'
    const news = loadNews(lang)
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error loading news:', error)
    return NextResponse.json({ error: 'Failed to load news' }, { status: 500 })
  }
}