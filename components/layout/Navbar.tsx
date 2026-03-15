"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/CartContext"

export function Navbar() {
  const { items } = useCart()
  const pathname = usePathname()

  const navLinkClass = (href: string) =>
    [
      "rounded-md px-3 py-2 transition",
      pathname === href
        ? "bg-white text-(--primary) shadow-sm"
        : "text-gray-700 hover:bg-white/70 hover:text-(--primary)",
    ].join(" ")

  return (
    <nav
      className="
      sticky top-0 z-50
      border-b border-white/60
      bg-white/80
      backdrop-blur-md
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        flex
        items-center
        justify-between
        px-6
        py-4
        "
      >
        <Link
          href="/"
          className="
          text-xl
          font-bold
          text-(--primary)
          tracking-tight
          "
        >
          AlproShop
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium">
          <Link href="/products" className={navLinkClass("/products")}>Products</Link>
          <Link href="/categories" className={navLinkClass("/categories")}>Categories</Link>

          <Link
            href="/cart"
            className="
            rounded-md
            border border-blue-100
            bg-(--secondary)
            px-3 py-2
            text-gray-900
            transition
            hover:brightness-105
            "
          >
            Cart
            <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-(--primary)">
              {items.length}
            </span>
          </Link>

        </div>
      </div>
    </nav>
  )
}