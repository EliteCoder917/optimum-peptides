"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge from "@/components/admin/status-badge";
import EmptyState from "@/components/admin/empty-state";
import ProductFormModal from "@/components/admin/product-form-modal";
import { supabaseBrowser } from "@/lib/supabase/client";
import { mapProduct } from "@/lib/product-helpers";
import type { Product } from "@/types";

const FILTERS = ["All", "Active", "Inactive"] as const;

function formatPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.priceCents);
  if (prices.length === 0) return "—";

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const format = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return min === max ? format(min) : `${format(min)} – ${format(max)}`;
}

function totalStock(product: Product) {
  return product.variants.reduce(
    (sum, variant) => sum + variant.stockQuantity,
    0,
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabaseBrowser
      .from("products")
      .select("*, product_variants(*)")
      .order("created_at", { ascending: false });

    setProducts((data ?? []).map(mapProduct));
    setLoading(false);
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount — there's no non-effect way to load remote
    // data into local state here without a data-fetching library.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const visible = products.filter(
    (product) =>
      (filter === "All" ||
        (filter === "Active" ? product.isActive : !product.isActive)) &&
      product.name.toLowerCase().includes(query.toLowerCase()),
  );

  function openCreateModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    await supabaseBrowser.from("products").delete().eq("id", product.id);
    fetchProducts();
  }

  async function handleToggleActive(product: Product) {
    const nextActive = !product.isActive;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, isActive: nextActive } : p,
      ),
    );

    const { error } = await supabaseBrowser
      .from("products")
      .update({ is_active: nextActive })
      .eq("id", product.id);

    if (error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: product.isActive } : p,
        ),
      );
    }
  }

  return (
    <>
      <AdminTopbar
        title="Products"
        subtitle="Manage your catalog, inventory, and pricing."
      />

      <div className="p-8">
        <div
          id="tour-products-toolbar"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <FilterTabs
            options={FILTERS.map((label) => ({
              label,
              count: products.filter(
                (p) =>
                  label === "All" ||
                  (label === "Active" ? p.isActive : !p.isActive),
              ).length,
            }))}
            active={filter}
            onChange={(label) => setFilter(label as (typeof FILTERS)[number])}
          />

          <button
            type="button"
            onClick={openCreateModal}
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

        <div
          id="tour-products-table"
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
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
                  <td className="px-6 py-4 text-gray-900">
                    {formatPrice(product)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {totalStock(product)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={product.isActive}
                        aria-label={
                          product.isActive
                            ? `Deactivate ${product.name}`
                            : `Activate ${product.name}`
                        }
                        onClick={() => handleToggleActive(product)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          product.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block size-3.5 transform rounded-full bg-white shadow transition-transform ${
                            product.isActive
                              ? "translate-x-[18px]"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <StatusBadge tone={product.isActive ? "green" : "gray"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </StatusBadge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && visible.length === 0 && (
            <EmptyState
              title="No products yet"
              description="Add your first product to start building your catalog."
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
