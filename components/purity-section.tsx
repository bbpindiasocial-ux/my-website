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
  const count = useCountUp(value, 1800, isVisible, decimals)
  const [showStat, setShowStat] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => setShowStat(true), delay)
    return () => clearTimeout(timer)
  }, [isVisible, delay])

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        showStat ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mb-4 h-px w-full bg-foreground/15" />
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </p>
      <div className="flex items-start gap-4 lg:gap-5">
        <p className="shrink-0 text-5xl font-black leading-none tracking-tighter text-primary md:text-6xl lg:text-7xl">
          {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
          <span className="text-3xl md:text-4xl lg:text-5xl">{suffix}</span>
        </p>
        <p className="pt-2 text-[13px] leading-relaxed text-muted-foreground lg:text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}

export const PuritySection = forwardRef<HTMLElement>(function PuritySection(_, forwardedRef) {
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
      if (entries[0].isIntersecting) setIsVisible(true)
    },
    []
  )

  useEffect(() => {
    const el = localRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.12 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <section
      ref={setRef}
      className="relative overflow-hidden bg-background px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-8 xl:gap-12">
        {/* Left column: Copy */}
        <div
          className={`flex-1 transition-all duration-800 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-[50px] opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p
            className="mb-3 text-base italic text-muted-foreground md:text-lg"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Cultivated with care
          </p>
          <h2 className="mb-6 text-4xl font-black uppercase leading-[0.88] tracking-tighter text-primary md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">Purity In</span>
            <span className="block">Every Grain</span>
          </h2>
          <p className="mb-8 max-w-md text-[15px] leading-relaxed text-muted-foreground lg:text-base">
            Our meticulous sourcing process ensures the highest quality grain,
            selecting only from trusted farms across South India.{" "}
            {"That's how Keerthi Nirmal became the best rice brand in Kerala."}
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-lg md:px-8 md:py-4 md:text-sm"
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Center: Placeholder for the scroll-linked floating image */}
        <div
          className="hidden w-full max-w-[220px] flex-shrink-0 md:max-w-[260px] lg:block lg:max-w-[280px] xl:max-w-[320px]"
          aria-hidden="true"
        >
          <div className="aspect-[3/4]" />
        </div>

        {/* Right column: Benefits stats */}
        <div
          className={`flex flex-1 flex-col gap-10 transition-all duration-800 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-[50px] opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
            Benefits
          </h3>

          <BenefitStat
            label="Water Content"
            value={51}
            suffix="%"
            description="Our rice retains optimal moisture, ensuring every grain cooks to a soft, fluffy perfection that families love."
            isVisible={isVisible}
            delay={400}
          />

          <BenefitStat
            label="Glycemic Index"
            value={6.2}
            suffix=""
            description="A low glycemic option that provides sustained energy release, making it the healthier choice for daily meals."
            isVisible={isVisible}
            delay={700}
            decimals={1}
          />
        </div>
      </div>
    </section>
  )
})
