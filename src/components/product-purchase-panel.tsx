"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product, ProductVariant, VariantForm } from "@/types";

const FORM_LABELS: Record<VariantForm, string> = {
  vial: "Vial",
  pen: "Pen",
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductPurchasePanel({
  product,
}: {
  product: Product;
}) {
  const { addItem } = useCart();
  const activeVariants = product.variants.filter((v) => v.isActive);

  const forms = useMemo(() => {
    const present = Array.from(new Set(activeVariants.map((v) => v.form)));
    // Only worth showing a format toggle when there's an actual choice.
    return present.length > 1 ? present : [];
  }, [activeVariants]);

  const [selectedForm, setSelectedForm] = useState<VariantForm | null>(
    forms[0] ?? null,
  );

  const optionsForForm = forms.length
    ? activeVariants.filter((v) => v.form === selectedForm)
    : activeVariants;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    optionsForForm[0]?.id ?? null,
  );

  const selectedVariant: ProductVariant | undefined = activeVariants.find(
    (v) => v.id === selectedVariantId,
  );

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleSelectForm(form: VariantForm) {
    setSelectedForm(form);
    const next = activeVariants.find((v) => v.form === form);
    setSelectedVariantId(next?.id ?? null);
    setQuantity(1);
  }

  function handleSelectVariant(id: string) {
    setSelectedVariantId(id);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;

    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantName: selectedVariant.name,
        form: selectedVariant.form,
        priceCents: selectedVariant.priceCents,
        imageUrl: product.imageUrls[0] ?? null,
      },
      quantity,
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  if (activeVariants.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        Currently unavailable.
      </p>
    );
  }

  const outOfStock = selectedVariant?.stockQuantity === 0;

  return (
    <div className="space-y-5">
      {forms.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Format
          </p>
          <div className="flex gap-2">
            {forms.map((form) => (
              <button
                key={form ?? "standard"}
                type="button"
                onClick={() => form && handleSelectForm(form)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  selectedForm === form
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {form ? FORM_LABELS[form] : "Standard"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Dosage
        </p>
        <div className="flex flex-wrap gap-2">
          {optionsForForm.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelectVariant(variant.id)}
              disabled={variant.stockQuantity === 0}
              className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selectedVariantId === variant.id
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {variant.name}
              {variant.stockQuantity === 0 ? " — Out of stock" : ""}
            </button>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold">
            {formatPrice(selectedVariant.priceCents)}
          </span>
          <span className="text-sm text-muted-foreground">
            {outOfStock
              ? "Out of stock"
              : selectedVariant.stockQuantity <= 5
                ? `Only ${selectedVariant.stockQuantity} left`
                : "In stock"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((q) =>
                selectedVariant
                  ? Math.min(selectedVariant.stockQuantity, q + 1)
                  : q,
              )
            }
            aria-label="Increase quantity"
            className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant || outOfStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-metal-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? (
            <>
              <Check className="size-4" />
              Added to Cart
            </>
          ) : outOfStock ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
