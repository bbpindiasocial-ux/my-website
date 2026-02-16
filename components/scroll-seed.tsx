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

        const animStart = heroRect.top
        const purityMid = purityRect.top + purityRect.height * 0.5 - viewH * 0.15
        const deliveredEnd = deliveredRect.top > 0
          ? deliveredRect.top + deliveredRect.height * 0.55
          : purityMid + viewH

        const totalRange = deliveredEnd - animStart
        if (totalRange <= 0) {
          setProgress(0)
          return
        }

        const raw = (scrollY - animStart) / totalRange
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

  /* ---- Position keypoints ---- */

  // Phase 1: Hero start position
  const startX = heroRect.left + heroRect.width * 0.04
  const startY = heroRect.top + 20
  const startScale = 1
  const startRotate = -25

  // Phase 1 endpoint: Purity center
  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.2
  const midScale = 0.85
  const midRotate = -5

  // Phase 2 endpoint: Delivered section center (where red bag will be)
  const deliveredCenterX = deliveredRect.width > 0
    ? deliveredRect.left + deliveredRect.width * 0.5
    : purityCenterX
  const deliveredCenterY = deliveredRect.height > 0
    ? deliveredRect.top + deliveredRect.height * 0.55
    : purityCenterY + 600
  const endScale = 0.7
  const endRotate = 0

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  let x: number, y: number, scale: number, rotate: number

  if (progress <= 0.5) {
    // Phase 1: Hero -> Purity
    const t = easeInOutQuad(progress / 0.5)
    x = startX + (purityCenterX - startX) * t
    y = startY + (purityCenterY - startY) * t
    scale = startScale + (midScale - startScale) * t
    rotate = startRotate + (midRotate - startRotate) * t
  } else {
    // Phase 2: Purity -> Delivered center
    const t = easeInOutQuad((progress - 0.5) / 0.5)
    x = purityCenterX + (deliveredCenterX - purityCenterX) * t
    y = purityCenterY + (deliveredCenterY - purityCenterY) * t
    scale = midScale + (endScale - midScale) * t
    rotate = midRotate + (endRotate - midRotate) * t
  }

  /* ---- Image crossfade: 4 images ---- */
  // Image 1: Seed (frame-3) — visible at start, fades out early
  // Image 2: Cardamom (frame-40) — fades in during Hero->Purity
  // Image 3: Rice husk (user provided) — fades in when scrolling from section 2
  // Image 4: Red bag (frame-89) — fades in approaching section 3 landing

  // Seed: visible 0-0.2, fades out 0.2-0.35
  const seedOpacity =
    progress < 0.2 ? 1
    : progress < 0.35 ? 1 - (progress - 0.2) / 0.15
    : 0

  // Cardamom: fades in 0.15-0.3, visible 0.3-0.5, fades out 0.5-0.6
  const cardamomOpacity =
    progress < 0.15 ? 0
    : progress < 0.3 ? (progress - 0.15) / 0.15
    : progress < 0.5 ? 1
    : progress < 0.6 ? 1 - (progress - 0.5) / 0.1
    : 0

  // Rice husk: fades in 0.48-0.6, visible 0.6-0.75, fades out 0.75-0.85
  const riceHuskOpacity =
    progress < 0.48 ? 0
    : progress < 0.6 ? (progress - 0.48) / 0.12
    : progress < 0.75 ? 1
    : progress < 0.85 ? 1 - (progress - 0.75) / 0.1
    : 0

  // Red bag: fades in 0.78-0.9, visible 0.9-0.96, fades out 0.96-1.0
  const redBagOpacity =
    progress < 0.78 ? 0
    : progress < 0.9 ? (progress - 0.78) / 0.12
    : progress < 0.96 ? 1
    : 1 - (progress - 0.96) / 0.04

  // Width: grow slightly for the bag image at the end
  const currentWidth = progress > 0.78
    ? seedWidth * (1 + (progress - 0.78) * 0.7)
    : seedWidth

  // Hide entirely once fully landed
  const containerOpacity = progress >= 1 ? 0 : 1

  return (
    <div
      ref={seedRef}
      className="pointer-events-none absolute left-0 top-0 z-30"
      style={{
        transform: `translate3d(${x - currentWidth / 2}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        willChange: "transform, opacity",
        width: currentWidth,
        opacity: containerOpacity,
        transition: "opacity 0.2s ease-out",
      }}
    >
      {/* Image 1: Seed */}
      <div
        className="absolute inset-0"
        style={{ opacity: seedOpacity }}
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

      {/* Image 2: Cardamom */}
      <div
        className="absolute inset-0"
        style={{ opacity: cardamomOpacity }}
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

      {/* Image 3: Rice husk (user-provided) */}
      <div
        className="absolute inset-0"
        style={{ opacity: riceHuskOpacity }}
      >
        <Image
          src="/images/rice-husk.png"
          alt="Rice grain husk"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Image 4: Red bag */}
      <div
        className="absolute inset-0"
        style={{ opacity: redBagOpacity }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-89-nTsRrpdjrkJrI5ZzXRkp20Bukg02rh.png"
          alt="Keerthi Nirmal Long Grain Matta red bag"
          width={500}
          height={750}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Invisible spacer to maintain container height */}
      <div style={{ visibility: "hidden" }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-3-removebg-preview%201-iJ06KjM6d4IPII6wZrIytjtvwbh55k.png"
          alt=""
          width={400}
          height={600}
          className="h-auto w-full object-contain"
          unoptimized
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
