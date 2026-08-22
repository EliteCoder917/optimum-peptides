import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Review } from "@/types";

type ReviewRow = {
  id: string;
  product_id: string;
  reviewer_name: string;
  title: string;
  description: string;
  rating: number;
  image_urls: string[] | null;
  status: Review["status"];
  created_at: string;
};

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    reviewerName: row.reviewer_name,
    title: row.title,
    description: row.description,
    rating: row.rating,
    imageUrls: row.image_urls ?? [],
    status: row.status,
    createdAt: row.created_at,
  };
}

// Public — approved reviews only, for the storefront product page.
export async function getApprovedReviews(productId: string): Promise<Review[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (data ?? []).map(mapReview);
}
