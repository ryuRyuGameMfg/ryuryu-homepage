import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'

const AboutSection = dynamic(() => import('@/components/AboutSection'))
const ServicesSection = dynamic(() => import('@/components/ServicesSection'))
const VideoPortfolioSection = dynamic(() => import('@/components/VideoPortfolioSection'), {
  loading: () => <div className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"><div className="container mx-auto px-4 text-center"><div className="animate-pulse h-8 w-48 bg-gray-700 rounded mx-auto"></div></div></div>
})
const NewsSection = dynamic(() => import('@/components/NewsSection'))
const FAQSection = dynamic(() => import('@/components/FAQSection'))
const ContactSection = dynamic(() => import('@/components/ContactSection'))
const Footer = dynamic(() => import('@/components/Footer'))
const FixedCTA = dynamic(() => import('@/components/FixedCTA'))

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <Navigation />
      <main className="overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <VideoPortfolioSection />
        <NewsSection />
        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
      <FixedCTA />
    </div>
  )
}