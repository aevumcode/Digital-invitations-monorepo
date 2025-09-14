"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Cart, CartItem, Product, ProductVariant } from "@/lib/shopify/types";

// Extend CartItem with a stable unitPrice we control on FE
export type LocalCartItem = CartItem & { unitPrice: number };

type CartAction =
  | { type: "INIT"; payload: Cart }
  | { type: "UPDATE_ITEM"; payload: { merchandiseId: string; nextQuantity: number } }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product; previousQuantity: number };
    };

type UseCartReturn = {
  cart: Cart;
  addItem: (variant: ProductVariant, product: Product) => void;
  updateItem: (merchandiseId: string, nextQuantity: number) => void;
};

const CartContext = createContext<UseCartReturn | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    id: "local",
    checkoutUrl: "",
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
    totalQuantity: 0,
    lines: [],
  };
}

// Ensure unitPrice exists on lines when hydrating from localStorage
function normalizeCart(c: Cart): Cart {
  const lines = (c.lines as (CartItem & Partial<{ unitPrice: number }>)[]).map((l) => {
    const qty = Math.max(1, l.quantity || 1);
    const unitPrice =
      typeof (l as any).unitPrice === "number"
        ? (l as any).unitPrice
        : Number(l.cost.totalAmount.amount) / qty ||
          Number(l.merchandise.product.priceRange.minVariantPrice.amount) ||
          0;

    return {
      ...l,
      unitPrice,
      cost: {
        ...l.cost,
        totalAmount: {
          ...l.cost.totalAmount,
          amount: (unitPrice * qty).toString(),
        },
      },
    } as LocalCartItem;
  });

  return { ...c, lines };
}

function updateCartTotals(lines: LocalCartItem[]): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";
  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "INIT":
      return normalizeCart(action.payload);

    case "UPDATE_ITEM": {
      const { merchandiseId, nextQuantity } = action.payload;

      const updatedLines = (state.lines as LocalCartItem[])
        .map((item) => {
          if (item.merchandise.id !== merchandiseId) return item;
          if (nextQuantity <= 0) return null; // remove
          return {
            ...item,
            quantity: nextQuantity,
            cost: {
              ...item.cost,
              totalAmount: {
                ...item.cost.totalAmount,
                amount: (item.unitPrice * nextQuantity).toString(),
              },
            },
          } as LocalCartItem;
        })
        .filter(Boolean) as LocalCartItem[];

      return { ...state, lines: updatedLines, ...updateCartTotals(updatedLines) };
    }

    case "ADD_ITEM": {
      const { variant, product, previousQuantity } = action.payload;
      const existing = (state.lines as LocalCartItem[]).find(
        (i) => i.merchandise.id === variant.id,
      );
      const unitPrice = Number(variant.price.amount);
      const nextQty = previousQuantity + 1;

      const updatedLines = existing
        ? (state.lines as LocalCartItem[]).map((i) =>
            i.merchandise.id === variant.id
              ? {
                  ...i,
                  quantity: nextQty,
                  cost: {
                    ...i.cost,
                    totalAmount: {
                      ...i.cost.totalAmount,
                      amount: (i.unitPrice * nextQty).toString(),
                    },
                  },
                }
              : i,
          )
        : [
            {
              id: `local-${Date.now()}`,
              quantity: nextQty,
              cost: {
                totalAmount: {
                  amount: (unitPrice * nextQty).toString(),
                  currencyCode: variant.price.currencyCode,
                },
              },
              merchandise: {
                id: variant.id, // 👈 this is the key we later update by
                title: variant.title,
                selectedOptions: variant.selectedOptions,
                product,
              },
              unitPrice,
            } as LocalCartItem,
            ...(state.lines as LocalCartItem[]),
          ];

      return { ...state, lines: updatedLines, ...updateCartTotals(updatedLines) };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, createEmptyCart());

  // Load from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) dispatch({ type: "INIT", payload: JSON.parse(stored) as Cart });
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (variant: ProductVariant, product: Product) => {
    const prevQty = cart.lines.find((l) => l.merchandise.id === variant.id)?.quantity || 0;
    dispatch({ type: "ADD_ITEM", payload: { variant, product, previousQuantity: prevQty } });
  };

  // IMPORTANT: update by merchandiseId (== variant.id), not line id
  const updateItem = (merchandiseId: string, nextQuantity: number) => {
    dispatch({ type: "UPDATE_ITEM", payload: { merchandiseId, nextQuantity } });
  };

  const value = useMemo<UseCartReturn>(() => ({ cart, addItem, updateItem }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): UseCartReturn {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
