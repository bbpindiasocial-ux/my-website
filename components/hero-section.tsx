"use client"

import { useEffect, useState, forwardRef } from "react"
import Image from "next/image"

export const HeroSection = forwardRef<HTMLElement>(function HeroSection(_, ref) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={ref}
      className="relative -mt-4 min-h-[60vh] overflow-visible px-6 pb-20 lg:min-h-[75vh] lg:px-12"
    >
      {/* Static rice grain - absolutely positioned on the left */}
      <div
        className="pointer-events-none absolute left-[6%] top-1/2 z-0 hidden -translate-y-1/2 md:block"
        style={{
          animation: "floatRice 4s ease-in-out infinite",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-3-removebg-preview%201-iJ06KjM6d4IPII6wZrIytjtvwbh55k.png"
          alt="Premium grain seed"
          width={220}
          height={440}
          className="h-auto w-[220px] rotate-[-85deg] object-contain drop-shadow-2xl"
          priority
          unoptimized
        />
      </div>

      {/* Mobile rice grain - centered above heading */}
      <div className="flex justify-center pb-4 pt-2 md:hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-3-removebg-preview%201-iJ06KjM6d4IPII6wZrIytjtvwbh55k.png"
          alt="Premium grain seed"
          width={140}
          height={280}
          className="h-auto w-[140px] object-contain drop-shadow-2xl"
          priority
          unoptimized
        />
      </div>

      {/* Hero Text */}
      <div className="relative z-10 flex items-start justify-center pt-8 md:justify-start md:pl-[15%] lg:pl-[20%] lg:pt-12">
        <div className="overflow-hidden">
          <h1
            className={`text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-[100px] opacity-0"
            }`}
            style={{
              clipPath: isVisible
                ? "inset(0 0% 0 0)"
                : "inset(0 100% 0 0)",
              transition:
                "clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1), transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease-out",
            }}
          >
            <span className="block">Cultivated</span>
            <span className="block">With Care</span>
          </h1>
        </div>
      </div>

      {/* Decorative blurred ghost text behind the seed for depth */}
      <div
        className="pointer-events-none absolute left-[5%] top-8 z-[5] hidden select-none md:block lg:top-12"
        aria-hidden="true"
      >
        <div
          className={`text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.85] tracking-tighter transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isVisible ? "opacity-20" : "opacity-0"
          }`}
          style={{
            color: "hsl(var(--primary))",
            filter: "blur(4px)",
            clipPath: isVisible
              ? "inset(0 70% 0 0)"
              : "inset(0 100% 0 0)",
            transition:
              "clip-path 1.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 1.8s ease-out",
          }}
        >
          <span className="block">Cultivated</span>
          <span className="block">With Care</span>
        </div>
      </div>
    </section>
  )
})
