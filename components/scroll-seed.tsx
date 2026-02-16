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
  // progress 0-1 covers hero -> purity center
  // progress 1-2 covers purity center -> delivered center
  const [progress, setProgress] = useState(0)
  const [heroRect, setHeroRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [purityRect, setPurityRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [deliveredRect, setDeliveredRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [placeholderCenter, setPlaceholderCenter] = useState({ x: 0, y: 0 })
  const [isReady, setIsReady] = useState(false)
  const [seedWidth, setSeedWidth] = useState(340)
  const rafRef = useRef<number>(0)

  const measure = useCallback(() => {
    if (!heroRef.current || !purityRef.current || !deliveredRef.current) return
    const hRect = heroRef.current.getBoundingClientRect()
    const pRect = purityRef.current.getBoundingClientRect()
    const dRect = deliveredRef.current.getBoundingClientRect()
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
    setDeliveredRect({
      top: dRect.top + scrollY,
      left: dRect.left,
      height: dRect.height,
      width: dRect.width,
    })

    // Estimate center of purity section for the floating image
    setPlaceholderCenter({
      x: pRect.left + pRect.width / 2,
      y: pRect.top + scrollY + pRect.height * 0.4,
    })

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
        if (!heroRef.current || !purityRef.current || !deliveredRef.current) return
        const scrollY = window.scrollY
        const viewH = window.innerHeight

        // Phase 1: hero -> purity center (progress 0-1)
        const phase1Start = heroRect.top
        const phase1End = purityRect.top + purityRect.height * 0.35

        // Phase 2: purity center -> delivered center (progress 1-2)
        const phase2Start = phase1End
        const phase2End = deliveredRect.top + deliveredRect.height * 0.4

        if (phase1End <= phase1Start || phase2End <= phase2Start) {
          setProgress(0)
          return
        }

        let raw: number
        if (scrollY <= phase1Start) {
          raw = 0
        } else if (scrollY <= phase1End) {
          raw = (scrollY - phase1Start) / (phase1End - phase1Start)
        } else if (scrollY <= phase2End) {
          raw = 1 + (scrollY - phase2Start) / (phase2End - phase2Start)
        } else {
          raw = 2
        }

        setProgress(Math.max(0, Math.min(2, raw)))
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [heroRef, purityRef, deliveredRef, heroRect, purityRect, deliveredRect])

  if (!isReady) return null

  // Easing function
  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

  // --- Phase 1: hero start -> purity center ---
  const startX = heroRect.left + heroRect.width * 0.04
  const startY = heroRect.top + 20

  const midX = placeholderCenter.x - seedWidth / 2
  const midY = placeholderCenter.y - (seedWidth * 1.3) / 2

  // --- Phase 2: purity center -> delivered center ---
  const endX = deliveredRect.left + deliveredRect.width / 2 - seedWidth / 2
  const endY = deliveredRect.top + deliveredRect.height * 0.35 - (seedWidth * 1.3) / 2

  let x: number, y: number, scale: number, rotate: number

  if (progress <= 1) {
    // Phase 1: hero -> purity center
    const p1 = ease(Math.max(0, Math.min(1, progress)))
    x = startX + (midX - startX) * p1
    y = startY + (midY - startY) * p1
    scale = 1 + (0.85 - 1) * p1
    rotate = -25 + (0 - -25) * p1
  } else {
    // Phase 2: purity center -> delivered center
    const p2 = ease(Math.max(0, Math.min(1, progress - 1)))
    x = midX + (endX - midX) * p2
    y = midY + (endY - midY) * p2
    scale = 0.85 + (0.75 - 0.85) * p2
    rotate = 0
  }

  // Image opacities:
  // Seed: visible 0-0.5, fades out 0.5-0.8
  const seedOpacity =
    progress < 0.5 ? 1 : progress < 0.8 ? 1 - (progress - 0.5) / 0.3 : 0

  // Rice grain: fades in 0.5-0.8, visible 0.8-1.5, fades out 1.5-1.8
  const riceGrainOpacity =
    progress < 0.5
      ? 0
      : progress < 0.8
        ? (progress - 0.5) / 0.3
        : progress < 1.5
          ? 1
          : progress < 1.8
            ? 1 - (progress - 1.5) / 0.3
            : 0

  // Rice packet: fades in 1.5-1.8, stays visible after
  const ricePacketOpacity =
    progress < 1.5 ? 0 : progress < 1.8 ? (progress - 1.5) / 0.3 : 1

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
      {/* Layer 1: Seed image */}
      <div
        style={{
          opacity: seedOpacity,
          transition: "opacity 0.15s ease-out",
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

      {/* Layer 2: Rice grain image */}
      <div
        className="absolute inset-0"
        style={{
          opacity: riceGrainOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_113737-removebg-preview-evWEoit5u4I2ZAzEJBZoUEgf1wUenq.png"
          alt="Rice grain"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Layer 3: Red rice packet */}
      <div
        className="absolute inset-0"
        style={{
          opacity: ricePacketOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_114000-removebg-preview-removebg-preview-IWp3MwPf80dh0ZAVHMAXOie0A79JqQ.png"
          alt="Keerthi Nirmal Long Grain Matta rice bag"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>
    </div>
  )
}
