import { getProducts } from "@/lib/products";
import { getDisplayPriceCents } from "@/lib/product-helpers";

export default async function Home() {
  const products = (await getProducts()).slice(0, 6);

  return (
    <div id="top" className="min-h-screen bg-background">
      <main>
        {/* HERO */}
        <section className="relative min-h-[700px] overflow-hidden">
          <img
            src="/images/hero.png"
            alt="Optimum Peptides"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />

          <div className="grid-lines absolute inset-0 opacity-60" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
            {/* LEFT SIDE */}
            <div>
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-primary">
                Premium Peptides
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">
                <span className="text-brand-gradient">Premium Peptides</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                Optimum Peptides is your straightforward source for high-quality
                peptides, with easy ordering and fast shipping.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {["Blends", "Singles", "Kits", "Accessories"].map((chip) => (
                  <div
                    key={chip}
                    className="panel rounded-xl px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {chip}
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <a
                  href="/shop"
                  className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Explore Product Range
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="relative">
              <div className="glow-ring panel relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <img
                  src="/images/box.png"
                  alt="Optimum Peptides packaging"
                  className="w-full rounded-[1.5rem] object-cover"
                />

                <div className="h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-6">
            {[
              "Fast shipping",
              "Secure checkout",
              "Wide selection",
              "Easy returns",
              "Friendly support",
            ].map((item) => (
              <div
                key={item}
                className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <span className="mr-2 text-primary">✦</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* COLLECTION */}
        <section id="collection" className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
                Our Collection
              </p>

              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Explore our collection
              </h2>
            </div>

            <a
              href="/shop"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
            >
              Explore More
            </a>
          </div>

          {products.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const priceCents = getDisplayPriceCents(product);

                return (
                  <article
                    key={product.id}
                    className="panel group overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    {product.imageUrl && (
                      <div className="p-4">
                        <div className="overflow-hidden rounded-xl">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}

                    <div className="px-6 pb-6 pt-1">
                      <div className="border-t border-border pt-5">
                        <h3 className="text-lg font-semibold">
                          {product.name}
                        </h3>
                        {priceCents !== null && (
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
                            From ${(priceCents / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-12 text-sm text-muted-foreground">
              No products yet — check back soon.
            </p>
          )}
        </section>

        {/* CLOSING CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to shop?</h2>

            <p className="mt-5 text-muted-foreground">
              Browse the full collection, or get in touch if you have a question
              first.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/shop"
                className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
              >
                Browse the Collection
              </a>

              <a
                href="/contact"
                className="inline-flex rounded-full border border-border px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
