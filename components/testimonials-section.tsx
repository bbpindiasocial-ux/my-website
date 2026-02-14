"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Keerthi Nirmal rice is the only brand my family trusts. The quality is consistently excellent, and you can taste the difference in every meal.",
    name: "Priya Menon",
    location: "Kochi, Kerala",
    rating: 5,
  },
  {
    quote:
      "As a restaurant owner, I need rice that cooks perfectly every time. Keerthi Nirmal Long Grain Matta has never let me down. My customers love it.",
    name: "Rajesh Kumar",
    location: "Trivandrum, Kerala",
    rating: 5,
  },
  {
    quote:
      "The packaging keeps the rice fresh for weeks. I switched from another brand six months ago and will never go back. Pure, clean, and flavorful.",
    name: "Lakshmi Nair",
    location: "Kozhikode, Kerala",
    rating: 5,
  },
]

export function TestimonialsSection() {
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
      className="relative overflow-hidden bg-muted/40 px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-24">
          <p
            className={`mb-2 text-base italic text-muted-foreground transition-all duration-700 ease-out md:text-lg ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              transitionDelay: "100ms",
            }}
          >
            Trusted by thousands
          </p>
          <h2
            className="text-4xl font-black uppercase leading-[0.88] tracking-tighter text-primary md:text-5xl lg:text-6xl xl:text-7xl"
            style={{
              clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
            }}
          >
            <span className="block">What Our</span>
            <span className="block">Customers Say</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`relative flex flex-col justify-between border border-border/60 bg-background p-8 transition-all duration-700 ease-out md:p-10 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              {/* Stars */}
              <div className="mb-6 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-secondary text-secondary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-8 flex-1 text-[15px] leading-relaxed text-foreground/75">
                {`"${testimonial.quote}"`}
              </blockquote>

              {/* Author */}
              <div>
                <div className="mb-4 h-px w-full bg-border/60" />
                <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-[11px] tracking-wider text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
