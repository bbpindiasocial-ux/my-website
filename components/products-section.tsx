"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const products = [
  {
    name: "Jaya Rice",
    tagline: "The Golden Classic",
    weight: "5 Kg / 10 Kg / 25 Kg",
    description:
      "A traditional favorite known for its golden hue and soft texture. Perfect for everyday meals and special occasions alike.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-96-hGGXNQH7kZ9QTdUgwv0YergS2TPyEB.png",
  },
  {
    name: "Long Grain Matta",
    tagline: "The Wholesome Grain",
    weight: "5 Kg / 10 Kg / 25 Kg",
    description:
      "Rich in fiber and nutrients, our Long Grain Matta retains its natural bran layer for a hearty, earthy flavor.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-89-nTsRrpdjrkJrI5ZzXRkp20Bukg02rh.png",
  },
  {
    name: "Short Grain Matta",
    tagline: "The Traditional Choice",
    weight: "5 Kg / 10 Kg / 25 Kg",
    description:
      "A staple of Kerala cuisine. Perfectly textured with a robust flavor that pairs beautifully with curries and stews.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-100-PpYr5t3HooHC7CjGLi8QCO9f7W8TkG.png",
  },
]

export function ProductsSection() {
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
      id="products"
      className="relative overflow-hidden bg-background px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <p
              className={`mb-2 text-base italic text-muted-foreground transition-all duration-700 ease-out md:text-lg ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                transitionDelay: "100ms",
              }}
            >
              Our collection
            </p>
            <h2
              className="text-4xl font-black uppercase leading-[0.88] tracking-tighter text-primary md:text-5xl lg:text-6xl xl:text-7xl"
              style={{
                clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
              }}
            >
              <span className="block">Explore</span>
              <span className="block">Our Range</span>
            </h2>
          </div>
          <a
            href="#"
            className={`group inline-flex items-center gap-2 border-b border-primary pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-primary transition-all duration-500 hover:gap-4 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            View All Products
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`group cursor-pointer transition-all duration-700 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-14 opacity-0"
              }`}
              style={{ transitionDelay: `${300 + index * 180}ms` }}
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden bg-muted/40 p-10 md:p-8 lg:p-12">
                <div className="relative mx-auto w-[55%] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105 md:w-[65%]">
                  <Image
                    src={product.image}
                    alt={`Keerthi Nirmal ${product.name}`}
                    width={400}
                    height={600}
                    className="h-auto w-full object-contain drop-shadow-xl"
                    unoptimized
                  />
                </div>
              </div>

              {/* Product Info */}
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {product.tagline}
                </p>
                <h3 className="mb-1.5 text-xl font-black uppercase tracking-tight text-foreground md:text-lg lg:text-xl">
                  {product.name}
                </h3>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {product.weight}
                </p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
