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
        {/* Main content - heading + bags */}
        <div className="relative z-10 flex flex-col items-center px-4">
          {/* Heading */}
          <h2
            className="relative z-30 mb-6 text-center text-[clamp(2rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary md:mb-8"
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

          {/* Bags container - absolute positioned bags + blobs */}
          <div
            className="relative"
            style={{
              width: "clamp(300px, 42vw, 560px)",
              height: "clamp(220px, 30vw, 400px)",
            }}
          >
            {/* Left green blob - behind yellow bag */}
            <div
              className="absolute hidden bg-primary md:block"
              style={{
                width: "clamp(200px, 22vw, 320px)",
                height: "clamp(200px, 22vw, 320px)",
                bottom: "5%",
                left: "-45%",
                borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0) rotate(-5deg)" : "translateY(30px) rotate(-5deg)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                transitionDelay: "1.8s",
                zIndex: 0,
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center text-primary-foreground lg:p-7">
                <svg
                  className="mb-1"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v8m0 0c-2 0-4-1-6-3m6 3c2 0 4-1 6-3M12 10v12M8 22h8" />
                </svg>
                <span className="text-[clamp(0.8rem,1.2vw,1.1rem)] font-black uppercase leading-tight">
                  Long Grain
                </span>
                <span className="text-[clamp(0.8rem,1.2vw,1.1rem)] font-black uppercase leading-tight">
                  Matta Rice
                </span>
                <p className="mt-1 max-w-[90%] text-[clamp(0.45rem,0.65vw,0.6rem)] leading-snug opacity-85">
                  Our meticulous sourcing process ensures the highest quality grain, selecting only from trusted farms across South India.
                </p>
              </div>
            </div>

            {/* Right green blob - behind blue bag */}
            <div
              className="absolute hidden bg-primary md:block"
              style={{
                width: "clamp(200px, 22vw, 320px)",
                height: "clamp(200px, 22vw, 320px)",
                top: "-20%",
                right: "-45%",
                borderRadius: "44% 56% 38% 62% / 52% 60% 40% 48%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0) rotate(5deg)" : "translateY(30px) rotate(5deg)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                transitionDelay: "2.2s",
                zIndex: 0,
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center text-primary-foreground lg:p-7">
                <svg
                  className="mb-1"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v8m0 0c-2 0-4-1-6-3m6 3c2 0 4-1 6-3M12 10v12M8 22h8" />
                </svg>
                <span className="text-[clamp(0.8rem,1.2vw,1.1rem)] font-black uppercase leading-tight">
                  Long Grain
                </span>
                <span className="text-[clamp(0.8rem,1.2vw,1.1rem)] font-black uppercase leading-tight">
                  Matta Rice
                </span>
                <p className="mt-1 max-w-[90%] text-[clamp(0.45rem,0.65vw,0.6rem)] leading-snug opacity-85">
                  Our meticulous sourcing process ensures the highest quality grain, selecting only from trusted farms across South India.
                </p>
              </div>
            </div>

            {/* Yellow bag - behind, bottom-left, slides from LEFT (negative X) */}
            <div
              className="absolute bottom-0 z-[2]"
              style={{
                width: "48%",
                left: "0%",
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

            {/* Blue bag - behind, bottom-right, slides from RIGHT (positive X) */}
            <div
              className="absolute bottom-0 z-[2]"
              style={{
                width: "48%",
                right: "0%",
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
              className="absolute bottom-0 left-1/2 z-[5]"
              style={{
                width: "58%",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(-50%) scale(1)"
                  : "translateX(-50%) scale(0.85)",
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
