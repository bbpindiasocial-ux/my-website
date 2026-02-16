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
  const [seedWidth, setSeedWidth] = useState(220)
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
    setSeedWidth(w >= 1024 ? 220 : w >= 768 ? 180 : 140)

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

        const animStart = heroRect.top + viewH * 0.05
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

  // Start: Match the hero's absolutely positioned rice (left: 6%, top: 50%, rotate -85deg)
  const startX = heroRect.left + heroRect.width * 0.06 + seedWidth / 2
  const startY = heroRect.top + heroRect.height * 0.5
  const startScale = 1
  const startRotate = -85

  // Mid: Purity section center
  const purityCenterX = purityRect.left + purityRect.width * 0.42
  const purityCenterY = purityRect.top + purityRect.height * 0.25
  const midScale = 0.9
  const midRotate = -5

  // End: Delivered section center (where red bag will be)
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
    const t = easeInOutQuad(progress / 0.5)
    x = startX + (purityCenterX - startX) * t
    y = startY + (purityCenterY - startY) * t
    scale = startScale + (midScale - startScale) * t
    rotate = startRotate + (midRotate - startRotate) * t
  } else {
    const t = easeInOutQuad((progress - 0.5) / 0.5)
    x = purityCenterX + (deliveredCenterX - purityCenterX) * t
    y = purityCenterY + (deliveredCenterY - purityCenterY) * t
    scale = midScale + (endScale - midScale) * t
    rotate = midRotate + (endRotate - midRotate) * t
  }

  /* ---- Image crossfade ---- */
  const p2 = progress <= 0.5 ? 0 : (progress - 0.5) / 0.5

  const seedOpacity =
    p2 <= 0 ? 1
    : p2 < 0.2 ? 1 - p2 / 0.2
    : 0

  const cardamomOpacity =
    p2 < 0.05 ? 0
    : p2 < 0.2 ? (p2 - 0.05) / 0.15
    : p2 < 0.4 ? 1
    : p2 < 0.55 ? 1 - (p2 - 0.4) / 0.15
    : 0

  const riceHuskOpacity =
    p2 < 0.4 ? 0
    : p2 < 0.55 ? (p2 - 0.4) / 0.15
    : p2 < 0.7 ? 1
    : p2 < 0.85 ? 1 - (p2 - 0.7) / 0.15
    : 0

  const redBagOpacity =
    p2 < 0.7 ? 0
    : p2 < 0.85 ? (p2 - 0.7) / 0.15
    : p2 < 0.95 ? 1
    : 1 - (p2 - 0.95) / 0.05

  const currentWidth = p2 > 0.7
    ? seedWidth * (1 + (p2 - 0.7) * 0.8)
    : seedWidth

  // ScrollSeed is invisible at progress 0 (static hero rice is shown instead)
  // Becomes visible as soon as scrolling starts (progress > 0)
  // Fades out when fully landed at progress 1
  const containerOpacity = progress <= 0.005 ? 0 : progress >= 0.98 ? 0 : 1

  return (
    <div
      ref={seedRef}
      className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block"
      style={{
        transform: `translate3d(${x - currentWidth / 2}px, ${y - currentWidth * 0.5}px, 0) rotate(${rotate}deg) scale(${scale})`,
        willChange: "transform, opacity",
        width: currentWidth,
        opacity: containerOpacity,
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
        transition: "opacity 0.3s ease-out",
      }}
    >
      {/* Image 1: Seed */}
      <div className="absolute inset-0" style={{ opacity: seedOpacity }}>
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
      <div className="absolute inset-0" style={{ opacity: cardamomOpacity }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-40-removebg-preview%201-4we2BvDPWE5vYKekYkG0M1YrAMuwGH.png"
          alt="Cardamom pod"
          width={400}
          height={600}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Image 3: Rice husk */}
      <div className="absolute inset-0" style={{ opacity: riceHuskOpacity }}>
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
      <div className="absolute inset-0" style={{ opacity: redBagOpacity }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-89-nTsRrpdjrkJrI5ZzXRkp20Bukg02rh.png"
          alt="Keerthi Nirmal Long Grain Matta red bag"
          width={500}
          height={750}
          className="h-auto w-full object-contain drop-shadow-2xl"
          unoptimized
        />
      </div>

      {/* Invisible spacer */}
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
