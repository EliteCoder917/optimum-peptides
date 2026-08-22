import type { Product, ProductVariant } from "@/types";

type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_cents: number;
  stock_quantity: number;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  is_active: boolean;
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
    isActive: row.is_active,
    variants: row.product_variants.map(mapVariant),
  };
}

export function getDisplayPriceCents(product: Product): number | null {
  const activePrices = product.variants
    .filter((variant) => variant.isActive)
    .map((variant) => variant.priceCents);

  if (activePrices.length === 0) return null;
  return Math.min(...activePrices);
}
