"use client"

import { useRef, forwardRef, useCallback } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion"

const springConfig = { stiffness: 80, damping: 18, mass: 0.8 }

/* ------------------------------------------------------------------ */
/*  Transition Heading                                                 */
/* ------------------------------------------------------------------ */
function TransitionHeading() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 md:min-h-[70vh]"
    >
      <div className="relative overflow-hidden">
        {/* Ghost blurred text */}
        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
          aria-hidden="true"
        >
          <motion.h2
            className="text-center text-[clamp(2.5rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter"
            style={{ color: "hsl(var(--primary))", filter: "blur(8px)" }}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { opacity: 0.12, clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
          >
            <span className="block">Delivered</span>
            <span className="block">With Precision</span>
          </motion.h2>
        </div>

        {/* Main heading */}
        <motion.h2
          className="relative z-10 text-center text-[clamp(2.5rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
        >
          <span className="block">Delivered</span>
          <span className="block">With Precision</span>
        </motion.h2>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Product Bags                                                       */
/* ------------------------------------------------------------------ */
function ProductBags() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [30, -30]),
    springConfig
  )

  return (
    <div ref={ref} className="relative px-6 py-16 md:px-12 md:py-24">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:gap-0"
        style={{ y: parallaxY }}
      >
        {/* Yellow Bag - slides in from left */}
        <motion.div
          className="relative z-10 w-[60%] max-w-[280px] md:w-[30%] md:max-w-[320px]"
          initial={{ opacity: 0, x: -120, y: 40 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: -120, y: 40 }
          }
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 70,
            damping: 14,
            mass: 0.8,
          }}
        >
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-96-hGGXNQH7kZ9QTdUgwv0YergS2TPyEB.png"
              alt="Keerthi Nirmal Jaya Rice yellow bag"
              width={400}
              height={600}
              className="h-auto w-full object-contain"
              unoptimized
            />
            {/* Soft elliptical shadow */}
            <div
              className="absolute -bottom-3 left-1/2 h-4 w-[80%] -translate-x-1/2 rounded-[50%] blur-md"
              style={{ backgroundColor: "hsl(var(--foreground) / 0.1)" }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Red Bag - center, appears first (landing spot for the floating image) */}
        <motion.div
          className="relative z-20 w-[70%] max-w-[340px] md:-mx-[6%] md:w-[38%] md:max-w-[380px]"
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 60, scale: 0.85 }
          }
          transition={{
            duration: 1.1,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 75,
            damping: 15,
            mass: 0.8,
          }}
        >
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-89-nTsRrpdjrkJrI5ZzXRkp20Bukg02rh.png"
              alt="Keerthi Nirmal Long Grain Matta red bag"
              width={500}
              height={750}
              className="h-auto w-full object-contain drop-shadow-2xl"
              unoptimized
            />
            {/* Soft elliptical shadow */}
            <div
              className="absolute -bottom-4 left-1/2 h-5 w-[85%] -translate-x-1/2 rounded-[50%] blur-lg"
              style={{ backgroundColor: "hsl(var(--foreground) / 0.12)" }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Blue Bag - slides in from right */}
        <motion.div
          className="relative z-10 w-[60%] max-w-[280px] md:w-[30%] md:max-w-[320px]"
          initial={{ opacity: 0, x: 120, y: 40 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: 120, y: 40 }
          }
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 70,
            damping: 14,
            mass: 0.8,
          }}
        >
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-100-PpYr5t3HooHC7CjGLi8QCO9f7W8TkG.png"
              alt="Keerthi Nirmal Short Grain Matta blue bag"
              width={400}
              height={600}
              className="h-auto w-full object-contain"
              unoptimized
            />
            {/* Soft elliptical shadow */}
            <div
              className="absolute -bottom-3 left-1/2 h-4 w-[80%] -translate-x-1/2 rounded-[50%] blur-md"
              style={{ backgroundColor: "hsl(var(--foreground) / 0.1)" }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Delivered Section                                                  */
/* ------------------------------------------------------------------ */
export const DeliveredSection = forwardRef<HTMLElement>(
  function DeliveredSection(_, forwardedRef) {
    const localRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start end", "end start"],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

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

    return (
      <section ref={setRef} className="relative overflow-hidden bg-background">
        {/* Subtle parallax background pattern */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ y: backgroundY }}
          aria-hidden="true"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 80% 50%, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        {/* Heading */}
        <TransitionHeading />

        {/* Product Bags */}
        <ProductBags />
      </section>
    )
  }
)
