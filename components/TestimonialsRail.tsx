'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface TestimonialData {
  id: string
  text: string
  author: string
  platform: string
  rating: number
}

interface TestimonialsRailProps {
  testimonials: TestimonialData[]
}

export default function TestimonialsRail({ testimonials }: TestimonialsRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current || testimonials.length === 0) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 200

    const scene = new THREE.Scene()

    const aspect = width / height
    const frustumSize = height
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    )
    camera.position.z = 100

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const cardWidth = 450
    const cardHeight = 160
    const gap = 28
    const totalWidth = (cardWidth + gap) * testimonials.length
    const cornerRadius = 20

    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight)

    // Create card texture with rounded corners (Glass Design)
    const createCardTexture = (testimonial: TestimonialData): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const scale = 2
      canvas.width = cardWidth * scale
      canvas.height = cardHeight * scale
      ctx.scale(scale, scale)

      // Glass Background with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight)
      bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
      bgGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)')
      bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.06)')

      // Draw glass card background
      ctx.beginPath()
      ctx.roundRect(0, 0, cardWidth, cardHeight, cornerRadius)
      ctx.fillStyle = 'rgba(17, 24, 39, 0.7)'
      ctx.fill()

      // Glass overlay
      ctx.beginPath()
      ctx.roundRect(0, 0, cardWidth, cardHeight, cornerRadius)
      ctx.fillStyle = bgGradient
      ctx.fill()

      // Glass border
      ctx.beginPath()
      ctx.roundRect(1, 1, cardWidth - 2, cardHeight - 2, cornerRadius - 1)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Top highlight (glass reflection)
      const topGradient = ctx.createLinearGradient(0, 0, 0, 40)
      topGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
      topGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.beginPath()
      ctx.roundRect(1, 1, cardWidth - 2, 40, [cornerRadius - 1, cornerRadius - 1, 0, 0])
      ctx.fillStyle = topGradient
      ctx.fill()

      // Stars (standard 5-point rating star)
      const drawStar = (cx: number, cy: number, size: number) => {
        const outerRadius = size
        const innerRadius = size * 0.4
        const spikes = 5
        let rot = -Math.PI / 2

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const x = cx + Math.cos(rot) * radius
          const y = cy + Math.sin(rot) * radius
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          rot += Math.PI / spikes
        }
        ctx.closePath()
        ctx.fill()
      }

      ctx.fillStyle = '#facc15'
      for (let i = 0; i < testimonial.rating; i++) {
        drawStar(26 + i * 22, 22, 9)
      }

      // Platform badge (cyan gradient)
      ctx.font = 'bold 12px Arial'
      const platformWidth = ctx.measureText(testimonial.platform).width + 20
      const gradient = ctx.createLinearGradient(cardWidth - platformWidth - 16, 12, cardWidth - 16, 36)
      gradient.addColorStop(0, '#06b6d4') // cyan-500
      gradient.addColorStop(1, '#0891b2') // cyan-600
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(cardWidth - platformWidth - 16, 12, platformWidth, 24, 12)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillText(testimonial.platform, cardWidth - platformWidth - 6, 28)

      // Text
      ctx.fillStyle = '#e5e7eb'
      ctx.font = '15px Arial'
      const text = `"${testimonial.text}"`
      const maxWidth = cardWidth - 40
      const words = text.split('')
      let line = ''
      let y = 68
      const lineHeight = 26
      const maxY = cardHeight - 44

      for (const char of words) {
        const testLine = line + char
        if (ctx.measureText(testLine).width > maxWidth) {
          ctx.fillText(line, 20, y)
          line = char
          y += lineHeight
          if (y > maxY) {
            ctx.fillText(line + '...', 20, y)
            break
          }
        } else {
          line = testLine
        }
      }
      if (y <= maxY && line) ctx.fillText(line, 20, y)

      // Author
      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Arial'
      ctx.fillText(`- ${testimonial.author}`, 20, cardHeight - 18)

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    }

    // Create 3 sets for seamless loop
    for (let set = 0; set < 3; set++) {
      testimonials.forEach((testimonial, index) => {
        const xPos = (set * totalWidth) + (index * (cardWidth + gap)) - totalWidth

        const texture = createCardTexture(testimonial)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        })

        const mesh = new THREE.Mesh(geometry.clone(), material)
        mesh.position.x = xPos
        mesh.position.z = 0

        group.add(mesh)
      })
    }

    setIsReady(true)

    const speed = 0.4
    const fadeZone = width * 0.1

    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      group.position.x += speed

      if (group.position.x >= totalWidth) {
        group.position.x = 0
      }

      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          const worldX = child.position.x + group.position.x
          const screenLeft = -width / 2
          const screenRight = width / 2

          let opacity = 1

          if (worldX < screenLeft + fadeZone) {
            opacity = Math.max(0, (worldX - screenLeft) / fadeZone)
          } else if (worldX > screenRight - fadeZone) {
            opacity = Math.max(0, (screenRight - worldX) / fadeZone)
          }

          child.material.opacity = opacity
        }
      })

      renderer.render(scene, camera)
      sceneRef.current = { renderer, animationId }
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth
      const newAspect = newWidth / height
      camera.left = -frustumSize * newAspect / 2
      camera.right = frustumSize * newAspect / 2
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.renderer.dispose()
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [testimonials])

  if (testimonials.length === 0) {
    return <div className="h-[200px]" />
  }

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div
        ref={containerRef}
        className="w-full h-[200px]"
        style={{ opacity: isReady ? 1 : 0.5, transition: 'opacity 0.5s' }}
      />
    </div>
  )
}
