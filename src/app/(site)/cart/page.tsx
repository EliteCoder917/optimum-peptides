"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const FORM_LABELS: Record<string, string> = {
  vial: "Vial",
  pen: "Pen",
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPage() {
  const { items, subtotalCents, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="text-4xl font-bold">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-secondary/20 p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-metal-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse the Collection
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="panel flex gap-4 rounded-2xl p-4"
                >
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-black/10">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/shop/${item.productSlug}`}
                          className="font-semibold hover:text-primary"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                          {item.form ? ` · ${FORM_LABELS[item.form]}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Remove ${item.productName}`}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className="font-medium">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel h-fit rounded-2xl p-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping calculated at checkout.
              </p>

              <Link
                href="/checkout"
                className="mt-5 flex items-center justify-center rounded-full bg-metal-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
