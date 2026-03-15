export interface ReviewSummary {
  rating: {
    rate: number
    count: number
  }
  hasReviewed: boolean
  message?: string
}

export async function getProductReviewSummary(productId: number): Promise<ReviewSummary> {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load reviews")
  }

  return res.json()
}

export async function submitProductReview(productId: number, stars: number): Promise<ReviewSummary> {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stars }),
  })

  const data = (await res.json()) as ReviewSummary

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit review")
  }

  return data
}
