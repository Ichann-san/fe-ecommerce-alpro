export interface ReviewSummary {
  rating: {
    rate: number
    count: number
  }
  hasReviewed: boolean
  message?: string
}

async function readReviewResponse(res: Response): Promise<ReviewSummary> {
  const raw = await res.text()

  try {
    return JSON.parse(raw) as ReviewSummary
  } catch {
    throw new Error(`Review API returned non-JSON response (status ${res.status})`)
  }
}

export async function getProductReviewSummary(productId: number): Promise<ReviewSummary> {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "GET",
    cache: "no-store",
  })

  const data = await readReviewResponse(res)

  if (!res.ok) {
    throw new Error(data.message || "Failed to load reviews")
  }

  return data
}

export async function submitProductReview(productId: number, stars: number): Promise<ReviewSummary> {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stars }),
  })

  const data = await readReviewResponse(res)

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit review")
  }

  return data
}
