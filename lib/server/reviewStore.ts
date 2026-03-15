import { promises as fs } from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"

export interface StoredReviewBucket {
  totalStars: number
  count: number
  reviewerIds: string[]
}

export type ReviewStore = Record<string, StoredReviewBucket>

const REVIEW_FILE = path.join(process.cwd(), "data", "reviews.json")

async function ensureReviewFile() {
  const dir = path.dirname(REVIEW_FILE)
  await fs.mkdir(dir, { recursive: true })

  try {
    await fs.access(REVIEW_FILE)
  } catch {
    await fs.writeFile(REVIEW_FILE, "{}", "utf-8")
  }
}

export async function readReviewStore(): Promise<ReviewStore> {
  await ensureReviewFile()

  try {
    const raw = await fs.readFile(REVIEW_FILE, "utf-8")
    const parsed = JSON.parse(raw) as ReviewStore
    return parsed ?? {}
  } catch {
    return {}
  }
}

export async function writeReviewStore(store: ReviewStore) {
  await ensureReviewFile()
  await fs.writeFile(REVIEW_FILE, JSON.stringify(store, null, 2), "utf-8")
}

export function buildReviewerId(ip: string, userAgent: string) {
  return createHash("sha256").update(`${ip}|${userAgent}`).digest("hex")
}

export function normalizeStars(stars: number) {
  const normalized = Math.round(stars)

  if (normalized < 1 || normalized > 5) {
    throw new Error("Rating must be between 1 and 5 stars")
  }

  return normalized
}
