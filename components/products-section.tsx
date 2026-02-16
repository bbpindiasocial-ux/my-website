"use client"

import { useEffect, useRef, useState, useCallback, forwardRef } from "react"
import Image from "next/image"

const products = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-16_151843-removebg-preview-PixHm0WmjqFEhTsbdVaLFW7kHfNxte.png",
    alt: "Keerthi Nirmal Pure Coconut Oil packet",
    label: "COCONUT OIL",
    delay: "0.9s",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-16_151534-removebg-preview-9rGQGLOyf5Otv3epD4BGXnbCcdr5sO.png",
    alt: "Keerthi Nirmal Refined Crystal Salt",
    label: "SALT",
    delay: "0.6s",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-14_114000-removebg-preview-removebg-preview-3lMF5e5XOzqJTmtBKeCYCwoY4jOYqy.png",
    alt: "Keerthi Nirmal Long Grain Matta rice bag",
    label: "LONG GRAIN MATTA",
    delay: "0.3s",
    isCenter: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-16_151714-removebg-preview-PgFRA58sAHnbOheKhNE9nYi6oSwV5t.png",
    alt: "Keerthi Nirmal Jaggery Powder",
    label: "JAGGERY",
    delay: "0.6s",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-02-16_151744-removebg-preview-x8dJTJcKvHSMqtBsCQezbEjGoLi3B5.png",
    alt: "Keerthi Nirmal Cool Pure Coconut Oil bottle",
    label: "COCONUT OIL",
    delay: "0.9s",
  },
]

export const ProductsSection = forwardRef<HTMLElement>(
  function ProductsSection(_, forwardedRef) {
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
        threshold: 0.3,
      })
      observer.observe(el)
      return () => observer.disconnect()
    }, [handleIntersection])

    return (
      <section ref={setRef} className="relative bg-background">
        {/* Top half - green background with heading */}
        <div className="relative bg-primary px-6 pb-32 pt-16 md:pb-40 md:pt-20 lg:pb-48 lg:pt-24">
          <h2
            className="text-center text-[clamp(1.8rem,6vw,5rem)] font-black uppercase italic leading-[0.9] tracking-tight text-primary-foreground"
            style={{
              clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
            }}
          >
            <span className="block">Every Grain Carries</span>
            <span className="block">The Pride of Hard Work</span>
          </h2>
        </div>

        {/* Products row - overlaps the green/cream boundary */}
        <div className="relative -mt-20 px-4 md:-mt-28 lg:-mt-36">
          <div className="mx-auto flex max-w-5xl items-end justify-center gap-2 md:gap-4 lg:gap-6">
            {products.map((product, i) => (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                  transitionDelay: product.delay,
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: product.isCenter
                      ? "clamp(100px, 14vw, 180px)"
                      : "clamp(70px, 10vw, 130px)",
                  }}
                >
                  <Image
                    src={product.src}
                    alt={product.alt}
                    width={300}
                    height={400}
                    className="h-auto w-full object-contain drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <span
                  className="mt-3 text-center text-[clamp(0.55rem,1vw,0.85rem)] font-bold uppercase tracking-wide text-foreground"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.5s ease-out",
                    transitionDelay: `calc(${product.delay} + 0.3s)`,
                  }}
                >
                  {product.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text - giving back */}
        <div className="px-6 pb-16 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
          <h3
            className="text-balance text-center text-[clamp(1.6rem,5vw,4rem)] font-black uppercase italic leading-[0.95] tracking-tight text-primary"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
              transitionDelay: "1.2s",
            }}
          >
            <span className="block">It is All About</span>
            <span className="block">Giving Back.</span>
          </h3>
          <p
            className="mx-auto mt-4 max-w-xl text-balance text-center text-[clamp(0.8rem,1.2vw,1rem)] leading-relaxed text-muted-foreground md:mt-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
              transitionDelay: "1.5s",
            }}
          >
            It is like the seed put in the soil - the more one sows, the greater the harvest. We believe in giving back to the environment many folds than what we take from it.
          </p>
        </div>
      </section>
    )
  }
)
