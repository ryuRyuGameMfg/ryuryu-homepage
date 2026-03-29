'use client'

import { ReactNode } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

type AnimationType = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'custom'

interface ScrollAnimationProps {
  children: ReactNode
  animation?: AnimationType
  className?: string
  start?: string
  end?: string
  scrub?: boolean | number
  once?: boolean
  duration?: number
  delay?: number
  ease?: string
  y?: number
  x?: number
  scale?: number
  stagger?: number
  childSelector?: string
}

export default function ScrollAnimation({
  children,
  animation = 'fadeUp',
  className = '',
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = true,
  once = false,
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  y = 50,
  x = 50,
  scale = 0.95,
  stagger = 0,
  childSelector,
}: ScrollAnimationProps) {
  const ref = useScrollTrigger<HTMLDivElement>({
    animation,
    start,
    end,
    scrub,
    once,
    duration,
    delay,
    ease,
    y,
    x,
    scale,
    stagger,
    childSelector,
  })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
