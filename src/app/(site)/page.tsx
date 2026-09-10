import Link from "next/link";
import { getProducts, getProductBySlug } from "@/lib/products";
import { formatPrice, getDisplayPriceCents } from "@/lib/product-helpers";

// The compound given the featured slot under the hero.
//
// Fetched through getProductBySlug rather than picked out of the catalogue
// list, so the slot inherits that query's `is_active` and
// `regulatory_class = 'ruo'` filters: if this row is ever deactivated or
// reclassified 'pom', the band removes itself instead of putting the one
// product we may not advertise at the top of the front page. A missing or
// misspelled slug renders nothing, so the page is never broken by it.
const FEATURED_SLUG = "retatrutide";

export default async function Home() {
  const [allProducts, featured] = await Promise.all([
    getProducts(),
    getProductBySlug(FEATURED_SLUG),
  ]);

  const products = allProducts.slice(0, 6);
  const featuredPriceCents = featured ? getDisplayPriceCents(featured) : null;

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
                Research Chemicals
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">
                <span className="text-brand-gradient">Research Peptides</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                A reference catalogue of peptides supplied for in-vitro
                laboratory research. Every compound is listed with its
                molecular class and published mechanism of action, so you can
                find what your work calls for.
              </p>

              <p className="mt-4 max-w-lg text-xs uppercase leading-relaxed tracking-[0.1em] text-amber-500/90">
                Research use only — not for human or veterinary consumption.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {["Lyophilised", "Analytical", "Documented", "Traceable"].map((chip) => (
                  <div
                    key={chip}
                    className="panel rounded-xl px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {chip}
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <Link
                  href="/shop"
                  className="bg-metal-gradient inline-flex items-center rounded-full px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Explore Product Range
                  <span className="ml-2">→</span>
                </Link>
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

        {/* FEATURED COMPOUND */}
        {featured && (
          <section className="border-t border-border bg-card/40">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
              {featured.imageUrls[0] && (
                <div className="panel glow-ring order-last overflow-hidden rounded-[1.75rem] p-4 lg:order-first">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                    <img
                      src={featured.imageUrls[0]}
                      alt={featured.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-primary">
                  Featured compound
                </span>

                <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
                  {featured.name}
                </h2>

                {/* Admin-authored copy rather than bespoke marketing text:
                    descriptions already sit under the no-claims rule, so
                    the featured slot can't become the one place on the site
                    where a therapeutic claim gets written by hand. */}
                {featured.description && (
                  <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {featured.description}
                  </p>
                )}

                {featuredPriceCents !== null && (
                  <p className="mt-5 text-xs uppercase tracking-[0.18em] text-primary">
                    From {formatPrice(featuredPriceCents)}
                  </p>
                )}

                {/* This band carries a price, so it is a point of sale and
                    takes the statement on its own account — the hero above
                    it is not doing that job for it. */}
                <p className="mt-4 max-w-xl text-xs uppercase leading-relaxed tracking-[0.1em] text-amber-500/90">
                  Supplied for in-vitro laboratory research only — not for
                  human or veterinary consumption.
                </p>

                <div className="mt-8">
                  <Link
                    href={`/shop/${featured.slug}`}
                    className="bg-metal-gradient inline-flex items-center rounded-full px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
                  >
                    View Listing
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TRUST STRIP */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-6">
            {[
              "Research use only",
              "Documented catalogue",
              "Secure checkout",
              "Tracked dispatch",
              "Technical support",
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
                Catalogue
              </p>

              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Browse the catalogue
              </h2>
            </div>

            <Link
              href="/shop"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
            >
              Explore More
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const priceCents = getDisplayPriceCents(product);

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="panel group block overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    {product.imageUrls[0] && (
                      <div className="p-4">
                        <div className="aspect-square overflow-hidden rounded-xl">
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                            From {formatPrice(priceCents)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
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
            <h2 className="text-4xl font-bold sm:text-5xl">
              Looking for a specific compound?
            </h2>

            <p className="mt-5 text-muted-foreground">
              Browse the full catalogue, or get in touch if you have a technical
              question about a listing.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="bg-metal-gradient inline-flex rounded-full px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
              >
                Browse the Catalogue
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-full border border-border px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
