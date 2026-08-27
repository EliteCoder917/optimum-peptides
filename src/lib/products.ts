import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/product-helpers";
import type { Product } from "@/types";

// Public catalog — active, research-use products only.
//
// The regulatory_class filter is not optional dressing: listing a licensed
// prescription-only medicine to the public is an offence in its own right
// under reg 7 of the Human Medicines Regulations 2012, separate from any
// question of supply. Never drop it from a public-facing query.
export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .eq("regulatory_class", "ruo")
    .order("created_at", { ascending: false });

  return (data ?? []).map(mapProduct);
}

// Single product for the storefront product page. Same filtering as above.
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("regulatory_class", "ruo")
    .maybeSingle();

  return data ? mapProduct(data) : null;
}
