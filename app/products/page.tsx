"use client"

import { Suspense } from "react"
import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/product/ProductCard"
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton"
import { useSearchParams } from "next/navigation"

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")
  const { data, isLoading } = useProducts(selectedCategory ?? undefined)

  if (isLoading)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">Loading curated items...</p>
        </div>

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          "
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            {selectedCategory
              ? `Showing category: ${selectedCategory}`
              : "Explore all available products"}
          </p>
        </div>

        <p className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
          {data?.length ?? 0} items
        </p>
      </div>

      {!data?.length && (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-6 py-10 text-center text-gray-600">
          No products found for this category.
        </div>
      )}

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
        "
      >
        {data?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

function ProductsPageFallback() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Products</h1>
        <p className="mt-2 text-sm text-gray-600">Loading curated items...</p>
      </div>

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
        "
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}