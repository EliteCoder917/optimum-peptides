import { getProducts } from "@/lib/products";
import ShopGrid from "@/components/shop-grid";

export default async function Shop() {
  const products = await getProducts();

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

        {/* COLLECTION */}
        <section className="mx-auto max-w-7xl px-5 py-12">
          <ShopGrid products={products} />
        </section>
      </main>
    </div>
  );
}
