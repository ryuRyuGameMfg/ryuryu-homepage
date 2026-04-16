'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    animationId: number
  } | null>(null)

  const portfolioImages = [
    { id: 1, src: '/images/screenshot1-opt.webp', fallback: '/images/screenshot1-opt.webp' },
    { id: 2, src: '/images/screenshot2-opt.webp', fallback: '/images/screenshot2-opt.webp' },
    { id: 3, src: '/images/screenshot3-opt.webp', fallback: '/images/screenshot3-opt.webp' },
    { id: 4, src: '/images/screenshot4-opt.webp', fallback: '/images/screenshot4-opt.webp' },
    { id: 5, src: '/images/screenshot5-opt.webp', fallback: '/images/screenshot5-opt.webp' },
    { id: 6, src: '/images/screenshot6-opt.webp', fallback: '/images/screenshot6-opt.webp' },
    { id: 7, src: '/images/screenshot7-opt.webp', fallback: '/images/screenshot7-opt.webp' },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 160

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

    const imageWidth = 220
    const imageHeight = 124
    const gap = 20
    const totalWidth = (imageWidth + gap) * portfolioImages.length
    const cornerRadius = 16

    // Create rounded image texture using canvas
    const createRoundedTexture = (img: HTMLImageElement): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = imageWidth * 2
      canvas.height = imageHeight * 2
      ctx.scale(2, 2)

      // Draw rounded clip path
      ctx.beginPath()
      ctx.roundRect(0, 0, imageWidth, imageHeight, cornerRadius)
      ctx.clip()

      // Draw image
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight)

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    }

    const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight)
    let loadedCount = 0
    const totalToLoad = portfolioImages.length * 3

    // Create 3 sets for seamless loop
    for (let set = 0; set < 3; set++) {
      portfolioImages.forEach((image, index) => {
        const xPos = (set * totalWidth) + (index * (imageWidth + gap)) - totalWidth

        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          const texture = createRoundedTexture(img)
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          })

          const mesh = new THREE.Mesh(geometry.clone(), material)
          mesh.position.x = xPos
          mesh.position.z = 0
          group.add(mesh)

          loadedCount++
          if (loadedCount >= totalToLoad) {
            setIsLoaded(true)
          }
        }

        img.onerror = () => {
          // Fallback
          const fallbackImg = new Image()
          fallbackImg.crossOrigin = 'anonymous'
          fallbackImg.onload = () => {
            const texture = createRoundedTexture(fallbackImg)
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
            const mesh = new THREE.Mesh(geometry.clone(), material)
            mesh.position.x = xPos
            mesh.position.z = 0
            group.add(mesh)
            loadedCount++
            if (loadedCount >= totalToLoad) setIsLoaded(true)
          }
          fallbackImg.src = image.fallback
        }

        img.src = image.src
      })
    }

    const speed = 0.5
    const fadeZone = width * 0.12

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
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-[160px]"
        style={{ opacity: isLoaded ? 1 : 0.5, transition: 'opacity 0.5s' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      )}
    </div>
  )
}
