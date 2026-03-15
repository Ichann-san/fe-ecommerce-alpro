import { NextRequest, NextResponse } from "next/server"
import { products } from "@/fakedata/fakeproduct"
import {
  buildReviewerId,
  normalizeStars,
  readReviewStore,
  writeReviewStore,
} from "@/lib/server/reviewStore"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getRequestIdentity(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown-ip"
  const userAgent = request.headers.get("user-agent") || "unknown-ua"

  return {
    reviewerId: buildReviewerId(ip, userAgent),
    source: { ip, userAgent },
  }
}

function resolveBaseRating(productId: number) {
  const product = products.find((item) => item.id === productId)
  return product?.rating ?? null
}

function buildRatingSummary(baseRate: number, baseCount: number, extraStars: number, extraCount: number) {
  const totalCount = baseCount + extraCount
  const totalStars = baseRate * baseCount + extraStars

  return {
    rate: totalCount ? Number((totalStars / totalCount).toFixed(1)) : 0,
    count: totalCount,
  }
}

async function getProductIdFromParams(params: Promise<{ productId: string }>) {
  const resolved = await params
  return Number(resolved.productId)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const productId = await getProductIdFromParams(params)

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ message: "Invalid product id" }, { status: 400 })
    }

    const baseRating = resolveBaseRating(productId)
    if (!baseRating) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const store = await readReviewStore()
    const bucket = store[String(productId)] ?? {
      totalStars: 0,
      count: 0,
      reviewerIds: [],
    }

    const { reviewerId } = getRequestIdentity(request)

    return NextResponse.json({
      rating: buildRatingSummary(baseRating.rate, baseRating.count, bucket.totalStars, bucket.count),
      hasReviewed: bucket.reviewerIds.includes(reviewerId),
    })
  } catch {
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const productId = await getProductIdFromParams(params)

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ message: "Invalid product id" }, { status: 400 })
    }

    const baseRating = resolveBaseRating(productId)
    if (!baseRating) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const body = (await request.json()) as { stars?: number }
    if (typeof body?.stars !== "number") {
      return NextResponse.json({ message: "Stars is required" }, { status: 400 })
    }

    let stars: number
    try {
      stars = normalizeStars(body.stars)
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : "Invalid stars value" },
        { status: 400 }
      )
    }

    const { reviewerId } = getRequestIdentity(request)
    const store = await readReviewStore()
    const key = String(productId)
    const bucket = store[key] ?? {
      totalStars: 0,
      count: 0,
      reviewerIds: [],
    }

    if (bucket.reviewerIds.includes(reviewerId)) {
      return NextResponse.json(
        {
          message: "You have already reviewed this product",
          rating: buildRatingSummary(baseRating.rate, baseRating.count, bucket.totalStars, bucket.count),
          hasReviewed: true,
        },
        { status: 409 }
      )
    }

    const updatedBucket = {
      totalStars: bucket.totalStars + stars,
      count: bucket.count + 1,
      reviewerIds: [...bucket.reviewerIds, reviewerId],
    }

    store[key] = updatedBucket
    await writeReviewStore(store)

    return NextResponse.json({
      message: "Review submitted",
      rating: buildRatingSummary(
        baseRating.rate,
        baseRating.count,
        updatedBucket.totalStars,
        updatedBucket.count
      ),
      hasReviewed: true,
    })
  } catch {
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 })
  }
}
