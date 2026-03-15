"use client"

import { Product } from "@/types/product"
import Link from "next/link"
import Image from "next/image"
import { useProductRating } from "@/hooks/useProductRating"
import { StarRating } from "@/components/ui/StarRating"

export function ProductCard({ product }: { product: Product }) {
  const { rating } = useProductRating(product.id)

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div
        className="
        h-full
        rounded-2xl
        border border-white/80
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
        cursor-pointer
        "
      >
        <div className="mb-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-(--primary)">
          {product.category}
        </div>

        <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50">
          <Image
            width={300}
            height={300}
            src={product.image}
            alt={product.title}
            className="
            h-32
            object-contain
            transition group-hover:scale-105
            "
          />
        </div>

        <h3
          className="
          mt-3
          text-sm
          font-semibold
          text-gray-900
          line-clamp-2
          "
        >
          {product.title}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <StarRating value={rating.rate} size="sm" />
          <span>
            {rating.rate} · {rating.count} reviews
          </span>
        </div>

        <p
          className="
          mt-3
          text-xl
          font-bold
          text-(--primary)
          "
        >
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}