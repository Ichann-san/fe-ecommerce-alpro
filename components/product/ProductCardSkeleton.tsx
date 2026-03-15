"use client"

export function ProductCardSkeleton() {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      border border-white/80
      p-4
      animate-pulse
      shadow-sm
      "
    >
      <div className="mb-3 h-5 w-20 rounded-full bg-blue-100" />
      <div className="h-44 rounded-xl bg-gray-100 mb-3" />
      <div className="h-4 bg-gray-200 mb-2 rounded" />
      <div className="h-4 bg-gray-200 w-1/2 rounded" />
      <div className="mt-4 h-5 w-1/3 rounded bg-blue-100" />
    </div>
  )
}