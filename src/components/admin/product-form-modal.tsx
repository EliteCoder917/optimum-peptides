"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Product } from "@/types";

type VariantForm = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyVariant(): VariantForm {
  return { name: "", sku: "", price: "", stock: "" };
}

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [variants, setVariants] = useState<VariantForm[]>(
    product?.variants.length
      ? product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: (variant.priceCents / 100).toFixed(2),
          stock: String(variant.stockQuantity),
        }))
      : [emptyVariant()],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function updateVariant(index: number, patch: Partial<VariantForm>) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, ...patch } : variant,
      ),
    );
  }

  function addVariant() {
    setVariants((current) => [...current, emptyVariant()]);
  }

  function removeVariant(index: number) {
    setVariants((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanedVariants = variants.filter(
      (variant) => variant.name.trim() && variant.price.trim(),
    );

    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    if (cleanedVariants.length === 0) {
      setError("Add at least one variant with a name and price.");
      return;
    }

    for (const variant of cleanedVariants) {
      if (Number.isNaN(parseFloat(variant.price))) {
        setError(`"${variant.name}" has an invalid price.`);
        return;
      }
      if (!variant.sku.trim()) {
        setError(`"${variant.name}" needs a SKU.`);
        return;
      }
    }

    setSaving(true);

    const productPayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
      is_active: isActive,
    };

    let productId = product?.id;

    if (isEditing && productId) {
      const { error: updateError } = await supabaseBrowser
        .from("products")
        .update(productPayload)
        .eq("id", productId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabaseBrowser
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? "Could not create product.");
        setSaving(false);
        return;
      }
      productId = data.id;
    }

    // Reconcile variants: update existing, insert new, delete removed.
    const keptIds = cleanedVariants
      .map((variant) => variant.id)
      .filter((id): id is string => !!id);

    if (isEditing) {
      const removedIds = (product?.variants ?? [])
        .map((variant) => variant.id)
        .filter((id) => !keptIds.includes(id));

      if (removedIds.length > 0) {
        const { error: deleteError } = await supabaseBrowser
          .from("product_variants")
          .delete()
          .in("id", removedIds);

        if (deleteError) {
          setError(deleteError.message);
          setSaving(false);
          return;
        }
      }
    }

    for (const variant of cleanedVariants) {
      const variantPayload = {
        product_id: productId,
        name: variant.name.trim(),
        sku: variant.sku.trim(),
        price_cents: Math.round(parseFloat(variant.price) * 100),
        stock_quantity: parseInt(variant.stock, 10) || 0,
      };

      const { error: variantError } = variant.id
        ? await supabaseBrowser
            .from("product_variants")
            .update(variantPayload)
            .eq("id", variant.id)
        : await supabaseBrowser.from("product_variants").insert(variantPayload);

      if (variantError) {
        setError(variantError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                required
                className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                required
                className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 min-h-20 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="/images/vial.png"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-400"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 rounded border-gray-300"
            />
            Active (visible on the storefront)
          </label>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Variants
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus className="size-3.5" />
                Add variant
              </button>
            </div>

            <div className="mt-2 space-y-3">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_0.7fr_0.7fr_auto] gap-2 rounded-lg border border-gray-200 p-3"
                >
                  <input
                    value={variant.name}
                    onChange={(event) =>
                      updateVariant(index, { name: event.target.value })
                    }
                    placeholder="Name (e.g. 5mg)"
                    className="h-9 w-full min-w-0 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                  />
                  <input
                    value={variant.sku}
                    onChange={(event) =>
                      updateVariant(index, { sku: event.target.value })
                    }
                    placeholder="SKU"
                    className="h-9 w-full min-w-0 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                  />
                  <input
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(index, { price: event.target.value })
                    }
                    placeholder="Price"
                    inputMode="decimal"
                    className="h-9 w-full min-w-0 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                  />
                  <input
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(index, { stock: event.target.value })
                    }
                    placeholder="Stock"
                    inputMode="numeric"
                    className="h-9 w-full min-w-0 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={variants.length === 1}
                    aria-label="Remove variant"
                    className="flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
