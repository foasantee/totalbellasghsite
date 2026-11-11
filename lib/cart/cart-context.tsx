"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  category: string;
  name: string;
  price: number;
  image: string | null;
  /** Size label (e.g. "M", "10"), or null for products that don't use sizes. */
  size: string | null;
  quantity: number;
  /** Stock available at the time it was added — used only as a soft UI cap. */
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, size: string | null, quantity: number) => void;
  removeItem: (productId: string, size: string | null) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
};

function sameLine(a: { productId: string; size: string | null }, b: { productId: string; size: string | null }) {
  return a.productId === b.productId && a.size === b.size;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "totalbellas_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item));
      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + quantity,
          existing.maxQuantity
        );
        return prev.map((line) =>
          sameLine(line, item) ? { ...line, quantity: nextQuantity } : line
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.maxQuantity) }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string | null, quantity: number) => {
    setItems((prev) =>
      prev
        .map((line) =>
          sameLine(line, { productId, size })
            ? { ...line, quantity: Math.max(0, Math.min(quantity, line.maxQuantity)) }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string, size: string | null) => {
    setItems((prev) => prev.filter((line) => !sameLine(line, { productId, size })));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clear, subtotal, itemCount }),
    [items, addItem, updateQuantity, removeItem, clear, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider.");
  return ctx;
}
