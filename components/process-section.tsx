"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Sprout, Factory, ShieldCheck, Package } from "lucide-react"

const steps = [
  {
    icon: Sprout,
    number: "01",
    title: "Sourcing",
    description:
      "We partner with trusted farmers across South India, selecting only the finest paddy fields known for rich soil and pure water sources.",
  },
  {
    icon: Factory,
    number: "02",
    title: "Milling",
    description:
      "State-of-the-art milling technology preserves the natural nutrients and texture, ensuring every grain retains its authentic flavor.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Quality Check",
    description:
      "Rigorous multi-stage testing guarantees zero impurities. Each batch is lab-verified for moisture, aroma, and grain consistency.",
  },
  {
    icon: Package,
    number: "04",
    title: "Packaging",
    description:
      "Sealed in moisture-resistant, food-grade packaging that locks in freshness from our facility straight to your kitchen.",
  },
]

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) setIsVisible(true)
    },
    []
  )

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.08 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-primary px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p
            className={`mb-2 text-base italic text-primary-foreground/60 transition-all duration-700 ease-out md:text-lg ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              transitionDelay: "100ms",
            }}
          >
            How we do it
          </p>
          <h2
            className="text-4xl font-black uppercase leading-[0.88] tracking-tighter text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl"
            style={{
              clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
            }}
          >
            <span className="block">From Farm</span>
            <span className="block">To Table</span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`group relative transition-all duration-700 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Large step number */}
                <span className="mb-5 block text-7xl font-black tracking-tighter text-primary-foreground/8 md:text-8xl">
                  {step.number}
                </span>

                {/* Icon circle */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors duration-300 group-hover:bg-primary-foreground/10">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </div>

                {/* Divider */}
                <div className="mb-5 h-px w-full bg-primary-foreground/15" />

                {/* Title */}
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-relaxed text-primary-foreground/55">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
