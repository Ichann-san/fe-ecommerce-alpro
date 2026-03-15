"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductReviewSummary, submitProductReview } from "@/lib/api/review"

export function useProductRating(productId?: number) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["product-rating", productId],
    queryFn: () => getProductReviewSummary(productId as number),
    enabled: typeof productId === "number",
    staleTime: 0,
  })

  const mutation = useMutation({
    mutationFn: (stars: number) => submitProductReview(productId as number, stars),
    onSuccess: (data) => {
      queryClient.setQueryData(["product-rating", productId], data)
      queryClient.invalidateQueries({ queryKey: ["product-rating", productId] })
    },
  })

  return {
    rating: query.data?.rating ?? { rate: 0, count: 0 },
    hasReviewed: query.data?.hasReviewed ?? false,
    isLoading: query.isLoading,
    submitRating: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  }
}
