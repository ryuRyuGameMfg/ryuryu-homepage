import { NextResponse } from 'next/server'
import { loadTestimonials } from '@/utils/csvLoader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ja'
    const testimonials = loadTestimonials(lang)
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Failed to load testimonials:', error)
    return NextResponse.json({ error: 'Failed to load testimonials' }, { status: 500 })
  }
}