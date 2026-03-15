import Link from "next/link"

export default function HomePage() {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/80 bg-white px-6 py-10 shadow-sm sm:px-10">
      <div className="max-w-2xl">
        <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-(--primary)">
          New Season Picks
        </p>

        <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
          Premium gadgets, curated for everyday performance.
        </h1>

        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Discover modern tech essentials with clean design, reliable quality, and transparent pricing.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Browse Products
          </Link>

          <Link
            href="/categories"
            className="rounded-lg border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
          >
            Explore Categories
          </Link>
        </div>
      </div>
    </section>
  )
}