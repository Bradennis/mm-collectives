import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaCheck, FaHeart, FaRegHeart, FaShoppingCart, FaSlidersH } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { productImages } from "../utils/placeholders";
import { formatGHS, getPricing, isInStock, isNewArrival } from "../utils/pricing";
import Stars from "./Stars.jsx";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50" />
      <div className="p-3.5 space-y-2">
        <div className="h-2 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-9 bg-gray-100 rounded-xl mt-3" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const cycleTimer = useRef(null);

  useEffect(() => () => clearInterval(cycleTimer.current), []);

  const images = productImages(product);
  const inStock = isInStock(product);
  const inCart = isInCart(product._id);
  const wished = isInWishlist(product._id);
  const hasVariants = product.variants?.length > 0;
  const { unit, original, onSale, discountPct } = getPricing(product);

  const openProduct = () => navigate(`/products/${product.slug}`);

  // Hovering a card with several photos cycles through them
  const startCycle = () => {
    if (images.length <= 1) return;
    cycleTimer.current = setInterval(() => setImageIndex((i) => (i + 1) % images.length), 2000);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    // Variants must be chosen on the product page
    if (hasVariants) openProduct();
    else addItem(product);
  };

  let cartLabel = "Out of Stock";
  if (inStock) {
    if (hasVariants) cartLabel = <><FaSlidersH className="text-[11px]" /> Select Options</>;
    else if (inCart) cartLabel = <><FaCheck className="text-[11px]" /> In Cart</>;
    else cartLabel = <><FaShoppingCart className="text-[11px]" /> Add to Cart</>;
  }

  return (
    <div
      className="fade-up group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-md shadow-primary/10 border border-gray-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 45}ms` }}
      onMouseEnter={startCycle}
      onMouseLeave={() => clearInterval(cycleTimer.current)}
      onClick={openProduct}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        {images.length > 0 && !imageFailed ? (
          <img
            src={images[imageIndex] || images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBoxOpen className="text-3xl text-gray-300" />
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/90 text-ink text-[11px] font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        {onSale && discountPct > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-head shadow-md shadow-primary/30">
            -{discountPct}%
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
          {isNewArrival(product) && (
            <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md font-head">NEW</span>
          )}
          {product.isBestseller && (
            <span className="bg-gradient-to-r from-primary to-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-md font-head">HOT</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:scale-110 hover:border-primary/30 transition-all duration-200"
        >
          {wished ? <FaHeart className="text-rose-600 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${i === imageIndex ? "bg-primary w-3 h-1.5" : "bg-white/70 w-1.5 h-1.5"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3.5">
        {product.category?.name && (
          <p className="text-[9px] text-primary uppercase tracking-[2px] mb-1 font-semibold">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-gray-900 text-[14px] leading-snug line-clamp-2 mb-2 min-h-[2.5em]">{product.name}</h3>

        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <Stars value={product.ratingAvg} />
            <span className="text-[10px] text-gray-400">({product.ratingCount})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <div className="flex items-baseline">
            <span className="font-head font-bold text-[12px] text-secondary">GH₵</span>
            <span className={`font-head font-bold text-[18px] ml-0.5 ${onSale ? "text-primary" : "text-gray-900"}`}>
              {formatGHS(unit)}
            </span>
          </div>
          {onSale && <span className="text-gray-400 text-xs line-through">GH₵{formatGHS(original)}</span>}
        </div>

        {product.minGroupBuyQty > 0 && (
          <p className="text-[10px] text-secondary font-semibold -mt-1.5 mb-2.5">
            Buy {product.minGroupBuyQty}+ and save {product.groupBuyDiscountPct}%
          </p>
        )}

        <button
          onClick={handleCartClick}
          disabled={!inStock}
          className={`w-full py-2.5 rounded-xl text-[12px] font-semibold font-head flex items-center justify-center gap-1.5 transition-all duration-200 ${
            !inStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : inCart && !hasVariants
              ? "bg-ink text-white"
              : "bg-gradient-to-r from-primary to-primary/90 text-white hover:opacity-90 shadow-md shadow-primary/25"
          }`}
        >
          {cartLabel}
        </button>
      </div>
    </div>
  );
}
