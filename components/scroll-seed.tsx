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
  // progress 0-1: hero -> purity center
  // progress 1-2: purity center -> delivered center
  const [progress, setProgress] = useState(0)
  const [heroRect, setHeroRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [headingRect, setHeadingRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [purityRect, setPurityRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
  const [deliveredRect, setDeliveredRect] = useState({ top: 0, left: 0, height: 0, width: 0 })
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

    const headingEl = document.getElementById("hero-heading-wrapper")
    if (headingEl) {
      const hgRect = headingEl.getBoundingClientRect()
      setHeadingRect({
        top: hgRect.top + scrollY,
        left: hgRect.left,
        height: hgRect.height,
        width: hgRect.width,
      })
    }

    const w = window.innerWidth
    setSeedWidth(w >= 1024 ? 360 : w >= 768 ? 280 : 180)

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

        // Phase 1: hero -> purity center (progress 0-1)
        const phase1Start = heroRect.top
        const phase1End = purityRect.top + purityRect.height * 0.5 - window.innerHeight * 0.15

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

  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

  // --- Positions ---
  // Phase 1 start: grain top leans left, bottom tip touches "W" in "WITH CARE"
  // X: shifted more left so top portion leans further left
  const startX = headingRect.left - seedWidth * 0.55 - 5
  // Y: positioned so bottom of grain reaches the second line "WITH"
  // headingRect.height * 0.5 = where second line starts, subtract grain height offset
  const startY = headingRect.top - headingRect.height * 0.15

  // Phase 1 end / Phase 2 start: center of purity section
  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.2

  // Phase 2 end: centered below text in delivered section
  const endX = deliveredRect.left + deliveredRect.width / 2 - seedWidth / 2
  const endY = deliveredRect.top + deliveredRect.height * 0.55 - (seedWidth * 1.3) / 2

  let x: number, y: number, scale: number, rotate: number

  if (progress <= 1) {
    // Phase 1: hero -> purity center
    const p1 = ease(Math.max(0, Math.min(1, progress)))
    x = startX + (purityCenterX - startX) * p1
    y = startY + (purityCenterY - startY) * p1
    scale = 1 + (0.85 - 1) * p1
    rotate = -30 + (30) * p1 // -30 -> 0
  } else {
    // Phase 2: purity center -> delivered center
    const p2 = ease(Math.max(0, Math.min(1, progress - 1)))
    x = purityCenterX + (endX - purityCenterX) * p2
    y = purityCenterY + (endY - purityCenterY) * p2
    scale = 0.85 + (0.8 - 0.85) * p2
    rotate = 0
  }

  // --- Image layer opacities ---
  // Layer 1: Seed (frame-3) - visible at start, fades out as cardamom fades in
  // Visible 0-0.3, fades out 0.3-0.6
  const seedOpacity =
    progress < 0.3 ? 1 : progress < 0.6 ? 1 - (progress - 0.3) / 0.3 : 0

  // Layer 2: Cardamom (frame-40) - the purity section center image
  // Fades in 0.3-0.6, stays visible through purity, fades out 0.9-1.15
  const cardamomOpacity =
    progress < 0.3
      ? 0
      : progress < 0.6
        ? (progress - 0.3) / 0.3
        : progress < 0.9
          ? 1
          : progress < 1.15
            ? 1 - (progress - 0.9) / 0.25
            : 0

  // Layer 3: Rice grain - transition image, fully gone before delivered section
  // Fades in 0.9-1.15, fades out 1.15-1.4
  const riceGrainOpacity =
    progress < 0.9
      ? 0
      : progress < 1.15
        ? (progress - 0.9) / 0.25
        : progress < 1.4
          ? 1 - (progress - 1.15) / 0.25
          : 0

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
          src="/images/grain-03.png"
          alt="Premium rice grain"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          priority
          unoptimized
        />
      </div>

      {/* Layer 2: Cardamom pod */}
      <div
        className="absolute inset-0"
        style={{
          opacity: cardamomOpacity,
          transition: "opacity 0.15s ease-out",
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

      {/* Layer 3: Rice grain */}
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


    </div>
  )
}
