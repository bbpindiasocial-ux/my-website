"use client"

import { useRef } from "react"
import { MarqueeBanner } from "@/components/marquee-banner"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PuritySection } from "@/components/purity-section"
import { ScrollSeed } from "@/components/scroll-seed"
import { DeliveredSection } from "@/components/delivered-section"
import { ProcessSection } from "@/components/process-section"
import { ProductsSection } from "@/components/products-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  const heroRef = useRef<HTMLElement>(null)
  const purityRef = useRef<HTMLElement>(null)

  return (
    <main className="relative min-h-screen bg-background">
      <MarqueeBanner />
      <Navigation />
      <HeroSection ref={heroRef} />
      <PuritySection ref={purityRef} />
      <ScrollSeed heroRef={heroRef} purityRef={purityRef} />
      <DeliveredSection />
      <ProcessSection />
      <ProductsSection />
      <TestimonialsSection />
      <SiteFooter />
    </main>
  )
}
