"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"

interface ScrollSeedProps {
  heroRef: React.RefObject<HTMLElement | null>
  purityRef: React.RefObject<HTMLElement | null>
  deliveredRef: React.RefObject<HTMLElement | null>
}

export function ScrollSeed({ heroRef, purityRef, deliveredRef }: ScrollSeedProps) {
  const seedRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [heroRect, setHeroRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [purityRect, setPurityRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [deliveredRect, setDeliveredRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [isReady, setIsReady] = useState(false)
  const [seedWidth, setSeedWidth] = useState(340)
  const rafRef = useRef<number>(0)

  const measure = useCallback(() => {
    if (!heroRef.current || !purityRef.current) return
    const hRect = heroRef.current.getBoundingClientRect()
    const pRect = purityRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    setHeroRect({
      top: hRect.top + scrollY,
      left: hRect.left,
      height: hRect.height,
      width: hRect.width,
    })
    setPurityRect({
      top: pRect.top + scrollY,
      left: pRect.left,
      height: pRect.height,
      width: pRect.width,
    })

    if (deliveredRef.current) {
      const dRect = deliveredRef.current.getBoundingClientRect()
      setDeliveredRect({
        top: dRect.top + scrollY,
        left: dRect.left,
        height: dRect.height,
        width: dRect.width,
      })
    }

    const w = window.innerWidth
    setSeedWidth(w >= 1024 ? 340 : w >= 768 ? 280 : 180)

    setIsReady(true)
  }, [heroRef, purityRef, deliveredRef])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  useEffect(() => {
    const timer = setTimeout(measure, 500)
    return () => clearTimeout(timer)
  }, [measure])

  useEffect(() => {
    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!heroRef.current || !purityRef.current) return
        const scrollY = window.scrollY
        const viewH = window.innerHeight

        // Phase 1: hero to purity center (0 -> 0.6)
        // Phase 2: purity center to delivered section top (0.6 -> 1.0) - seed fades out
        const animStart = heroRect.top
        const purityMid = purityRect.top + purityRect.height * 0.5 - viewH * 0.15
        const animEnd = deliveredRect.top > 0
          ? deliveredRect.top - viewH * 0.3
          : purityMid + viewH * 0.5

        if (animEnd <= animStart) {
          setProgress(0)
          return
        }

        const raw = (scrollY - animStart) / (animEnd - animStart)
        setProgress(Math.max(0, Math.min(1, raw)))
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [heroRef, purityRef, heroRect, purityRect, deliveredRect])

  if (!isReady) return null

  // Phase 1 progress (0 to 0.6 -> normalized 0-1)
  const phase1 = Math.max(0, Math.min(1, progress / 0.6))
  // Phase 2 progress (0.6 to 1.0 -> normalized 0-1)
  const phase2 = Math.max(0, Math.min(1, (progress - 0.6) / 0.4))

  const startX = heroRect.left + heroRect.width * 0.04
  const startY = heroRect.top + 20
  const startScale = 1
  const startRotate = -25

  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.2
  const midScale = 0.85
  const midRotate = -5

  // End position: center of viewport where delivered section is
  const endX = (deliveredRect.left || purityRect.left) + (deliveredRect.width || purityRect.width) * 0.45
  const endY = deliveredRect.top > 0
    ? deliveredRect.top + window.innerHeight * 0.4
    : purityCenterY + purityRect.height * 0.6
  const endScale = 0.6
  const endRotate = 0

  const eased1 = phase1 < 0.5
    ? 2 * phase1 * phase1
    : 1 - Math.pow(-2 * phase1 + 2, 2) / 2

  const eased2 = phase2 < 0.5
    ? 2 * phase2 * phase2
    : 1 - Math.pow(-2 * phase2 + 2, 2) / 2

  let x: number, y: number, scale: number, rotate: number

  if (progress <= 0.6) {
    x = startX + (purityCenterX - startX) * eased1
    y = startY + (purityCenterY - startY) * eased1
    scale = startScale + (midScale - startScale) * eased1
    rotate = startRotate + (midRotate - startRotate) * eased1
  } else {
    x = purityCenterX + (endX - purityCenterX) * eased2
    y = purityCenterY + (endY - purityCenterY) * eased2
    scale = midScale + (endScale - midScale) * eased2
    rotate = midRotate + (endRotate - midRotate) * eased2
  }

  // Fade out seed once we approach the delivered section
  const fadeOut = progress > 0.8 ? Math.max(0, 1 - (progress - 0.8) / 0.2) : 1

  return (
    <div
      ref={seedRef}
      className="pointer-events-none absolute left-0 top-0 z-30"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        willChange: "transform",
        width: seedWidth,
        opacity: fadeOut,
      }}
    >
      {/* Seed image - visible in phase 1, fades to cardamom */}
      <div
        style={{
          opacity: progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) / 0.25),
          transition: "opacity 0.3s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-3-removebg-preview%201-iJ06KjM6d4IPII6wZrIytjtvwbh55k.png"
          alt="Premium grain seed"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          priority
          unoptimized
        />
      </div>

      {/* Cardamom image - crossfades in */}
      <div
        className="absolute inset-0"
        style={{
          opacity: progress < 0.35 ? 0 : Math.min(1, (progress - 0.35) / 0.3),
          transition: "opacity 0.3s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_113737-removebg-preview-dd53TvlwxlkJrfXzvFt4EJWwQSqwI6.png"
          alt="Cardamom pod"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>
    </div>
  )
}
