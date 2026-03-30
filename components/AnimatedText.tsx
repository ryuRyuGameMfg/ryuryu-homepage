'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'typewriter' | 'glitch'
  /** Typing speed per character (seconds) - only for typewriter */
  typingSpeed?: number
  /** Show cursor for typewriter animation */
  showCursor?: boolean
}

export default function AnimatedText({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  animation = 'fadeInUp',
  typingSpeed = 0.05,
  showCursor = true
}: AnimatedTextProps) {
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: 'easeOut' as const }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: 'easeOut' as const }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay }
    },
    slideInLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: 'easeOut' as const }
    },
    slideInRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: 'easeOut' as const }
    },
    typewriter: {
      initial: { width: 0 },
      animate: { width: '100%' },
      transition: { duration: duration * 2, delay, ease: 'linear' as const }
    },
    glitch: {
      initial: { opacity: 0, scale: 0.8 },
      animate: {
        opacity: 1,
        scale: [0.8, 1.1, 0.95, 1],
        filter: [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(-90deg)',
          'hue-rotate(0deg)'
        ]
      },
      transition: { duration, delay, ease: 'easeInOut' as const }
    }
  }

  const selectedAnimation = animations[animation]

  // Typewriter animation - character by character
  if (animation === 'typewriter') {
    const text = typeof children === 'string' ? children : String(children)
    const characters = text.split('')
    const totalDuration = characters.length * typingSpeed

    return (
      <motion.div
        className={`inline-flex ${className}`}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.05, margin: "0px" }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.01,
              delay: delay + index * typingSpeed,
              ease: 'easeOut'
            }}
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
        {showCursor && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              delay: delay + totalDuration,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="ml-[1px]"
          >
            |
          </motion.span>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={selectedAnimation.transition}
      whileInView={selectedAnimation.animate}
      viewport={{ once: true, amount: 0.05, margin: "0px" }}
    >
      {children}
    </motion.div>
  )
}
