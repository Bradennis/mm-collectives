import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "mmc_wishlist";

function loadWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Saved items keep a snapshot of the product so the wishlist page renders without refetching.
const snapshot = (product) => ({
  _id: product._id,
  slug: product.slug,
  name: product.name,
  images: product.images?.slice(0, 1) || [],
  category: product.category?.name ? { _id: product.category._id, name: product.category.name } : null,
  priceGHS: product.priceGHS,
  salePriceGHS: product.salePriceGHS || 0,
  minGroupBuyQty: product.minGroupBuyQty || 0,
  groupBuyDiscountPct: product.groupBuyDiscountPct || 0,
  stock: product.stock,
  variants: product.variants || [],
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // storage unavailable: wishlist lasts for this session only
    }
  }, [wishlist]);

  const isInWishlist = (productId) => wishlist.some((p) => p._id === productId);

  const toggleWishlist = (product) =>
    setWishlist((prev) =>
      prev.some((p) => p._id === product._id) ? prev.filter((p) => p._id !== product._id) : [...prev, snapshot(product)]
    );

  const removeFromWishlist = (productId) => setWishlist((prev) => prev.filter((p) => p._id !== productId));

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, wishlistCount: wishlist.length, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
