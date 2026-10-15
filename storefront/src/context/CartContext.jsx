import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productImages } from "../utils/placeholders";
import { getPricing } from "../utils/pricing";

const CartContext = createContext(null);
const STORAGE_KEY = "mmc_cart";

// A product with different variant selections is a separate cart line.
const lineKey = (productId, variantSelections = {}) => `${productId}:${JSON.stringify(variantSelections)}`;

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode): cart still works for this session
    }
  }, [items]);

  const addItem = (product, quantity = 1, variantSelections = {}) => {
    if (!product?._id) return;
    const key = lineKey(product._id, variantSelections);
    setItems((prev) => {
      if (prev.some((i) => i.key === key)) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          brand: product.brand || "",
          image: productImages(product)[0] || "",
          categoryName: product.category?.name || "",
          priceGHS: product.priceGHS,
          salePriceGHS: product.salePriceGHS || 0,
          minGroupBuyQty: product.minGroupBuyQty || 0,
          groupBuyDiscountPct: product.groupBuyDiscountPct || 0,
          quantity,
          variantSelections,
        },
      ];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQuantity = (key, quantity) => {
    const next = Math.max(1, Math.floor(Number(quantity)) || 1);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: next } : i)));
  };

  const clearCart = () => setItems([]);

  const isInCart = (productId) => items.some((i) => i.productId === productId);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const subtotalGHS = useMemo(
    () => items.reduce((sum, i) => sum + getPricing(i, i.quantity).unit * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isInCart, itemCount, subtotalGHS }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
