"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge from "@/components/admin/status-badge";
import EmptyState from "@/components/admin/empty-state";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
};

// Replace with a real query once the products table is wired up
const products: ProductRow[] = [];

const FILTERS = ["All", "Active", "Draft", "Archived"] as const;

export default function AdminProducts() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const visible = products.filter(
    (product) =>
      (filter === "All" || product.status === filter) &&
      product.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <AdminTopbar
        title="Products"
        subtitle="Manage your catalog, inventory, and pricing."
      />

      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterTabs
            options={FILTERS.map((label) => ({
              label,
              count: products.filter(
                (p) => label === "All" || p.status === label,
              ).length,
            }))}
            active={filter}
            onChange={(label) => setFilter(label as (typeof FILTERS)[number])}
          />

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus className="size-4" />
            Add Product
          </button>
        </div>

        <div className="relative mt-5 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      tone={
                        product.status === "Active"
                          ? "green"
                          : product.status === "Draft"
                            ? "gray"
                            : "red"
                      }
                    >
                      {product.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">···</td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 && (
            <EmptyState
              title="No products yet"
              description="Add your first product to start building your catalog."
            />
          )}
        </div>
      </div>
    </>
  );
}
