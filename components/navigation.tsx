"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"

const navItems = [
  { label: "HOME", href: "#", active: true },
  { label: "ABOUT US", href: "#about" },
  { label: "OUR STORY", href: "#story" },
  { label: "PROCESS", href: "#process" },
  { label: "BLOGS", href: "#blogs" },
  { label: "CONTACT US", href: "#contact" },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12 lg:py-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#" className="flex-shrink-0" aria-label="Keerthi Nirmal home">
          <div className="flex flex-col leading-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary md:text-[10px]">
              Keerthi
            </span>
            <span className="text-xl font-black uppercase tracking-tight text-primary md:text-2xl lg:text-3xl">
              nirmal
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 hover:text-primary xl:text-xs ${
                  item.active ? "text-primary" : "text-foreground/60"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-2 text-foreground/70 transition-colors hover:text-primary"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button
            className="rounded-full p-2 text-foreground/70 transition-colors hover:text-primary"
            aria-label="User account"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button
            className="rounded-full p-2 text-foreground/70 transition-colors hover:text-primary lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out lg:hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border/50 bg-background px-6 py-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-primary ${
                    item.active ? "text-primary" : "text-foreground/60"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
