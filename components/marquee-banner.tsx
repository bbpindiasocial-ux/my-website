"use client"

export function MarqueeBanner() {
  const items = [
    "Free shipping on orders above Rs.500",
    "100% Natural & Organic",
    "Farm Fresh Quality",
    "Cultivated With Care",
    "Premium Quality Grains",
    "Sustainably Sourced",
  ]

  // Double the items for seamless loop
  const repeatedItems = [...items, ...items, ...items, ...items]

  return (
    <div
      className="w-full overflow-hidden bg-secondary py-2"
      role="marquee"
      aria-label="Announcements"
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {repeatedItems.map((item, index) => (
          <span
            key={index}
            className="mx-6 inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] text-secondary-foreground md:mx-8"
          >
            <span
              className="mr-6 inline-block h-1 w-1 rounded-full bg-secondary-foreground/60 md:mr-8"
              aria-hidden="true"
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
