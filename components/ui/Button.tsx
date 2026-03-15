"use client"

import React from "react"

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "rounded-lg bg-(--primary) px-5 py-2 font-medium text-white shadow-sm transition hover:brightness-110",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  )
}