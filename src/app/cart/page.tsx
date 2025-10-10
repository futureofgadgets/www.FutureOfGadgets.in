import type { Metadata } from "next"
import CartView from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your cart and proceed to checkout.",
  alternates: { canonical: "/cart" },
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">Review your items and checkout when ready</p>
        </header>
        <CartView />
      </div>
    </main>
  )
}
