import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/product-helpers";
import type { Product } from "@/types";

// Public catalog — active products only, for the storefront.
export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (data ?? []).map(mapProduct);
}

// Single active product for the storefront product page.
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return data ? mapProduct(data) : null;
}
