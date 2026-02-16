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
        className="relative flex h-svh min-h-[600px] items-center justify-center overflow-hidden bg-background"
      >
        {/* Right green circle - higher, overlapping heading area, edge-cropped */}
        <div
          className="absolute z-20 hidden flex-col items-center justify-center rounded-full bg-primary p-8 text-center text-primary-foreground md:flex lg:p-10"
          style={{
            width: "clamp(200px, 22vw, 320px)",
            height: "clamp(200px, 22vw, 320px)",
            top: "8%",
            right: "-3%",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            transitionDelay: "1.8s",
          }}
        >
          <span className="text-[clamp(0.65rem,1vw,0.85rem)] font-bold uppercase tracking-wider">
            Trusted
          </span>
          <span className="text-[clamp(2rem,3.5vw,3.5rem)] font-black leading-none">
            50+
          </span>
          <span className="mt-1 max-w-[80%] text-[clamp(0.55rem,0.9vw,0.75rem)] leading-tight opacity-80">
            Years of quality and tradition
          </span>
        </div>

        {/* Left green circle - lower, overlapping bags area, edge-cropped */}
        <div
          className="absolute z-20 hidden flex-col items-center justify-center rounded-full bg-primary p-8 text-center text-primary-foreground md:flex lg:p-10"
          style={{
            width: "clamp(200px, 22vw, 320px)",
            height: "clamp(200px, 22vw, 320px)",
            bottom: "8%",
            left: "-3%",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            transitionDelay: "2.2s",
          }}
        >
          <span className="text-[clamp(0.65rem,1vw,0.85rem)] font-bold uppercase tracking-wider">
            Premium
          </span>
          <span className="text-[clamp(2rem,3.5vw,3.5rem)] font-black leading-none">
            100%
          </span>
          <span className="mt-1 max-w-[80%] text-[clamp(0.55rem,0.9vw,0.75rem)] leading-tight opacity-80">
            Natural grain sourced from Kerala
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          {/* Heading */}
          <h2
            className="relative z-30 mb-6 text-center text-[clamp(2rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary md:mb-10"
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

          {/* Bags container */}
          <div
            className="relative"
            style={{
              width: "clamp(280px, 40vw, 520px)",
              height: "clamp(220px, 32vw, 400px)",
            }}
          >
            {/* Yellow bag - behind, left, slides from LEFT (negative X) */}
            <div
              className="absolute bottom-0 left-0 z-0"
              style={{
                width: "46%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-80px)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                transitionDelay: "1.0s",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JAYA-RISE-5-KG.jpg-BK.jpg-removebg-preview-6EQ59iRQ8XXPm5TszEdd4Ju0RTktNL.png"
                alt="Keerthi Nirmal Jaya Rice bag"
                width={400}
                height={600}
                className="h-auto w-full object-contain drop-shadow-xl"
                unoptimized
              />
            </div>

            {/* Blue bag - behind, right, slides from RIGHT (positive X) */}
            <div
              className="absolute bottom-0 right-0 z-0"
              style={{
                width: "46%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(80px)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                transitionDelay: "1.4s",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f-short-grain-matta-removebg-preview%20%281%29-93vCOwafpHa8qh2hrS7F3XLe4qbTEw.png"
                alt="Keerthi Nirmal Short Grain Matta rice bag"
                width={400}
                height={600}
                className="h-auto w-full object-contain drop-shadow-xl"
                unoptimized
              />
            </div>

            {/* Red bag - front center, largest, appears first */}
            <div
              className="absolute bottom-0 left-1/2 z-10"
              style={{
                width: "62%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(-50%) scale(1)"
                  : "translateX(-50%) scale(0.8)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                transitionDelay: "0.6s",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_114000-removebg-preview-removebg-preview-3lMF5e5XOzqJTmtBKeCYCwoY4jOYqy.png"
                alt="Keerthi Nirmal Long Grain Matta rice bag"
                width={400}
                height={600}
                className="h-auto w-full object-contain drop-shadow-2xl"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
)
