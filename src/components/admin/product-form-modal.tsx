"use client";

import { useRef, useState } from "react";
import { Plus, Star, Trash2, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import ImageCropperModal from "@/components/admin/image-cropper-modal";
import { PRODUCT_CATEGORIES } from "@/lib/product-helpers";
import type { Product } from "@/types";

const MAX_IMAGES = 5;

type VariantRow = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  form: "" | "vial" | "pen";
};

type ImageSlot =
  | { status: "existing"; url: string; path: string }
  | { status: "new"; blob: Blob; previewUrl: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyVariant(): VariantRow {
  return { name: "", sku: "", price: "", stock: "", form: "" };
}

function pathFromPublicUrl(url: string): string {
  const marker = "/object/public/product-images/";
  const index = url.indexOf(marker);
  return index === -1 ? "" : url.slice(index + marker.length);
}

function imageSrc(slot: ImageSlot) {
  return slot.status === "existing" ? slot.url : slot.previewUrl;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(product?.description ?? "");
  const [categories, setCategories] = useState<string[]>(
    product?.categories ?? [],
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [images, setImages] = useState<ImageSlot[]>(
    (product?.imageUrls ?? []).map((url) => ({
      status: "existing" as const,
      url,
      path: pathFromPublicUrl(url),
    })),
  );
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [pendingCropSrc, setPendingCropSrc] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.length
      ? product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: (variant.priceCents / 100).toFixed(2),
          stock: String(variant.stockQuantity),
          form: variant.form ?? "",
        }))
      : [emptyVariant()],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleCategory(category: string) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );
  }

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large (max 10MB).");
      return;
    }

    setPendingCropSrc(URL.createObjectURL(file));
  }

  function handleCropped(blob: Blob) {
    if (pendingCropSrc) URL.revokeObjectURL(pendingCropSrc);
    setPendingCropSrc(null);
    setImages((current) => [
      ...current,
      { status: "new", blob, previewUrl: URL.createObjectURL(blob) },
    ]);
  }

  function removeImage(index: number) {
    setImages((current) => {
      const slot = current[index];
      if (slot.status === "existing" && slot.path) {
        setRemovedPaths((paths) => [...paths, slot.path]);
      } else if (slot.status === "new") {
        URL.revokeObjectURL(slot.previewUrl);
      }
      return current.filter((_, i) => i !== index);
    });
  }

  function makeCover(index: number) {
    setImages((current) => {
      const copy = [...current];
      const [moved] = copy.splice(index, 1);
      return [moved, ...copy];
    });
  }

  function updateVariant(index: number, patch: Partial<VariantRow>) {
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

    // Upload any newly-cropped images first, so the product row is only
    // ever written once we have final URLs for everything.
    const finalImageUrls: string[] = [];
    for (const slot of images) {
      if (slot.status === "existing") {
        finalImageUrls.push(slot.url);
        continue;
      }

      const formData = new FormData();
      formData.append("file", slot.blob, "image.jpg");
      formData.append("slug", slug.trim());

      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? "Image upload failed.");
        setSaving(false);
        return;
      }

      const { url } = await response.json();
      finalImageUrls.push(url);
    }

    const productPayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image_urls: finalImageUrls,
      categories,
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
        form: variant.form || null,
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

    // Best-effort cleanup of removed images — the product save already
    // succeeded, so a failure here shouldn't block the admin.
    for (const path of removedPaths) {
      fetch("/api/admin/product-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      }).catch(() => {});
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
              Categories
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    categories.includes(category)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Images ({images.length}/{MAX_IMAGES})
              </label>
            </div>

            <div className="mt-2 grid grid-cols-5 gap-3">
              {images.map((slot, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                >
                  <img
                    src={imageSrc(slot)}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Cover
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCover(index)}
                        aria-label="Set as cover"
                        className="flex size-6 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                      className="flex size-6 items-center justify-center rounded-full bg-white text-red-500 hover:bg-gray-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500"
                >
                  <Plus className="size-5" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
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
                  className="grid grid-cols-[1fr_1fr_0.7fr_0.7fr_0.8fr_auto] gap-2 rounded-lg border border-gray-200 p-3"
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
                  <select
                    value={variant.form}
                    onChange={(event) =>
                      updateVariant(index, {
                        form: event.target.value as VariantRow["form"],
                      })
                    }
                    className="h-9 w-full min-w-0 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="">No format</option>
                    <option value="vial">Vial</option>
                    <option value="pen">Pen</option>
                  </select>
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

      {pendingCropSrc && (
        <ImageCropperModal
          imageSrc={pendingCropSrc}
          onCancel={() => {
            URL.revokeObjectURL(pendingCropSrc);
            setPendingCropSrc(null);
          }}
          onCropped={handleCropped}
        />
      )}
    </div>
  );
}
