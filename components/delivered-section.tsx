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
        threshold: 0.15,
      })
      observer.observe(el)
      return () => observer.disconnect()
    }, [handleIntersection])

    return (
      <section
        ref={setRef}
        className="relative overflow-hidden bg-background px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          {/* Heading */}
          <h2
            className="relative z-10 text-center text-[clamp(2.5rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
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
            className={`mt-10 w-full max-w-[280px] transition-all duration-1000 ease-out md:mt-14 md:max-w-[340px] lg:mt-16 lg:max-w-[400px] ${
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
