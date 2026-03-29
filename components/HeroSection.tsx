'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import PortfolioShowcase from './PortfolioShowcase'
import TestimonialsRail from './TestimonialsRail'

interface TestimonialData {
  id: string
  text: string
  author: string
  platform: string
  rating: number
}

export default function HeroSection() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?lang=ja')
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error('Failed to load testimonials:', error)
        setTestimonials([
          {
            id: '1',
            text: '迅速で丁寧な対応をしていただきました。また機会があればお願いしたいです。',
            author: '個人クライアント様',
            platform: 'ココナラ',
            rating: 5
          }
        ])
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <section id="hero" className="relative pt-20 pb-0">
      {/* SEO */}
      <h1 className="sr-only">ゲーム開発所RYURYU - VRプロトタイプ開発・ゲーム制作・AR開発のプロフェッショナルスタジオ</h1>

      {/* Portfolio Showcase - Three.js */}
      <PortfolioShowcase />

      {/* Banner */}
      <div className="relative w-full">
        <Image
          src="/top-banner-opt.webp"
          alt="ゲーム開発所RYURYU - VRプロトタイプ開発・ゲーム制作・AR開発のプロフェッショナルスタジオ"
          width={1920}
          height={618}
          className="w-full h-auto object-contain"
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, (max-width: 1536px) 1536px, 1920px"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAfADwDASIAAhEBAxEB/8QAGwAAAgIDAQAAAAAAAAAAAAAAAAcEBgIDBQj/xAAuEAACAQQABAQEBwAAAAAAAAABAgMABBEhBRIxQQYTIlEyYYGRFBUjcXKhwf/EABYBAQEBAAAAAAAAAAAAAAAAAAACAf/EABcRAQEBAQAAAAAAAAAAAAAAAAABEQL/2gAMAwEAAhEDEQA/AO/4g8VcVbjEqWVxLbWyKqqUPKXONkn70l7242xaZywfLSSNvGyd9aZXGkt4rx7y/USD9FeLh8sX571PxOzGM/aq7d2MYtyPNikZ1wGjXof61RZLmnyUtb24XzHPIzwyKCxOhgDvipP5eWA/UtN7/PfnP3ooorP/2Q=="
        />
      </div>

      {/* Testimonials Rail - Three.js */}
      <TestimonialsRail testimonials={testimonials} />
    </section>
  )
}
