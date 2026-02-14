"use client"

import { useEffect, useState, forwardRef } from "react"

export const HeroSection = forwardRef<HTMLElement>(function HeroSection(_, ref) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-[55vh] overflow-visible px-6 pb-24 lg:min-h-[70vh] lg:px-12"
    >
      {/* Hero headline - positioned right of center to leave space for floating seed on left */}
      <div className="relative z-10 flex items-start justify-center pt-6 md:justify-end md:pr-[5%] lg:pt-10">
        <div className="overflow-hidden">
          <h1
            className={`text-[clamp(3.2rem,11vw,10rem)] font-black uppercase leading-[0.82] tracking-tighter text-primary transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]`}
            style={{
              clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transform: isVisible ? "translateX(0)" : "translateX(80px)",
              opacity: isVisible ? 1 : 0,
              transition:
                "clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1), transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.6s ease-out",
            }}
          >
            <span className="block">Cultivated</span>
            <span className="block">With Care</span>
          </h1>
        </div>
      </div>

      {/* Subtitle text */}
      <div
        className={`relative z-10 mt-6 flex justify-center md:justify-end md:pr-[5%] transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
      >
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
          Premium quality grains sourced from trusted farms across South India, bringing nature's finest to your table.
        </p>
      </div>

      {/* Blurred ghost text for depth - behind the seed */}
      <div
        className="pointer-events-none absolute right-[5%] top-6 z-[5] hidden select-none md:block lg:top-10"
        aria-hidden="true"
      >
        <div
          className={`text-[clamp(3.2rem,11vw,10rem)] font-black uppercase leading-[0.82] tracking-tighter`}
          style={{
            color: "hsl(var(--primary))",
            filter: "blur(5px)",
            opacity: isVisible ? 0.1 : 0,
            clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition:
              "clip-path 2s cubic-bezier(0.77, 0, 0.175, 1), opacity 2s ease-out",
          }}
        >
          <span className="block">Cultivated</span>
          <span className="block">With Care</span>
        </div>
      </div>
    </section>
  )
})
