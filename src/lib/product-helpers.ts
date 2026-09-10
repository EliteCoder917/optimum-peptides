import type { Product, ProductVariant } from "@/types";

// Research domains, not benefit claims. The previous names ("Weight Loss",
// "Libido", "Joint Pain"…) each asserted a human therapeutic effect, which
// is exactly what pushes a research chemical into being an unlicensed
// medicine by presentation. These describe the field of study instead.
//
// Each name must stay a *body system or molecular class* — where a
// researcher would look — never an outcome for the reader. "Skin" is a
// shelf label; "Anti-Ageing" is a claim, and so is "Weight Loss". The
// plain-English wording here is only about readability: the Latinate
// originals ("Dermatological", "Musculoskeletal") were no safer, just
// harder to scan. Renaming one means migrating `products.categories`
// alongside it — see 20260905000001_plain_category_names.sql.
export const PRODUCT_CATEGORIES = [
  "Metabolic Research",
  "Tissue Repair Research",
  "Growth Factor Research",
  "Hormone Research",
  "Digestive Research",
  "Skin Research",
  "Cellular & Longevity Research",
  "Brain & Nervous System Research",
  "Muscle & Bone Research",
] as const;

type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_cents: number;
  stock_quantity: number;
  is_active: boolean;
  form: "vial" | "pen" | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  categories: string[] | null;
  is_active: boolean;
  regulatory_class: "ruo" | "pom" | null;
  product_variants: ProductVariantRow[];
};

function mapVariant(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    sku: row.sku,
    priceCents: row.price_cents,
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
    form: row.form,
  };
}

// Pure data mapping — no server-only imports, safe for client components too.
export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    imageUrls: row.image_urls ?? [],
    categories: row.categories ?? [],
    isActive: row.is_active,
    regulatoryClass: row.regulatory_class ?? "ruo",
    variants: row.product_variants.map(mapVariant),
  };
}

// Single source of truth for money on the storefront. Prices are stored as
// GBP minor units, so every renderer has to agree on both the divisor and the
// symbol — this was previously five copies of the same function plus four
// inline template literals, every one of them printing "$" over a sterling
// amount. Kept as plain string building rather than Intl.NumberFormat so the
// server and client can never disagree about the output and trip hydration.
export function formatPrice(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

export function getDisplayPriceCents(product: Product): number | null {
  const activePrices = product.variants
    .filter((variant) => variant.isActive)
    .map((variant) => variant.priceCents);

  if (activePrices.length === 0) return null;
  return Math.min(...activePrices);
}
