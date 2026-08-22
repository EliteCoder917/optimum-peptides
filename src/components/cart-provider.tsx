"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/types";

const STORAGE_KEY = "op-cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage can only happen client-side, so this has to be
    // an effect rather than a lazy useState initializer (which also runs
    // during server rendering).
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore malformed/unavailable storage — cart just starts empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === item.variantId);
      if (existing) {
        return current.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...current, { ...item, quantity }];
    });
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
    );
  }

  function removeItem(variantId: string) {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  }

  function clear() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );

  const value: CartContextValue = {
    items,
    itemCount,
    subtotalCents,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
