"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { useProduct } from "@/hooks/useProduct"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/context/CartContext"
import { useProductRating } from "@/hooks/useProductRating"
import { StarRating } from "@/components/ui/StarRating"
import { useToast } from "@/context/ToastContext"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data } = useProduct(id as string)
  const { addItem } = useCart()
  const { show } = useToast()
  const [pendingStars, setPendingStars] = useState(5)

  const { rating, hasReviewed, submitRating, isSubmitting } = useProductRating(data?.id)

  if (!data)
    return (
      <div className="rounded-2xl border border-white/80 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-600">Loading product details...</p>
      </div>
    )

  return (
    <div className="space-y-4">
      <Link href="/products" className="inline-flex text-sm font-medium text-(--primary) hover:underline">
        ← Back to products
      </Link>

      <div
        className="
        grid
        gap-8
        rounded-2xl
        border border-white/80
        bg-white
        p-6
        shadow-sm
        md:grid-cols-2
        md:p-8
        "
      >
        <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-6">
          <Image
            src={data.image}
            alt={data.title}
            width={320}
            height={320}
            className="h-72 object-contain"
          />
        </div>

        <div>
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-(--primary)">
            {data.category}
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">{data.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <StarRating value={rating.rate} size="sm" />
            <span>{rating.rate} · {rating.count} reviews</span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-gray-600">{data.description}</p>

          <p
            className="
            mt-8
            text-4xl
            font-black
            text-(--primary)
            "
          >
            ${data.price.toFixed(2)}
          </p>

          <div className="mt-6 max-w-xs">
            <Button
              onClick={() =>
                addItem({
                  id: data.id,
                  title: data.title,
                  price: data.price,
                  image: data.image,
                  quantity: 1,
                })
              }
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>

          {!hasReviewed && (
            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-sm font-semibold text-gray-900">Rate this product</p>
              <p className="mt-1 text-xs text-gray-600">You can submit one review per product (1 to 5 stars).</p>

              <div className="mt-3">
                <StarRating value={pendingStars} onChange={setPendingStars} />
              </div>

              <Button
                className="mt-4"
                disabled={isSubmitting}
                onClick={async () => {
                  try {
                    await submitRating(pendingStars)
                    show(
                      `Thanks! You rated this product ${pendingStars} star${pendingStars > 1 ? "s" : ""}.`
                    )
                  } catch (error) {
                    show(error instanceof Error ? error.message : "Failed to submit review")
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          {hasReviewed && (
            <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">You already reviewed this product.</p>
              <p className="mt-1 text-xs text-emerald-700/90">Thanks for your feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}