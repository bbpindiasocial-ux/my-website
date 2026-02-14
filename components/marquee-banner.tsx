"use client"

export function MarqueeBanner() {
  const items = [
    "Free shipping on orders above Rs.500",
    "100% Natural & Organic",
    "Farm Fresh Quality",
    "Cultivated With Care",
    "Premium Quality Seeds",
    "Sustainably Sourced",
  ]

  const repeatedItems = [...items, ...items]

  return (
    <div className="w-full overflow-hidden bg-secondary py-1.5">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeatedItems.map((item, index) => (
          <span
            key={index}
            className="mx-8 text-xs font-semibold uppercase tracking-wider text-secondary-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
