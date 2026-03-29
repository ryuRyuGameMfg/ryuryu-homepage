import { NextResponse } from 'next/server'
import { loadSections } from '@/utils/csvLoader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ja'
    const sections = loadSections(lang)
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Failed to load sections:', error)
    return NextResponse.json({ error: 'Failed to load sections' }, { status: 500 })
  }
}