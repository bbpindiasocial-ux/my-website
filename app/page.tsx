"use client"

import { useRef } from "react"
import { MarqueeBanner } from "@/components/marquee-banner"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PuritySection } from "@/components/purity-section"
import { DeliveredSection } from "@/components/delivered-section"
import { ScrollSeed } from "@/components/scroll-seed"

export default function Page() {
  const heroRef = useRef<HTMLElement>(null)
  const purityRef = useRef<HTMLElement>(null)
  const deliveredRef = useRef<HTMLElement>(null)

  return (
    <main className="relative min-h-screen bg-background">
      <MarqueeBanner />
      <Navigation />
      <HeroSection ref={heroRef} />
      <PuritySection ref={purityRef} />
      <DeliveredSection ref={deliveredRef} />
      <ScrollSeed heroRef={heroRef} purityRef={purityRef} deliveredRef={deliveredRef} />
    </main>
  )
}
