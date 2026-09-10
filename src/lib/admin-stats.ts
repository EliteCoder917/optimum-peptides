import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Dashboard figures. Server-side through the request's session cookie, so the
 * same `is_admin()` policies that gate the admin tables apply — a non-admin
 * reaching this gets zeroes, not somebody else's revenue.
 *
 * Totals are summed in JS rather than in SQL because PostgREST has no
 * aggregate endpoint without a view or RPC, and the row counts here are small.
 * If orders ever reach the tens of thousands this wants a database view.
 */

const LOW_STOCK_THRESHOLD = 5;

export type RecentOrder = {
  id: string;
  reference: string;
  customerName: string;
  status: string;
  totalCents: number;
  createdAt: string;
};

export type LowStockVariant = {
  id: string;
  productName: string;
  variantName: string;
  stockQuantity: number;
};

export type MonthlyRevenue = {
  key: string;
  label: string;
  cents: number;
};

export type TopProduct = {
  name: string;
  units: number;
  cents: number;
};

export type DashboardStats = {
  revenueCents: number;
  orderCount: number;
  productsInStock: number;
  averageRating: number | null;
  recentOrders: RecentOrder[];
  lowStock: LowStockVariant[];
  revenueByMonth: MonthlyRevenue[];
  topProducts: TopProduct[];
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * The last six months including the current one, always all six even where a
 * month has no revenue — a bar chart that silently drops empty months reads as
 * continuous growth when it is actually a gap.
 */
function emptyMonths(now: Date): MonthlyRevenue[] {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1),
    );
    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      label: MONTH_LABELS[date.getUTCMonth()],
      cents: 0,
    };
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();

  const [orders, variants, reviews, items] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, customer_name, total_cents, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("product_variants")
      .select("id, name, stock_quantity, is_active, products(name, is_active)")
      .eq("is_active", true),
    supabase.from("reviews").select("rating").eq("status", "approved"),
    // product_name is snapshotted onto order_items at purchase time, so units
    // sold needs no join back to products — and still reports correctly for a
    // product that has since been renamed or deleted.
    supabase
      .from("order_items")
      .select("product_name, quantity, unit_price_cents, order_id"),
  ]);

  const orderRows = orders.data ?? [];
  const variantRows = variants.data ?? [];
  const reviewRows = reviews.data ?? [];
  const itemRows = items.data ?? [];

  // Revenue counts money actually taken. A pending order has not been paid
  // and a cancelled one has been reversed, so including either would inflate
  // the headline figure the shop is judged on.
  const revenueCents = orderRows
    .filter((order) => order.status === "paid" || order.status === "fulfilled")
    .reduce((sum, order) => sum + (order.total_cents ?? 0), 0);

  const name = (products: unknown): string => {
    if (!products) return "—";
    const value = Array.isArray(products) ? products[0] : products;
    return (value as { name?: string })?.name ?? "—";
  };

  const inStock = variantRows.filter((v) => (v.stock_quantity ?? 0) > 0);

  // Same "money actually taken" rule as the headline figure, so the chart and
  // the card can never tell different stories.
  const earning = orderRows.filter(
    (order) => order.status === "paid" || order.status === "fulfilled",
  );

  const months = emptyMonths(new Date());
  const monthIndex = new Map(months.map((month, index) => [month.key, index]));
  for (const order of earning) {
    const date = new Date(order.created_at);
    const slot = monthIndex.get(
      `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
    );
    if (slot !== undefined) months[slot].cents += order.total_cents ?? 0;
  }

  const earningIds = new Set(earning.map((order) => order.id));
  const byProduct = new Map<string, TopProduct>();
  for (const item of itemRows) {
    if (!earningIds.has(item.order_id)) continue;
    const existing = byProduct.get(item.product_name) ?? {
      name: item.product_name,
      units: 0,
      cents: 0,
    };
    existing.units += item.quantity ?? 0;
    existing.cents += (item.unit_price_cents ?? 0) * (item.quantity ?? 0);
    byProduct.set(item.product_name, existing);
  }

  return {
    revenueByMonth: months,
    topProducts: [...byProduct.values()]
      .sort((a, b) => b.units - a.units)
      .slice(0, 5),
    revenueCents,
    orderCount: orderRows.length,
    // Counts distinct products with something sellable behind them, not the
    // number of variant rows — "Products in Stock" on the card means products.
    productsInStock: new Set(inStock.map((v) => name(v.products))).size,
    averageRating: reviewRows.length
      ? reviewRows.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        reviewRows.length
      : null,
    recentOrders: orderRows.slice(0, 5).map((order) => ({
      id: order.id,
      reference: `#${order.id.slice(0, 8).toUpperCase()}`,
      customerName: order.customer_name?.trim() || "—",
      status: order.status,
      totalCents: order.total_cents,
      createdAt: order.created_at,
    })),
    lowStock: variantRows
      .filter((v) => (v.stock_quantity ?? 0) <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0))
      .slice(0, 6)
      .map((v) => ({
        id: v.id,
        productName: name(v.products),
        variantName: v.name,
        stockQuantity: v.stock_quantity ?? 0,
      })),
  };
}
