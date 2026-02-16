"use client"

import { useEffect, useRef, useState, useCallback, forwardRef } from "react"
import Image from "next/image"

export const DeliveredSection = forwardRef<HTMLElement>(
  function DeliveredSection(_, forwardedRef) {
    const localRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    const setRef = useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      },
      [forwardedRef]
    )

    const handleIntersection = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      []
    )

    useEffect(() => {
      const el = localRef.current
      if (!el) return
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.75,
      })
      observer.observe(el)
      return () => observer.disconnect()
    }, [handleIntersection])

    return (
      <section
        ref={setRef}
        className="relative flex h-svh min-h-[500px] items-center justify-center overflow-hidden bg-background px-6"
      >
        <div className="flex flex-col items-center gap-6 md:gap-8">
          {/* Heading */}
          <h2
            className="relative z-10 text-center text-[clamp(2rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
            style={{
              clipPath: isVisible
                ? "inset(0 0% 0 0)"
                : "inset(0 100% 0 0)",
              transition:
                "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
            }}
          >
            <span className="block">Delivered</span>
            <span className="block">With Precision</span>
          </h2>

          {/* Rice packet image */}
          <div
            className={`w-full max-w-[180px] transition-all duration-1000 ease-out md:max-w-[240px] lg:max-w-[300px] ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-16 opacity-0 scale-90"
            }`}
            style={{ transitionDelay: "0.6s" }}
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
      </section>
    )
  }
)
