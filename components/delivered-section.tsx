"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function DeliveredSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
      let raf = 0
      function onScroll() {
        if (raf) cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const el = sectionRef.current
          if (!el) return
          const rect = el.getBoundingClientRect()
          const viewH = window.innerHeight
          // Start when section enters viewport, end when fully visible
          const start = viewH * 0.3
          const end = -viewH * 0.6
          const raw = (start - rect.top) / (start - end)
          setScrollProgress(Math.max(0, Math.min(1, raw)))
        })
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      onScroll()
      return () => {
        window.removeEventListener("scroll", onScroll)
        if (raf) cancelAnimationFrame(raf)
      }
    }, [])

    // Animation thresholds - sequential appearance
    // 0.00 - 0.15: Heading appears
    // 0.10 - 0.30: Red packet scales up from center
    // 0.25 - 0.45: Yellow packet slides in from left
    // 0.35 - 0.55: Blue packet slides in from right
    // 0.50 - 0.70: Right green circle appears
    // 0.60 - 0.80: Left green circle appears

    const p = scrollProgress

    // Heading
    const headingProgress = Math.max(0, Math.min(1, p / 0.15))

    // Red packet
    const redProgress = Math.max(0, Math.min(1, (p - 0.10) / 0.20))

    // Yellow packet (slides from left)
    const yellowProgress = Math.max(0, Math.min(1, (p - 0.25) / 0.20))

    // Blue packet (slides from right)
    const blueProgress = Math.max(0, Math.min(1, (p - 0.35) / 0.20))

    // Right green circle
    const rightCircleProgress = Math.max(0, Math.min(1, (p - 0.50) / 0.20))

    // Left green circle
    const leftCircleProgress = Math.max(0, Math.min(1, (p - 0.60) / 0.20))

    // Easing function
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const headingEased = ease(headingProgress)
    const redEased = ease(redProgress)
    const yellowEased = ease(yellowProgress)
    const blueEased = ease(blueProgress)
    const rightCircleEased = ease(rightCircleProgress)
    const leftCircleEased = ease(leftCircleProgress)

    return (
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-background px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
        style={{ minHeight: "150vh" }}
      >
        <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-7xl">
            {/* Heading with clip-path reveal */}
            <div className="relative mb-12 flex justify-center md:mb-20">
              {/* Ghost blurred text behind */}
              <div
                className="pointer-events-none absolute inset-0 flex select-none justify-center"
                aria-hidden="true"
              >
                <h2
                  className="text-center text-[clamp(2.5rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter"
                  style={{
                    color: "hsl(var(--primary))",
                    filter: "blur(6px)",
                    opacity: headingEased * 0.15,
                    clipPath: `inset(0 ${(1 - headingEased) * 100}% 0 0)`,
                  }}
                >
                  <span className="block">Delivered</span>
                  <span className="block">With Precision</span>
                </h2>
              </div>

              {/* Main text */}
              <h2
                className="relative z-10 text-center text-[clamp(2.5rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
                style={{
                  clipPath: `inset(0 ${(1 - headingEased) * 100}% 0 0)`,
                }}
              >
                <span className="block">Delivered</span>
                <span className="block">With Precision</span>
              </h2>
            </div>

            {/* Product Bags & Green Circles */}
            <div className="relative flex items-end justify-center">
              {/* Left green circle */}
              <div
                className="absolute left-0 top-1/2 z-[5] flex h-[240px] w-[240px] -translate-y-1/2 flex-col items-center justify-center rounded-full p-6 text-center md:left-[2%] md:h-[300px] md:w-[300px] lg:left-[3%] lg:h-[340px] lg:w-[340px]"
                style={{
                  backgroundColor: "hsl(160, 63%, 48%)",
                  opacity: leftCircleEased,
                  transform: `translateY(-50%) translateX(${(1 - leftCircleEased) * -120}px) scale(${0.5 + leftCircleEased * 0.5})`,
                }}
              >
                {/* Wheat icon */}
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-2"
                >
                  <path
                    d="M12 2C12 2 8 6 8 10C8 12 9 13.5 10 14.5L10 22H14L14 14.5C15 13.5 16 12 16 10C16 6 12 2 12 2Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path d="M7 8C5 7 3 8 3 10C3 12 5 13 7 12" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M17 8C19 7 21 8 21 10C21 12 19 13 17 12" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
                <h3 className="mb-1 text-lg font-black uppercase leading-tight tracking-tight text-primary-foreground md:text-xl lg:text-2xl">
                  Long Grain
                  <br />
                  Matta Rice
                </h3>
                <p className="text-[10px] leading-relaxed text-primary-foreground/80 md:text-xs lg:text-sm">
                  Our meticulous sourcing process ensures the highest quality grain, selecting only from trusted farms across South India.
                  {"That's how Keerthi Nirmal became the best rice brand in Kerala."}
                </p>
              </div>

              {/* Yellow Bag - Left */}
              <div
                className="relative z-10 w-[30%] max-w-[320px]"
                style={{
                  opacity: yellowEased,
                  transform: `translateX(${(1 - yellowEased) * -200}px) translateY(${(1 - yellowEased) * 30}px)`,
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-96-hGGXNQH7kZ9QTdUgwv0YergS2TPyEB.png"
                  alt="Keerthi Nirmal Jaya Rice yellow bag"
                  width={400}
                  height={600}
                  className="h-auto w-full object-contain"
                  unoptimized
                />
              </div>

              {/* Red Bag - Center */}
              <div
                className="relative z-20 -mx-[8%] w-[38%] max-w-[380px] md:-mx-[5%]"
                style={{
                  opacity: redEased,
                  transform: `translateY(${(1 - redEased) * 60}px) scale(${0.8 + redEased * 0.2})`,
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

              {/* Blue Bag - Right */}
              <div
                className="relative z-10 w-[30%] max-w-[320px]"
                style={{
                  opacity: blueEased,
                  transform: `translateX(${(1 - blueEased) * 200}px) translateY(${(1 - blueEased) * 30}px)`,
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-100-PpYr5t3HooHC7CjGLi8QCO9f7W8TkG.png"
                  alt="Keerthi Nirmal Short Grain Matta blue bag"
                  width={400}
                  height={600}
                  className="h-auto w-full object-contain"
                  unoptimized
                />
              </div>

              {/* Right green circle */}
              <div
                className="absolute right-0 top-1/2 z-[5] flex h-[240px] w-[240px] -translate-y-1/2 flex-col items-center justify-center rounded-full p-6 text-center md:right-[2%] md:h-[300px] md:w-[300px] lg:right-[3%] lg:h-[340px] lg:w-[340px]"
                style={{
                  backgroundColor: "hsl(160, 63%, 48%)",
                  opacity: rightCircleEased,
                  transform: `translateY(-50%) translateX(${(1 - rightCircleEased) * 120}px) scale(${0.5 + rightCircleEased * 0.5})`,
                }}
              >
                {/* Wheat icon */}
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-2"
                >
                  <path
                    d="M12 2C12 2 8 6 8 10C8 12 9 13.5 10 14.5L10 22H14L14 14.5C15 13.5 16 12 16 10C16 6 12 2 12 2Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path d="M7 8C5 7 3 8 3 10C3 12 5 13 7 12" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M17 8C19 7 21 8 21 10C21 12 19 13 17 12" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
                <h3 className="mb-1 text-lg font-black uppercase leading-tight tracking-tight text-primary-foreground md:text-xl lg:text-2xl">
                  Long Grain
                  <br />
                  Matta Rice
                </h3>
                <p className="text-[10px] leading-relaxed text-primary-foreground/80 md:text-xs lg:text-sm">
                  Our meticulous sourcing process ensures the highest quality grain, selecting only from trusted farms across South India.
                  {"That's how Keerthi Nirmal became the best rice brand in Kerala."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
