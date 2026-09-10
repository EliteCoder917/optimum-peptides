import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * Admin reads and writes for orders and reviews.
 *
 * These run through the browser client on purpose, not the service role: RLS
 * is the authorisation boundary here. `admin_auth.sql` grants select/update on
 * orders and select on order_items to `is_admin()` only, and the reviews
 * migration does the same for reviews, so a signed-in non-admin gets an empty
 * result rather than data. Nothing here is trusted to the proxy alone.
 */

// Mirrors the `order_status` enum. The admin UI previously offered
// Processing/Shipped/Delivered, none of which the database can store — these
// are the four states an order can actually be in.
export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export type AdminOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  itemCount: number;
  totalCents: number;
};

type OrderRow = {
  id: string;
  status: OrderStatus;
  customer_email: string;
  customer_name: string | null;
  total_cents: number;
  created_at: string;
  order_items: { id: string; quantity: number }[] | null;
};

export async function fetchOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabaseBrowser
    .from("orders")
    .select(
      "id, status, customer_email, customer_name, total_cents, created_at, order_items(id, quantity)",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: OrderRow) => ({
    id: row.id,
    // Orders are keyed by uuid, which is unreadable in a table and unusable
    // as something a customer could quote over email. The first block is
    // enough to identify a row by eye and is still searchable in full.
    reference: `#${row.id.slice(0, 8).toUpperCase()}`,
    status: row.status,
    customerName: row.customer_name?.trim() || "—",
    customerEmail: row.customer_email,
    createdAt: row.created_at,
    itemCount: (row.order_items ?? []).reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
    totalCents: row.total_cents,
  }));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// Mirrors the `review_status` enum. "approved" is shown as "Published" in the
// UI because that is what it means to whoever is moderating: the public
// select policy on reviews is `status = 'approved'`, so approving is the act
// that puts it on the product page.
export type ReviewStatus = "pending" | "approved" | "rejected";

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Published",
  rejected: "Rejected",
};

export type AdminReview = {
  id: string;
  reviewerName: string;
  productName: string;
  rating: number;
  title: string;
  description: string;
  status: ReviewStatus;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  description: string;
  status: ReviewStatus;
  created_at: string;
  // A many-to-one embed comes back as an object, but the generated types for
  // an un-generated schema widen it to an array — accept both.
  products: { name: string } | { name: string }[] | null;
};

function productName(products: ReviewRow["products"]): string {
  if (!products) return "—";
  return Array.isArray(products) ? (products[0]?.name ?? "—") : products.name;
}

export async function fetchReviews(): Promise<AdminReview[]> {
  const { data, error } = await supabaseBrowser
    .from("reviews")
    .select(
      "id, reviewer_name, rating, title, description, status, created_at, products(name)",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: ReviewRow) => ({
    id: row.id,
    reviewerName: row.reviewer_name,
    productName: productName(row.products),
    rating: row.rating,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
