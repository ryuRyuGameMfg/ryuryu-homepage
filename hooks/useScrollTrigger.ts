'use client'

import { useEffect, useRef, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollTriggerOptions {
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
  once?: boolean
  animation?: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'custom'
  duration?: number
  delay?: number
  ease?: string
  y?: number
  x?: number
  scale?: number
  opacity?: number
  stagger?: number
  childSelector?: string
}

const defaultOptions: ScrollTriggerOptions = {
  start: 'top 80%',
  end: 'bottom 20%',
  scrub: true,
  markers: false,
  once: false,
  animation: 'fadeUp',
  duration: 1,
  delay: 0,
  ease: 'power2.out',
  y: 50,
  x: 50,
  scale: 0.95,
  opacity: 0,
}

export function useScrollTrigger<T extends HTMLElement>(
  options: ScrollTriggerOptions = {}
): RefObject<T | null> {
  const elementRef = useRef<T>(null)
  const mergedOptions = { ...defaultOptions, ...options }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const {
      start,
      end,
      scrub,
      markers,
      once,
      animation,
      duration,
      delay,
      ease,
      y,
      x,
      scale,
      opacity,
      stagger,
      childSelector,
    } = mergedOptions

    const targets = childSelector ? element.querySelectorAll(childSelector) : element

    let fromVars: gsap.TweenVars = { opacity }
    let toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      delay,
      ease,
      stagger: stagger || 0,
    }

    switch (animation) {
      case 'fadeUp':
        fromVars = { ...fromVars, y }
        toVars = { ...toVars, y: 0 }
        break
      case 'fadeIn':
        break
      case 'fadeLeft':
        fromVars = { ...fromVars, x }
        toVars = { ...toVars, x: 0 }
        break
      case 'fadeRight':
        fromVars = { ...fromVars, x: -(x || 50) }
        toVars = { ...toVars, x: 0 }
        break
      case 'scale':
        fromVars = { ...fromVars, scale }
        toVars = { ...toVars, scale: 1 }
        break
      case 'custom':
        break
    }

    gsap.set(targets, fromVars)

    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: element,
      start,
      end,
      scrub: scrub === true ? 1 : scrub,
      markers,
      toggleActions: once ? 'play none none none' : 'play reverse play reverse',
    }

    if (once) {
      scrollTriggerConfig.once = true
    }

    const tween = gsap.to(targets, {
      ...toVars,
      scrollTrigger: scrollTriggerConfig,
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [])

  return elementRef
}

export function useScrollTriggerBatch(
  selector: string,
  options: ScrollTriggerOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options }

  useEffect(() => {
    const {
      start,
      scrub,
      animation,
      duration,
      ease,
      y,
      stagger,
    } = mergedOptions

    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    let fromVars: gsap.TweenVars = { opacity: 0 }
    let toVars: gsap.TweenVars = { opacity: 1 }

    switch (animation) {
      case 'fadeUp':
        fromVars = { ...fromVars, y }
        toVars = { ...toVars, y: 0 }
        break
      case 'fadeIn':
        break
      default:
        fromVars = { ...fromVars, y }
        toVars = { ...toVars, y: 0 }
    }

    gsap.set(elements, fromVars)

    const batchTriggers = ScrollTrigger.batch(elements, {
      start,
      onEnter: (batch) => {
        gsap.to(batch, {
          ...toVars,
          duration,
          ease,
          stagger: stagger || 0.1,
        })
      },
      onLeaveBack: scrub ? (batch) => {
        gsap.to(batch, {
          ...fromVars,
          duration: duration ? duration / 2 : 0.5,
          ease,
        })
      } : undefined,
    })

    return () => {
      batchTriggers.forEach(trigger => trigger.kill())
    }
  }, [selector])
}
