"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion"

const springConfig = { stiffness: 100, damping: 20, mass: 0.8 }

function TransitionHeading() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 md:min-h-[80vh]"
    >
      <div className="relative overflow-hidden">
        {/* Ghost blurred text */}
        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
          aria-hidden="true"
        >
          <motion.h2
            className="text-center text-[clamp(3rem,12vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter"
            style={{
              color: "hsl(var(--primary))",
              filter: "blur(8px)",
            }}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={
              isInView
                ? { opacity: 0.12, clipPath: "inset(0 0% 0 0)" }
                : {}
            }
            transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
          >
            <span className="block">Delivered</span>
            <span className="block">With Precision</span>
          </motion.h2>
        </div>

        {/* Main heading */}
        <motion.h2
          className="relative z-10 text-center text-[clamp(3rem,12vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter text-primary"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
        >
          <span className="block">Delivered</span>
          <span className="block">With Precision</span>
        </motion.h2>
      </div>

      {/* Gradient fade at bottom */}
      <div
        className="pointer-events-none mt-6 h-16 w-full max-w-3xl"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--primary) / 0.08), transparent)",
        }}
        aria-hidden="true"
      />
    </div>
  )
}

function RiceGrainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const grainY = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [-120, 0]),
    springConfig
  )
  const grainOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.5], [0, 1, 1, 0])
  const grainScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.6, 1, 0.3])
  const grainRotate = useTransform(scrollYProgress, [0, 0.3], [45, 0])

  return (
    <div ref={containerRef} className="relative flex h-[30vh] items-center justify-center md:h-[40vh]">
      <motion.div
        className="relative h-32 w-16 md:h-48 md:w-24"
        style={{
          y: grainY,
          opacity: grainOpacity,
          scale: grainScale,
          rotate: grainRotate,
        }}
      >
        <Image
          src="/images/rice-grain.jpg"
          alt="Rice grain falling"
          fill
          className="object-contain drop-shadow-lg"
          unoptimized
        />
      </motion.div>
    </div>
  )
}

function ProductBags() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [40, -40]),
    springConfig
  )

  const bagVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (custom: { delay: number; x: number }) => ({
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        delay: custom.delay,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 0.8,
      },
    }),
  }

  return (
    <div ref={ref} className="relative px-6 py-12 md:px-12 md:py-20">
      <motion.div
        className="mx-auto flex max-w-5xl items-end justify-center gap-0"
        style={{ y: parallaxY }}
      >
        {/* Yellow Bag - Left */}
        <motion.div
          className="relative z-10 w-[30%] max-w-[320px]"
          variants={bagVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={{ delay: 0.3, x: -60 }}
          style={!isInView ? { x: -60 } : undefined}
        >
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-96-hGGXNQH7kZ9QTdUgwv0YergS2TPyEB.png"
              alt="Keerthi Nirmal Jaya Rice yellow bag"
              width={400}
              height={600}
              className="h-auto w-full object-contain"
              unoptimized
              style={{ clipPath: "inset(0 55% 0 0)" }}
            />
            {/* Soft shadow */}
            <div
              className="absolute -bottom-3 left-1/2 h-4 w-[80%] -translate-x-1/2 rounded-[50%] bg-foreground/10 blur-md"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Red Bag - Center */}
        <motion.div
          className="relative z-20 -mx-[8%] w-[38%] max-w-[380px] md:-mx-[5%]"
          variants={bagVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={{ delay: 0, x: 0 }}
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
            {/* Soft shadow */}
            <div
              className="absolute -bottom-4 left-1/2 h-5 w-[85%] -translate-x-1/2 rounded-[50%] bg-foreground/12 blur-lg"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Blue Bag - Right */}
        <motion.div
          className="relative z-10 w-[30%] max-w-[320px]"
          variants={bagVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={{ delay: 0.3, x: 60 }}
          style={!isInView ? { x: 60 } : undefined}
        >
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame-100-PpYr5t3HooHC7CjGLi8QCO9f7W8TkG.png"
              alt="Keerthi Nirmal Short Grain Matta blue bag"
              width={400}
              height={600}
              className="h-auto w-full object-contain"
              unoptimized
              style={{ clipPath: "inset(0 0 0 45%)" }}
            />
            {/* Soft shadow */}
            <div
              className="absolute -bottom-3 left-1/2 h-4 w-[80%] -translate-x-1/2 rounded-[50%] bg-foreground/10 blur-md"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function DeliveredSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background">
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

      {/* Section 3: Transition Heading */}
      <TransitionHeading />

      {/* Section 4: Rice grain animation + Product Bags */}
      <RiceGrainAnimation />
      <ProductBags />
    </section>
  )
}
