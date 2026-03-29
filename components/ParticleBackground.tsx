'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, ISourceOptions } from '@tsparticles/engine'

export default function ParticleBackground() {
  const [init, setInit] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const scrollSpeedRef = useRef(1)

  // tsParticles初期化（マウント時に一度だけ）
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // パーティクルコンテナ読み込み完了時
  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      containerRef.current = container
    }
  }, [])

  // スクロール連動: スクロール時にパーティクルのリンク距離を変化
  useEffect(() => {
    let lastScrollY = 0
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollDelta = Math.abs(currentScrollY - lastScrollY)

          // スクロール速度に応じてパーティクル設定を変化
          const newSpeed = Math.min(1 + scrollDelta * 0.01, 2)
          scrollSpeedRef.current = newSpeed

          // コンテナのオプションを動的に更新
          if (containerRef.current) {
            const options = containerRef.current.options as {
              particles?: {
                links?: { distance?: number }
                move?: { speed?: number }
              }
            }
            if (options.particles?.links) {
              // スクロール時にリンク距離を広げる
              options.particles.links.distance = 150 + scrollDelta * 0.5
            }
            if (options.particles?.move) {
              // スクロール時に速度を上げる
              options.particles.move.speed = newSpeed
            }
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // パーティクル設定
  const options: ISourceOptions = {
    fullScreen: false,
    fpsLimit: 60,
    detectRetina: true,
    background: {
      color: {
        value: 'transparent',
      },
    },
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
        },
      },
      color: {
        value: ['#6366f1', '#8b5cf6', '#a78bfa', '#06b6d4'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      links: {
        enable: true,
        color: '#8b5cf6',
        distance: 150,
        opacity: 0.2,
        width: 1,
        triangles: {
          enable: false,
        },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'bounce',
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.5,
            color: '#06b6d4',
          },
        },
      },
    },
  }

  return (
    <>
      {/* 背景レイヤー */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
      >
        {/* グラデーション背景 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
        />

        {/* パーティクル（初期化後のみ表示） */}
        {init && (
          <Particles
            id="tsparticles"
            className="absolute inset-0 w-full h-full"
            particlesLoaded={particlesLoaded}
            options={options}
          />
        )}
      </div>

    </>
  )
}
