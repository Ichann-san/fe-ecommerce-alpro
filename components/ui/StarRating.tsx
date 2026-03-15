"use client"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: "sm" | "md"
}

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const rounded = Math.round(value)
  const starClass = size === "sm" ? "text-base" : "text-2xl"

  return (
    <div className="inline-flex items-center gap-1" aria-label={`Rating ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const active = rounded >= starValue

        if (onChange) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              className={`${starClass} leading-none transition ${
                active ? "text-amber-500" : "text-gray-300"
              } hover:scale-105`}
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              ★
            </button>
          )
        }

        return (
          <span
            key={starValue}
            className={`${starClass} leading-none ${active ? "text-amber-500" : "text-gray-300"}`}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
