import { promises as fs } from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"

export interface StoredReviewBucket {
  totalStars: number
  count: number
  reviewerIds: string[]
}

export type ReviewStore = Record<string, StoredReviewBucket>

const REVIEW_FILE = process.env.VERCEL
  ? path.join("/tmp", "alproshop-reviews.json")
  : path.join(process.cwd(), "data", "reviews.json")

let memoryStore: ReviewStore = {}

async function ensureReviewFile() {
  try {
    const dir = path.dirname(REVIEW_FILE)
    await fs.mkdir(dir, { recursive: true })

    await fs.access(REVIEW_FILE)
    return true
  } catch {
    try {
      await fs.writeFile(REVIEW_FILE, "{}", "utf-8")
      return true
    } catch {
      return false
    }
  }
}

export async function readReviewStore(): Promise<ReviewStore> {
  const canUseFile = await ensureReviewFile()
  if (!canUseFile) return memoryStore

  try {
    const raw = await fs.readFile(REVIEW_FILE, "utf-8")
    const parsed = JSON.parse(raw) as ReviewStore
    memoryStore = parsed ?? {}
    return memoryStore
  } catch {
    return memoryStore
  }
}

export async function writeReviewStore(store: ReviewStore) {
  memoryStore = store

  const canUseFile = await ensureReviewFile()
  if (!canUseFile) return

  try {
    await fs.writeFile(REVIEW_FILE, JSON.stringify(store, null, 2), "utf-8")
  } catch {
    // Keep memory fallback when persistent write fails.
  }
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
