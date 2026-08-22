"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customerEmail: email,
        shippingAddress: {
          fullName,
          line1,
          line2,
          city,
          state,
          postalCode,
          country,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong placing your order.");
      setSubmitting(false);
      return;
    }

    const { orderId } = await response.json();
    clear();
    router.push(`/order-confirmation/${orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <Link
            href="/shop"
            className="mt-5 inline-flex rounded-full bg-metal-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse the Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="text-4xl font-bold">Checkout</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address line 1</label>
              <input
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Address line 2 (optional)
              </label>
              <input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <input
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Postal code</label>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Country</label>
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-full bg-metal-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="panel h-fit rounded-2xl p-6">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.productName} ({item.variantName}) × {item.quantity}
                  </span>
                  <span>{formatPrice(item.priceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
