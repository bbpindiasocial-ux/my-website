"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowRight } from "lucide-react"

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Our Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Blogs", href: "#blogs" },
]

const productLinks = [
  { label: "Jaya Rice", href: "#" },
  { label: "Long Grain Matta", href: "#" },
  { label: "Short Grain Matta", href: "#" },
  { label: "Basmati Rice", href: "#" },
]

const supportLinks = [
  { label: "Contact Us", href: "#contact" },
  { label: "Shipping Policy", href: "#" },
  { label: "Return Policy", href: "#" },
  { label: "FAQs", href: "#" },
]

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) setIsVisible(true)
    },
    []
  )

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative overflow-hidden bg-primary px-6 pb-8 pt-20 md:px-12 md:pt-28 lg:px-16 lg:pt-36"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* CTA + Newsletter */}
        <div className="mb-16 flex flex-col gap-12 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div
            className={`flex-1 transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2
              className="text-4xl font-black uppercase leading-[0.88] tracking-tighter text-primary-foreground md:text-5xl lg:text-6xl"
              style={{
                clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)",
              }}
            >
              <span className="block">{"Let's Stay"}</span>
              <span className="block">Connected</span>
            </h2>
          </div>
          <div
            className={`w-full max-w-md transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <p className="mb-4 text-[13px] leading-relaxed text-primary-foreground/55">
              Subscribe to our newsletter for recipes, updates, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground placeholder-primary-foreground/35 outline-none transition-colors focus:border-primary-foreground/40"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary-foreground px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary transition-opacity hover:opacity-90"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-12 h-px w-full bg-primary-foreground/10" />

        {/* Links Grid */}
        <div
          className={`mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:gap-12 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary-foreground/60">
                Keerthi
              </span>
              <span className="text-xl font-black uppercase tracking-tight text-primary-foreground">
                nirmal
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-primary-foreground/45">
              Cultivated with care, delivered with precision. Premium quality rice from the heart of Kerala.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-primary-foreground/55 transition-colors duration-200 hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">
              Products
            </h4>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-primary-foreground/55 transition-colors duration-200 hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-primary-foreground/55 transition-colors duration-200 hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/8 pt-8 md:flex-row">
          <p className="text-[11px] text-primary-foreground/35">
            &copy; {new Date().getFullYear()} Keerthi Nirmal. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[11px] text-primary-foreground/35 transition-colors hover:text-primary-foreground/60"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[11px] text-primary-foreground/35 transition-colors hover:text-primary-foreground/60"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
