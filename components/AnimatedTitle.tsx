'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface AnimatedTitleProps {
  children: ReactNode
  className?: string
  animation?: 'glitch' | 'typewriter' | 'gradientWave' | 'flip3d' | 'neonPulse' | 'slideScale' | 'matrix'
  /** Typing speed per character (seconds) - only for typewriter */
  typingSpeed?: number
  /** Show cursor for typewriter animation */
  showCursor?: boolean
  /** Initial delay before animation starts */
  delay?: number
}

export default function AnimatedTitle({
  children,
  className = '',
  animation = 'glitch',
  typingSpeed = 0.08,
  showCursor = true,
  delay = 0
}: AnimatedTitleProps) {
  const [isHovered, setIsHovered] = useState(false)

  const animations = {
    // Glitch effect (cyber style)
    glitch: {
      initial: {
        opacity: 0,
        x: -2,
        scale: 0.98
      },
      animate: {
        opacity: 1,
        x: isHovered ? [-2, 2, -1, 3, 0] : 0,
        scale: isHovered ? [0.98, 1.02, 0.99, 1.01, 1] : 1,
        textShadow: [
          '0 0 0 transparent',
          '2px 2px 0 rgba(255,0,255,0.8), -2px -2px 0 rgba(0,255,255,0.8)',
          '-2px 2px 0 rgba(255,0,255,0.6), 2px -2px 0 rgba(0,255,255,0.6)',
          '0 0 10px rgba(255,255,255,0.5)',
          '3px 3px 0 rgba(255,0,255,0.4), -3px -3px 0 rgba(0,255,255,0.4)',
          '0 0 0 transparent'
        ]
      },
      transition: {
        duration: 0.3,
        x: {
          duration: 0.2,
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror' as const
        },
        scale: {
          duration: 0.2,
          repeat: isHovered ? Infinity : 0,
          repeatType: 'mirror' as const
        },
        textShadow: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop' as const,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
      }
    },

    // Typewriter effect (placeholder - actual implementation below)
    typewriter: {
      initial: { width: 0, opacity: 1 },
      animate: { width: '100%' },
      transition: {
        duration: 1,
        ease: 'linear' as const
      }
    },

    // Gradient wave
    gradientWave: {
      initial: {
        backgroundImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 50%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      },
      animate: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      },
      transition: {
        duration: 5,
        ease: 'linear' as const,
        repeat: Infinity
      }
    },

    // 3D flip
    flip3d: {
      initial: {
        rotateY: -90,
        opacity: 0,
        scale: 0.8
      },
      animate: {
        rotateY: 0,
        opacity: 1,
        scale: 1
      },
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
        type: 'spring' as const,
        stiffness: 150
      }
    },

    // Neon pulse
    neonPulse: {
      initial: {
        opacity: 0.8,
        filter: 'brightness(0.8)'
      },
      animate: {
        opacity: [0.8, 1, 0.8],
        filter: ['brightness(0.8)', 'brightness(1.2) drop-shadow(0 0 20px #00ffff)', 'brightness(0.8)'],
        textShadow: [
          '0 0 5px #00ffff',
          '0 0 20px #00ffff, 0 0 40px #00ffff',
          '0 0 5px #00ffff'
        ]
      },
      transition: {
        duration: 1.5,
        ease: 'easeInOut' as const,
        repeat: Infinity
      }
    },

    // Slide & scale
    slideScale: {
      initial: {
        x: -100,
        scale: 0.5,
        opacity: 0
      },
      animate: {
        x: 0,
        scale: 1,
        opacity: 1
      },
      transition: {
        duration: 0.3,
        ease: [0.6, 0.01, -0.05, 0.95] as const
      }
    },

    // Matrix style
    matrix: {
      initial: {
        opacity: 0,
        filter: 'blur(10px)'
      },
      animate: {
        opacity: 1,
        filter: 'blur(0px)',
        color: ['#00ff00', '#ffffff', '#00ff00']
      },
      transition: {
        duration: 1,
        color: {
          duration: 0.3,
          repeat: 3,
          repeatType: 'reverse' as const
        }
      }
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.05,
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
            className="ml-[2px] font-light"
          >
            |
          </motion.span>
        )}
      </motion.div>
    )
  }

  if (animation === 'gradientWave') {
    return (
      <motion.div
        className={className}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        transition={selectedAnimation.transition}
        style={{
          backgroundImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {children}
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: animation === 'flip3d' ? 1000 : undefined }}
    >
      {children}
    </motion.div>
  )
}
