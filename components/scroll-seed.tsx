"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"

interface ScrollSeedProps {
  heroRef: React.RefObject<HTMLElement | null>
  purityRef: React.RefObject<HTMLElement | null>
}

export function ScrollSeed({ heroRef, purityRef }: ScrollSeedProps) {
  const seedRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [heroRect, setHeroRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [purityRect, setPurityRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
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

    const w = window.innerWidth
    setSeedWidth(w >= 1280 ? 360 : w >= 1024 ? 300 : w >= 768 ? 240 : 160)

    setIsReady(true)
  }, [heroRef, purityRef])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // Re-measure after fonts / images load
  useEffect(() => {
    const timer = setTimeout(measure, 600)
    return () => clearTimeout(timer)
  }, [measure])

  useEffect(() => {
    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!heroRef.current || !purityRef.current) return
        const scrollY = window.scrollY
        const viewH = window.innerHeight

        const animStart = heroRect.top
        const animEnd = purityRect.top + purityRect.height * 0.5 - viewH * 0.15

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
  }, [heroRef, purityRef, heroRect, purityRect])

  if (!isReady) return null

  // Start position: left side of hero
  const startX = heroRect.left + heroRect.width * 0.05
  const startY = heroRect.top + 10
  const startScale = 1
  const startRotate = -25

  // End position: center of purity section (the placeholder space)
  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.18
  const endScale = 0.8
  const endRotate = -5

  // Smooth easing
  const eased =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

  const x = startX + (purityCenterX - startX) * eased
  const y = startY + (purityCenterY - startY) * eased
  const scale = startScale + (endScale - startScale) * eased
  const rotate = startRotate + (endRotate - startRotate) * eased

  return (
    <div
      ref={seedRef}
      className="pointer-events-none absolute left-0 top-0 z-30"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        willChange: "transform",
        width: seedWidth,
      }}
    >
      {/* Seed / grain image */}
      <div
        style={{
          opacity: progress < 0.35 ? 1 : Math.max(0, 1 - (progress - 0.35) / 0.35),
          transition: "opacity 0.2s ease-out",
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

      {/* Cardamom image crossfade */}
      <div
        className="absolute inset-0"
        style={{
          opacity: progress < 0.3 ? 0 : Math.min(1, (progress - 0.3) / 0.35),
          transition: "opacity 0.2s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-40-removebg-preview%201-4we2BvDPWE5vYKekYkG0M1YrAMuwGH.png"
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
