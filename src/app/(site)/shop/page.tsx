"use client";

import { useState } from "react";

const categories = ["All", "Blends", "Singles", "Kits", "Accessories"];

const products = [
  {
    name: "...",
    size: "...",
    category: "Singles",
    image: "/images/vial.png",
  },
  {
    name: "...",
    size: "...",
    category: "Singles",
    image: "/images/vial.png",
  },
  {
    name: "...",
    size: "...",
    category: "Singles",
    image: "/images/box.png",
  },
  {
    name: "...",
    size: "...",
    category: "Blends",
    image: "/images/vial.png",
  },
  {
    name: "...",
    size: "...",
    category: "Blends",
    image: "/images/box.png",
  },
  {
    name: "...",
    size: "...",
    category: "Kits",
    image: "/images/box.png",
  },
  {
    name: "...",
    size: "...",
    category: "Kits",
    image: "/images/vial.png",
  },
  {
    name: "...",
    size: "...",
    category: "Accessories",
    image: "/images/box.png",
  },
  {
    name: "...",
    size: "...",
    category: "Accessories",
    image: "/images/vial.png",
  },
];

export default function Shop() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const visible = products.filter(
    (product) =>
      (active === "All" || product.category === active) &&
      (query.trim() === "" ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div id="top" className="min-h-screen bg-background">
      <main>
        {/* SHOP HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <img
            src="/images/hero.png"
            alt="Optimum Peptides catalogue"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />

          <div className="relative mx-auto max-w-7xl px-5 py-20">
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
              Browse
            </p>

            <h1 className="mt-3 text-5xl font-bold sm:text-6xl">
              <span className="text-brand-gradient">Our Collection</span>
            </h1>

            <p className="mt-5 max-w-lg text-muted-foreground">
              Explore our range of peptides and browse by category to find
              exactly what you need.
            </p>
          </div>
        </section>

        {/* FILTERS */}
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    active === category
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

          {/* COLLECTION GRID */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => (
              <article
                key={`${product.name}-${index}`}
                className="panel group flex flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>

                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {product.category}
                    </p>
                  </div>

                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {product.size}
                  </span>
                </div>

                <div className="my-6 overflow-hidden rounded-xl bg-black/10">
                  <img
                    src={product.image}
                    alt=""
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-auto border-t border-border pt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-primary">
                    ...
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* NO RESULTS */}
          {visible.length === 0 && (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              ...
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
