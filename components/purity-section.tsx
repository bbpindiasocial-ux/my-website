"use client"

import { useEffect, useRef, useState, useCallback, forwardRef } from "react"
import { ArrowRight } from "lucide-react"


function useCountUp(target: number, duration: number, isVisible: boolean, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    let startTime: number | null = null
    let raf: number

    function animate(time: number) {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isVisible, target, duration, decimals])

  return value
}

function BenefitStat({
  label,
  value,
  suffix,
  description,
  isVisible,
  delay,
  decimals = 0,
}: {
  label: string
  value: number
  suffix: string
  description: string
  isVisible: boolean
  delay: number
  decimals?: number
}) {
  const count = useCountUp(value, 1500, isVisible, decimals)
  const [showStat, setShowStat] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => setShowStat(true), delay)
    return () => clearTimeout(timer)
  }, [isVisible, delay])

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        showStat ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="mb-3 h-px w-full bg-foreground/20" />
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-foreground/70">
        {label}
      </p>
      <div className="flex items-start gap-4 lg:gap-6">
        <p className="shrink-0 text-5xl font-black leading-none tracking-tighter text-primary md:text-6xl lg:text-7xl">
          {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
          <span className="text-3xl md:text-4xl lg:text-5xl">{suffix}</span>
        </p>
        <p className="pt-2 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}

export const PuritySection = forwardRef<HTMLElement>(function PuritySection(_, forwardedRef) {
  const localRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(1)

  // Merge the forwarded ref and local ref
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

  // Scroll-linked fade-out as user scrolls toward bottom of section
  useEffect(() => {
    let raf: number
    function onScroll() {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = localRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const viewH = window.innerHeight
        // Start fading when section is 40% scrolled past, fully faded at 80%
        const sectionScrolled = -rect.top / rect.height
        if (sectionScrolled < 0.4) {
          setFadeOut(1)
        } else if (sectionScrolled > 0.8) {
          setFadeOut(0)
        } else {
          setFadeOut(1 - (sectionScrolled - 0.4) / 0.4)
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={setRef}
      className="relative overflow-hidden bg-background px-6 py-16 md:px-12 md:py-24 lg:px-16 lg:py-32"
    >
      <div
        className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-6 xl:gap-10"
        style={{
          opacity: fadeOut,
          transition: "opacity 0.1s ease-out",
        }}
      >
        {/* Left: Copy */}
        <div
          className={`flex-1 transition-all duration-700 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-[60px] opacity-0"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <p
            className="mb-2 text-lg italic text-muted-foreground md:text-xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Cultivated with care
          </p>
          <h2 className="mb-6 text-4xl font-black uppercase leading-[0.9] tracking-tighter text-primary md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">Purity In</span>
            <span className="block">Every Grain</span>
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
            Our meticulous sourcing process ensures the highest quality grain,
            selecting only from trusted farms across South India.{" "}
            {"That's how Keerthi Nirmal became the best rice brand in Kerala."}
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-lg md:px-8 md:py-4 md:text-base"
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
          </a>
        </div>

        {/* Center: Placeholder space for the scroll-linked floating image */}
        <div
          data-seed-placeholder
          className="hidden w-full max-w-[240px] flex-shrink-0 md:max-w-[280px] lg:block lg:max-w-[300px] xl:max-w-[340px]"
          aria-hidden="true"
        >
          <div className="aspect-[3/4]" />
        </div>

        {/* Right: Benefits */}
        <div
          className={`flex flex-1 flex-col gap-8 transition-all duration-700 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-[60px] opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <h3 className="text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
            Benefits
          </h3>

          <BenefitStat
            label="Water Content"
            value={51}
            suffix="%"
            description="It is like the seed put in the soil, the more one sows, the greater the harvest. We believe in giving back to the environment many folds than what we take from it."
            isVisible={isVisible}
            delay={400}
          />

          <BenefitStat
            label="Water Content"
            value={6.2}
            suffix=""
            description="It is like the seed put in the soil, the more one sows, the greater the harvest. We believe in giving back to the environment many folds than what we take from it."
            isVisible={isVisible}
            delay={700}
            decimals={1}
          />
        </div>
      </div>
    </section>
  )
})
