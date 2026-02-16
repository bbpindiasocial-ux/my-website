"use client"

import { useEffect, useRef, useState, useCallback, forwardRef } from "react"

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
          {/* Heading with blur reveal */}
          <div className="relative mb-16 flex justify-center md:mb-24">
            {/* Ghost blurred text behind */}
            <div
              className="pointer-events-none absolute inset-0 flex select-none justify-center"
              aria-hidden="true"
            >
              <h2
                className={`text-center text-[clamp(2.5rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
                  isVisible ? "opacity-15" : "opacity-0"
                }`}
                style={{
                  color: "hsl(var(--primary))",
                  filter: "blur(6px)",
                  clipPath: isVisible
                    ? "inset(0 0% 0 0)"
                    : "inset(0 100% 0 0)",
                  transition:
                    "clip-path 1.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 1.8s ease-out",
                }}
              >
                <span className="block">Delivered</span>
                <span className="block">With Precision</span>
              </h2>
            </div>

            {/* Main text */}
            <h2
              className={`relative z-10 text-center text-[clamp(2.5rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary`}
              style={{
                clipPath: isVisible
                  ? "inset(0 0% 0 0)"
                  : "inset(0 100% 0 0)",
                transition:
                  "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
                maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
              }}
            >
              <span className="block">Delivered</span>
              <span className="block">With Precision</span>
            </h2>
          </div>

          {/* Spacer for the scroll-animated rice packet to land */}
          <div
            className="relative flex h-[300px] w-full items-center justify-center md:h-[400px] lg:h-[500px]"
            aria-hidden="true"
          />
        </div>
      </section>
    )
  }
)
