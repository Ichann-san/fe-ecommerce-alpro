"use client"

import Link from "next/link"
import { useCategories } from "@/hooks/useCategories"
import type { Category } from "@/types/product"

export default function CategoriesPage() {
  const { data } = useCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Categories</h1>
        <p className="mt-2 text-sm text-gray-600">Pick a category to narrow your shopping experience.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((c: Category) => (
          <Link
            key={c.id}
            href={`/products?category=${encodeURIComponent(c.name)}`}
            className="group rounded-2xl border border-white/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
          >
            <p className="text-sm text-gray-500">Category</p>
            <h2 className="mt-1 text-xl font-semibold capitalize text-gray-900 transition group-hover:text-(--primary)">
              {c.name}
            </h2>
            <p className="mt-3 text-sm font-medium text-(--primary)">Explore products →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}