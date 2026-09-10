import Link from "next/link";
import { PoundSterling, Package, ShoppingCart, Star } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import StatCard from "@/components/admin/stat-card";
import EmptyState from "@/components/admin/empty-state";
import StatusBadge, { type StatusTone } from "@/components/admin/status-badge";
import { getDashboardStats } from "@/lib/admin-stats";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/product-helpers";
import { formatDate } from "@/lib/format";

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending: "amber",
  paid: "blue",
  fulfilled: "green",
  cancelled: "red",
};

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  // Bars are scaled against the largest value rather than a rounded axis
  // maximum, so the tallest bar always fills the plot and small months stay
  // visible instead of collapsing to a sliver.
  const maxMonth = Math.max(...stats.revenueByMonth.map((m) => m.cents), 0);
  const maxUnits = Math.max(...stats.topProducts.map((p) => p.units), 1);

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Here's what's happening with your store today."
      />

      <div className="space-y-6 p-8">
        <div
          id="tour-dashboard-stats"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            label="Total Revenue"
            value={formatPrice(stats.revenueCents)}
            icon={PoundSterling}
            iconClassName="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Total Orders"
            value={String(stats.orderCount)}
            icon={ShoppingCart}
            iconClassName="bg-green-50 text-green-600"
          />
          <StatCard
            label="Products in Stock"
            value={String(stats.productsInStock)}
            icon={Package}
            iconClassName="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Avg Rating"
            value={
              stats.averageRating === null
                ? "—"
                : stats.averageRating.toFixed(1)
            }
            icon={Star}
            iconClassName="bg-pink-50 text-pink-600"
          />
        </div>

        {/* Both panels are single-series, so they take one hue and no legend —
            the heading names the measure. Values are labelled selectively (the
            axis maximum, and on hover) rather than on every bar. */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500">
              Paid and fulfilled orders, last 6 months
            </p>

            {maxMonth === 0 ? (
              <EmptyState
                title="No revenue yet"
                description="Monthly totals appear here once orders are paid."
              />
            ) : (
              <div className="mt-6">
                <div className="flex h-56 items-end gap-3 border-b border-gray-100">
                  {stats.revenueByMonth.map((month) => (
                    <div
                      key={month.key}
                      className="group flex h-full flex-1 flex-col justify-end"
                    >
                      <p className="mb-1 text-center text-xs font-medium text-gray-900 opacity-0 transition-opacity group-hover:opacity-100">
                        {formatPrice(month.cents)}
                      </p>
                      <div
                        title={`${month.label}: ${formatPrice(month.cents)}`}
                        style={{
                          height: `${Math.max((month.cents / maxMonth) * 100, month.cents > 0 ? 2 : 0)}%`,
                        }}
                        className="w-full rounded-t bg-blue-500 transition-colors group-hover:bg-blue-600"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-3">
                  {stats.revenueByMonth.map((month) => (
                    <p
                      key={month.key}
                      className="flex-1 text-center text-xs text-gray-400"
                    >
                      {month.label}
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  Peak month {formatPrice(maxMonth)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Top Products
            </h2>
            <p className="text-sm text-gray-500">By units sold</p>

            {stats.topProducts.length === 0 ? (
              <EmptyState title="No sales data yet" />
            ) : (
              <ul className="mt-6 space-y-3">
                {stats.topProducts.map((product) => (
                  <li key={product.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm text-gray-900">
                        {product.name}
                      </p>
                      <p className="shrink-0 text-xs text-gray-500">
                        {product.units}
                      </p>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        style={{
                          width: `${(product.units / maxUnits) * 100}%`,
                        }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div
            id="tour-recent-orders"
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-sm text-gray-500">
                  Latest customer purchases
                </p>
              </div>
              {stats.recentOrders.length > 0 && (
                <Link
                  href="/admin/orders"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              )}
            </div>

            {stats.recentOrders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                description="Orders will show up here as customers check out."
              />
            ) : (
              <ul className="mt-5 divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {order.reference}
                        <span className="ml-2 font-normal text-gray-500">
                          {order.customerName}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge
                        tone={
                          STATUS_TONE[order.status as OrderStatus] ?? "gray"
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status as OrderStatus] ??
                          order.status}
                      </StatusBadge>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalCents)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            id="tour-low-stock"
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Low Stock Alert
                </h2>
                <p className="text-sm text-gray-500">Restock soon</p>
              </div>
              {stats.lowStock.length > 0 && (
                <Link
                  href="/admin/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Manage
                </Link>
              )}
            </div>

            {stats.lowStock.length === 0 ? (
              <EmptyState title="Nothing low on stock" />
            ) : (
              <ul className="mt-5 divide-y divide-gray-100">
                {stats.lowStock.map((variant) => (
                  <li
                    key={variant.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-900">
                        {variant.productName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {variant.variantName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        variant.stockQuantity === 0
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {variant.stockQuantity === 0
                        ? "Out of stock"
                        : `${variant.stockQuantity} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
