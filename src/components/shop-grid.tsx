"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getDisplayPriceCents,
  PRODUCT_CATEGORIES,
} from "@/lib/product-helpers";
import type { Product } from "@/types";

export default function ShopGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categoriesWithProducts = PRODUCT_CATEGORIES.filter((category) =>
    products.some((product) => product.categories.includes(category)),
  );

  const visible = products.filter(
    (product) =>
      (activeCategory === "All" ||
        product.categories.includes(activeCategory)) &&
      (query.trim() === "" ||
        product.name.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-center lg:gap-6">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the catalogue…"
          aria-label="Search the catalogue"
          className="h-10 w-full shrink-0 rounded-full border border-border bg-secondary/60 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary lg:w-56"
        />

        {/* Below lg these scroll horizontally instead of wrapping: nine
            long labels stacked one per row pushed the grid off-screen.
            Bleeds to the viewport edge so the strip reads as scrollable. */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:min-w-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
          {["All", ...categoriesWithProducts].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:tracking-[0.16em] ${
                activeCategory === category
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* "Metabolic Research" → "Metabolic": the page is already
                  headed "Research Catalogue", so the suffix on every pill
                  is dead width. */}
              {category.replace(/ Research$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => {
          const priceCents = getDisplayPriceCents(product);

          return (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="panel group flex flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                </div>

                {priceCents !== null && (
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                    From ${(priceCents / 100).toFixed(2)}
                  </span>
                )}
              </div>

              {product.imageUrls[0] && (
                <div className="my-6 aspect-square overflow-hidden rounded-xl bg-black/10">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              {product.description && (
                <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-amber-500/80">
                Research use only — not for human consumption
              </p>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          {products.length === 0
            ? "No products yet — check back soon."
            : "No products match your filter."}
        </p>
      )}
    </>
  );
}
