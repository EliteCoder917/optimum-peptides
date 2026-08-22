"use client";

import { useState } from "react";
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {["All", ...categoriesWithProducts].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                activeCategory === category
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter..."
            aria-label="Filter collection"
            className="h-10 w-48 rounded-full border border-border bg-secondary/60 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => {
          const priceCents = getDisplayPriceCents(product);

          return (
            <article
              key={product.id}
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
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}
            </article>
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
