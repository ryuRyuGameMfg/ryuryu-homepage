'use client'

import { useEffect, useRef, useState } from 'react'

interface GlitchTitleProps {
  children: string
  className?: string
}

export default function GlitchTitle({ children, className = '' }: GlitchTitleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.3, // 要素が30%見えたら発動
        rootMargin: '0px 0px -50px 0px' // 少し早めに発動
      }
    )

    const currentElement = titleRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [isVisible])

  return (
    <h2 
      ref={titleRef}
      className={`${className} ${isVisible ? 'glitch-text glitch-active' : 'glitch-text-hidden'}`}
      data-text={children}
    >
      {children}
    </h2>
  )
}