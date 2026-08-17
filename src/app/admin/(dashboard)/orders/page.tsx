"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge, { type StatusTone } from "@/components/admin/status-badge";
import EmptyState from "@/components/admin/empty-state";

type OrderStatus =
  "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: number;
  status: OrderStatus;
  totalCents: number;
};

// Replace with a real query once orders/order_items are wired up
const orders: OrderRow[] = [];

const FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  Pending: "amber",
  Processing: "blue",
  Shipped: "indigo",
  Delivered: "green",
  Cancelled: "red",
};

export default function AdminOrders() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const visible = orders.filter(
    (order) =>
      (filter === "All" || order.status === filter) &&
      (order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(query.toLowerCase()) ||
        order.id.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <AdminTopbar
        title="Orders"
        subtitle="Track and fulfill customer orders."
      />

      <div className="p-8">
        <FilterTabs
          options={FILTERS.map((label) => ({
            label,
            count: orders.filter((o) => label === "All" || o.status === label)
              .length,
          }))}
          active={filter}
          onChange={(label) => setFilter(label as (typeof FILTERS)[number])}
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

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
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
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-gray-500">{order.items}</td>
                  <td className="px-6 py-4">
                    <StatusBadge tone={STATUS_TONE[order.status]}>
                      {order.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    ${(order.totalCents / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 && (
            <EmptyState
              title="No orders yet"
              description="Customer orders will appear here once checkout is live."
            />
          )}
        </div>
      </div>
    </>
  );
}
