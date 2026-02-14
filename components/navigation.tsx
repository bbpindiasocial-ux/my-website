"use client"

import { useState } from "react"
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

  return (
    <header className="relative z-50 w-full px-6 py-6 lg:px-12 lg:py-8">
      <nav className="flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <a href="#" className="flex-shrink-0" aria-label="Keerthi Nirmal home">
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary md:text-xs">
              Keerthi
            </span>
            <span className="text-2xl font-black tracking-tight text-primary md:text-3xl lg:text-4xl">
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
                className={`text-xs font-medium uppercase tracking-wider transition-colors duration-200 hover:text-primary xl:text-sm ${
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 text-foreground transition-colors hover:text-primary"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 text-foreground transition-colors hover:text-primary"
            aria-label="User account"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 text-foreground transition-colors hover:text-primary lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background px-6 py-6 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors duration-200 hover:text-primary ${
                    item.active
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
