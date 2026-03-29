import { useState, useEffect } from 'react'

interface SectionData {
  id: string
  title: string
  subtitle: string
  description: string
  extraText: string
}

export function useSectionData(sectionId: string) {
  const [sectionData, setSectionData] = useState<SectionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await fetch(`/api/sections?lang=ja`)
        const sections: SectionData[] = await response.json()
        const section = sections.find(s => s.id === sectionId)
        setSectionData(section || null)
      } catch (error) {
        console.error(`Failed to load section data for ${sectionId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchSectionData()
  }, [sectionId])

  return { sectionData, loading }
}