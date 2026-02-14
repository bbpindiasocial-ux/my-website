"use client"

import { useEffect, useRef, useState, useCallback, forwardRef } from "react"
import Image from "next/image"

export const DeliveredSection = forwardRef<HTMLElement>(
  function DeliveredSection(_, forwardedRef) {
    const localRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [bagsVisible, setBagsVisible] = useState(false)

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
          setTimeout(() => setBagsVisible(true), 500)
        }
      },
      []
    )

    useEffect(() => {
      const el = localRef.current
      if (!el) return
      const observer = new IntersectionObserver(handleIntersection, { threshold: 0.05 })
      observer.observe(el)
      return () => observer.disconnect()
    }, [handleIntersection])

    return (
      <section
        ref={setRef}
        className="relative overflow-hidden bg-background px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Heading with layered text reveal */}
          <div className="relative mb-16 flex justify-center md:mb-24">
            {/* Ghost blurred text */}
            <div
              className="pointer-events-none absolute inset-0 flex select-none justify-center"
              aria-hidden="true"
            >
              <h2
                className="text-center text-[clamp(2.2rem,9vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter"
                style={{
                  color: "hsl(var(--primary))",
                  filter: "blur(6px)",
                  opacity: isVisible ? 0.12 : 0,
                  clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transition:
                    "clip-path 2s cubic-bezier(0.77, 0, 0.175, 1), opacity 2s ease-out",
                }}
              >
                <span className="block">Delivered</span>
                <span className="block">With Precision</span>
              </h2>
            </div>

            {/* Main text */}
            <h2
              className="relative z-10 text-center text-[clamp(2.2rem,9vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
              style={{
                clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
              }}
            >
              <span className="block">Delivered</span>
              <span className="block">With Precision</span>
            </h2>
          </div>

          {/* Three product bags with dramatic slide-in */}
          <div className="relative flex items-end justify-center gap-0">
            {/* Yellow Bag - slides in from FAR LEFT */}
            <div
              className="relative z-10 w-[28%] max-w-[300px]"
              style={{
                transform: bagsVisible
                  ? "translateX(0) translateY(0) rotate(0deg)"
                  : "translateX(-120%) translateY(80px) rotate(-12deg)",
                opacity: bagsVisible ? 1 : 0,
                transition:
                  "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.8s ease-out 0.15s",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-96-hGGXNQH7kZ9QTdUgwv0YergS2TPyEB.png"
                alt="Keerthi Nirmal Jaya Rice yellow bag"
                width={400}
                height={600}
                className="h-auto w-full object-contain drop-shadow-xl"
                unoptimized
              />
            </div>

            {/* Red Bag - Center, rises up from below with scale */}
            <div
              className="relative z-20 -mx-[6%] w-[36%] max-w-[360px] md:-mx-[4%]"
              style={{
                transform: bagsVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(200px) scale(0.7)",
                opacity: bagsVisible ? 1 : 0,
                transition:
                  "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
              }}
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

            {/* Blue Bag - slides in from FAR RIGHT */}
            <div
              className="relative z-10 w-[28%] max-w-[300px]"
              style={{
                transform: bagsVisible
                  ? "translateX(0) translateY(0) rotate(0deg)"
                  : "translateX(120%) translateY(80px) rotate(12deg)",
                opacity: bagsVisible ? 1 : 0,
                transition:
                  "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.8s ease-out 0.15s",
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-100-PpYr5t3HooHC7CjGLi8QCO9f7W8TkG.png"
                alt="Keerthi Nirmal Short Grain Matta blue bag"
                width={400}
                height={600}
                className="h-auto w-full object-contain drop-shadow-xl"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
)
