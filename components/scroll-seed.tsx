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

        // Animation spans from hero top to delivered section entry
        const animStart = heroRect.top
        const animEnd = deliveredRect.top + deliveredRect.height * 0.3

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
  }, [heroRef, purityRef, deliveredRef, heroRect, purityRect, deliveredRect])

  if (!isReady) return null

  // --- Phase 1: Hero to Purity center (progress 0 - 0.4) ---
  // --- Phase 2: At purity center, crossfade to rice grain (progress 0.4 - 0.6) ---
  // --- Phase 3: Rice grain falls + crossfades to red packet (progress 0.6 - 0.85) ---
  // --- Phase 4: Red packet settles into delivered section center (progress 0.85 - 1.0) ---

  // Start position (hero)
  const startX = heroRect.left + heroRect.width * 0.04
  const startY = heroRect.top + 20

  // Mid position (purity center)
  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.2

  // End position (delivered section center)
  const deliveredCenterX = deliveredRect.left + deliveredRect.width / 2 - seedWidth / 2
  const deliveredCenterY = deliveredRect.top + deliveredRect.height * 0.15

  // Easing function
  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  let x: number, y: number, scale: number, rotate: number

  if (progress <= 0.4) {
    // Phase 1: Hero -> Purity center
    const t = easeInOutQuad(progress / 0.4)
    x = startX + (purityCenterX - startX) * t
    y = startY + (purityCenterY - startY) * t
    scale = 1 + (0.85 - 1) * t
    rotate = -25 + (-5 - -25) * t
  } else if (progress <= 0.6) {
    // Phase 2: Hold at purity center, slight drift down + crossfade to rice grain
    const t = easeInOutQuad((progress - 0.4) / 0.2)
    x = purityCenterX
    y = purityCenterY + t * 40
    scale = 0.85 + (0.9 - 0.85) * t
    rotate = -5 + (0 - -5) * t
  } else if (progress <= 0.85) {
    // Phase 3: Rice grain falls down toward delivered section + crossfade to red packet
    const t = easeInOutQuad((progress - 0.6) / 0.25)
    const phaseStartX = purityCenterX
    const phaseStartY = purityCenterY + 40
    x = phaseStartX + (deliveredCenterX - phaseStartX) * t
    y = phaseStartY + (deliveredCenterY - phaseStartY) * t
    scale = 0.9 + (1.0 - 0.9) * t
    rotate = 0
  } else {
    // Phase 4: Red packet settles at delivered section center
    const t = easeInOutQuad((progress - 0.85) / 0.15)
    x = deliveredCenterX
    y = deliveredCenterY + (1 - t) * 10
    scale = 1.0 + t * 0.05
    rotate = 0
  }

  // --- Image opacities (4 layers) ---
  // Layer 1: Original grain seed (visible 0 - 0.35, fades out 0.3-0.45)
  const seedOpacity = progress < 0.3 ? 1 : Math.max(0, 1 - (progress - 0.3) / 0.15)

  // Layer 2: Cardamom pod (fades in 0.25-0.4, visible 0.4-0.5, fades out 0.5-0.6)
  const cardamomIn = progress < 0.25 ? 0 : Math.min(1, (progress - 0.25) / 0.15)
  const cardamomOut = progress < 0.5 ? 1 : Math.max(0, 1 - (progress - 0.5) / 0.1)
  const cardamomOpacity = Math.min(cardamomIn, cardamomOut)

  // Layer 3: Rice grain (fades in 0.45-0.6, visible 0.6-0.7, fades out 0.7-0.85)
  const riceIn = progress < 0.45 ? 0 : Math.min(1, (progress - 0.45) / 0.15)
  const riceOut = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.15)
  const riceOpacity = Math.min(riceIn, riceOut)

  // Layer 4: Red rice packet (fades in 0.7-0.85, stays visible)
  const packetOpacity = progress < 0.7 ? 0 : Math.min(1, (progress - 0.7) / 0.15)

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
      {/* Layer 1: Original grain seed */}
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

      {/* Layer 3: Rice grain (user-provided) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: riceOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_113737-removebg-preview-evWEoit5u4I2ZAzEJBZoUEgf1wUenq.png"
          alt="Matta rice grain"
          width={200}
          height={400}
          className="h-auto w-[60%] object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Layer 4: Red rice packet (user-provided) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: packetOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-14%20114000-qGaz0h94eEteVIOM9x3Cfde0SccO2y.png"
          alt="Keerthi Nirmal Long Grain Matta rice packet"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>
    </div>
  )
}
