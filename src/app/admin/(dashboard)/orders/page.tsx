"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge, { type StatusTone } from "@/components/admin/status-badge";
import EmptyState from "@/components/admin/empty-state";
import { formatPrice } from "@/lib/product-helpers";
import { formatDate } from "@/lib/format";
import {
  fetchOrders,
  updateOrderStatus,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin-queries";

const FILTERS = ["All", ...ORDER_STATUSES] as const;

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending: "amber",
  paid: "blue",
  fulfilled: "green",
  cancelled: "red",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount, same as the products page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function changeStatus(id: string, status: OrderStatus) {
    setSavingId(id);
    const previous = orders;

    // Optimistic: the select sits in a table row and snapping back on failure
    // reads better than freezing every row behind a spinner.
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );

    try {
      await updateOrderStatus(id, status);
      setError(null);
    } catch (cause) {
      setOrders(previous);
      setError(
        cause instanceof Error ? cause.message : "Could not update the order.",
      );
    } finally {
      setSavingId(null);
    }
  }

  const term = query.trim().toLowerCase();
  const visible = orders.filter(
    (order) =>
      (filter === "All" || order.status === filter) &&
      (term === "" ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.reference.toLowerCase().includes(term)),
  );

  return (
    <>
      <AdminTopbar
        title="Orders"
        subtitle="Track and fulfill customer orders."
      />

      <div className="p-8">
        <FilterTabs
          options={FILTERS.map((value) => ({
            label:
              value === "All"
                ? "All"
                : ORDER_STATUS_LABELS[value as OrderStatus],
            count: orders.filter((o) => value === "All" || o.status === value)
              .length,
          }))}
          active={
            filter === "All"
              ? "All"
              : ORDER_STATUS_LABELS[filter as OrderStatus]
          }
          onChange={(label) => {
            const match = ORDER_STATUSES.find(
              (status) => ORDER_STATUS_LABELS[status] === label,
            );
            setFilter(match ?? "All");
          }}
        />

        <div className="relative mt-5 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order #, customer, or email..."
            aria-label="Search orders"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div
          id="tour-orders-table"
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.reference}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {order.itemCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={STATUS_TONE[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </StatusBadge>
                        <select
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(event) =>
                            changeStatus(
                              order.id,
                              event.target.value as OrderStatus,
                            )
                          }
                          aria-label={`Change status for order ${order.reference}`}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 outline-none focus:border-blue-400 disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      {formatPrice(order.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              Loading orders…
            </p>
          )}

          {!loading && visible.length === 0 && (
            <EmptyState
              title={
                orders.length === 0 ? "No orders yet" : "No matching orders"
              }
              description={
                orders.length === 0
                  ? "Customer orders will appear here once checkout is live."
                  : "Try a different search or filter."
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
