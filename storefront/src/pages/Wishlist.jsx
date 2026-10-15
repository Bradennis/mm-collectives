import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaRegHeart, FaTrash } from "react-icons/fa";
import ProductCard from "../components/ProductCard.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
            <FaRegHeart className="text-4xl text-primary" />
          </div>
          <h2 className="font-head text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Save items you love and come back to them anytime.</p>
          <Link to="/products" className="btn-solid px-8 py-3.5">
            Browse Products <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow mb-1.5">Saved Items</p>
          <div className="flex items-end justify-between">
            <h1 className="font-head text-3xl font-bold text-gray-900">
              My <span className="text-gradient">Wishlist</span>
            </h1>
            <button onClick={clearWishlist} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors">
              <FaTrash className="text-[10px]" /> Clear all
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* The heart on each card removes it from the wishlist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="btn-grad px-8 py-3.5">
            Continue Shopping <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
