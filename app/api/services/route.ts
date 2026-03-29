import { NextResponse } from 'next/server'
import { loadServices } from '@/utils/csvLoader'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ja'
    const services = loadServices(lang)
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error loading services:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}