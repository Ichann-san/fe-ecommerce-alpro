"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  const { items, removeItem } = useCart()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!items.length) {
    return (
      <section className="rounded-2xl border border-dashed border-blue-200 bg-white px-6 py-12 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Your cart is empty</h1>
        <p className="mt-3 text-sm text-gray-600">Add products to start building your order.</p>

        <Link
          href="/products"
          className="mt-6 inline-flex rounded-lg bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Browse Products
        </Link>
      </section>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <section className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Cart</h1>

        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center justify-between rounded-xl border border-white/80 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
              <p className="mt-2 text-sm font-bold text-(--primary)">${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="rounded-md border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <aside className="h-fit rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-black text-(--primary)">${total.toFixed(2)}</p>
        </div>
      </aside>
    </div>
  )
}