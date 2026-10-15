import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaGlobeAsia,
  FaHeart,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaRegStar,
  FaShip,
  FaShoppingCart,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import api from "../api/client";
import ProductCard from "../components/ProductCard.jsx";
import Stars from "../components/Stars.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { productImages } from "../utils/placeholders";
import { formatGHS, getPricing, isInStock, isLowStock } from "../utils/pricing";

const TABS = ["Description", "Shipping & Details", "Reviews"];
const ADDED_FEEDBACK_MS = 2000;
const emptyReview = { name: "", rating: 5, title: "", comment: "" };

function InfoPanel({ product }) {
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [variantSelections, setVariantSelections] = useState({});
  const [variantError, setVariantError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inStock = isInStock(product);
  const lowStock = isLowStock(product);
  const inCart = isInCart(product._id);
  const wished = isInWishlist(product._id);
  const variants = product.variants || [];
  const { unit, original, onSale, groupBuy, discountPct } = getPricing(product, quantity);

  const changeQuantity = (next) => setQuantity(Math.max(1, Math.floor(Number(next)) || 1));

  const handleAdd = () => {
    if (!inStock) return;
    if (variants.some((v) => !variantSelections[v.name])) {
      setVariantError(true);
      return;
    }
    addItem(product, quantity, variantSelections);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
  };

  let stockClass = "bg-green-50 text-green-700 border-green-200";
  let stockLabel = <><FaCheck className="text-[10px]" /> In Stock</>;
  if (!inStock) {
    stockClass = "bg-red-50 text-red-600 border-red-200";
    stockLabel = <><FaExclamationTriangle className="text-[10px]" /> Out of Stock</>;
  } else if (lowStock) {
    stockClass = "bg-orange-50 text-orange-600 border-orange-200";
    stockLabel = <><FaCheck className="text-[10px]" /> Only {product.stock} left</>;
  }

  return (
    <div className="panel p-5 lg:p-6">
      {product.category?.name && (
        <Link
          to={`/products?category=${product.category._id}`}
          className="inline-block text-[10px] uppercase tracking-[2px] font-semibold px-2.5 py-1 rounded-full bg-primary/90 text-white hover:bg-primary transition-colors mb-3"
        >
          {product.category.name}
        </Link>
      )}
      <h1 className="font-head text-xl font-bold text-gray-900 leading-snug mb-1">{product.name}</h1>
      {product.brand && (
        <p className="text-gray-400 text-sm mb-3">
          by <span className="text-primary font-medium">{product.brand}</span>
        </p>
      )}
      {product.ratingCount > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <Stars value={product.ratingAvg} className="text-sm" />
          <span className="text-gray-500 text-xs">
            {product.ratingAvg} ({product.ratingCount} rating{product.ratingCount === 1 ? "" : "s"})
          </span>
        </div>
      )}

      <div className="h-px my-4 bg-gradient-to-r from-primary/30 via-secondary/10 to-transparent" />

      <div className="flex items-baseline gap-3 flex-wrap mb-4">
        <span className="font-head text-3xl font-bold text-ink">
          <span className="text-base font-medium text-gray-600">GH₵</span>
          {formatGHS(unit)}
        </span>
        {original && (
          <div>
            <span className="text-sm text-gray-400 line-through">GH₵{formatGHS(original)}</span>
            <p className="text-green-600 text-xs font-medium mt-0.5">
              Save GH₵{formatGHS(original - unit)} each
              {onSale && !groupBuy && discountPct > 0 && ` (${discountPct}% off)`}
              {groupBuy && " with group-buy pricing"}
            </p>
          </div>
        )}
      </div>

      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs mb-4 font-medium border ${stockClass}`}>
        {stockLabel}
      </div>

      {variants.map((variant) => (
        <div key={variant.name} className="mb-4">
          <p className="field-label">
            {variant.name}
            {variantSelections[variant.name] && <span className="text-primary">: {variantSelections[variant.name]}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setVariantSelections({ ...variantSelections, [variant.name]: option });
                  setVariantError(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  variantSelections[variant.name] === option
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                    : "border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      {variantError && <p className="text-red-500 text-xs -mt-2 mb-3">Please choose an option for each of the above.</p>}

      <div className="flex items-center gap-3 mb-4">
        <span className="field-label mb-0">Quantity</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => changeQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
          >
            <FaMinus className="text-[10px]" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => changeQuantity(e.target.value)}
            aria-label="Quantity"
            className="w-12 h-9 text-center font-head text-sm font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => changeQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <FaPlus className="text-[10px]" />
          </button>
        </div>
      </div>

      {product.minGroupBuyQty > 0 && product.groupBuyDiscountPct > 0 && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs mb-4 border ${
            groupBuy ? "bg-green-50 border-green-200 text-green-700" : "bg-secondary/10 border-secondary/20 text-gray-700"
          }`}
        >
          <FaUsers className="flex-shrink-0" />
          {groupBuy
            ? `Group-buy discount applied: ${product.groupBuyDiscountPct}% off`
            : `Buy ${product.minGroupBuyQty}+ for ${product.groupBuyDiscountPct}% off (group buy)`}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className={`flex-1 py-3.5 rounded-xl text-sm font-semibold font-head flex items-center justify-center gap-2 transition-all duration-200 ${
            !inStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : justAdded
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg shadow-primary/25"
          }`}
        >
          {justAdded ? (
            <><FaCheck /> Added!</>
          ) : (
            <><FaShoppingCart /> {!inStock ? "Out of Stock" : inCart ? "Add More" : "Add to Cart"}</>
          )}
        </button>
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 ${
            wished
              ? "bg-red-50 text-rose-500 border-red-200"
              : "bg-gray-50 text-gray-400 border-gray-200 hover:border-primary/30 hover:text-primary/60"
          }`}
        >
          {wished ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      {inCart && (
        <Link to="/cart" className="block text-center text-xs text-primary font-medium hover:underline mb-4">
          This item is in your cart — view cart →
        </Link>
      )}

      <div className="space-y-2.5 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FaShip className="text-primary text-xs" />
          </span>
          Sea or air freight to Ghana — you choose at checkout
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <FaGlobeAsia className="text-secondary text-xs" />
          </span>
          Sourced from {product.sourceCountry || "China"}
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }) {
  const [form, setForm] = useState(emptyReview);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post(`/products/${productId}/reviews`, form);
      onSubmitted(res.data);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
        ✓ Thank you! Your review has been submitted.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10">
      <h3 className="font-head text-ink font-bold mb-4">Write a Review</h3>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <button key={i} type="button" onClick={() => setForm({ ...form, rating: i + 1 })} aria-label={`${i + 1} star${i ? "s" : ""}`}>
            {i < form.rating ? (
              <FaStar className="text-orange-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl hover:text-orange-300" />
            )}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input className="field" placeholder="Your name" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="field" placeholder="Review title" maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <textarea
        className="field resize-none mb-3"
        rows={3}
        maxLength={1500}
        placeholder="Share your experience…"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
      />
      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-grad px-6 py-2.5">
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

function DetailTabs({ product, onReviewed }) {
  const [tab, setTab] = useState(TABS[0]);
  const reviews = [...(product.reviews || [])].reverse();

  const details = [
    ["Category", product.category?.name],
    ["Brand", product.brand],
    ["Sourced from", product.sourceCountry || "China"],
    ["Unit weight", product.unitWeightKg > 0 ? `${product.unitWeightKg} kg` : null],
    ...(product.variants || []).map((v) => [v.name, v.options.join(", ")]),
  ].filter(([, value]) => value);

  return (
    <div className="panel overflow-hidden">
      <div className="no-scrollbar flex border-b border-gray-100 overflow-x-auto">
        {TABS.map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`font-head flex-shrink-0 px-5 py-4 text-sm font-semibold transition-colors relative ${
              tab === name ? "text-primary" : "text-gray-400 hover:text-ink"
            }`}
          >
            {name}
            {name === "Reviews" && product.ratingCount > 0 && (
              <span className="ml-1 text-[10px] text-gray-400 font-body">({product.ratingCount})</span>
            )}
            {tab === name && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" />}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "Description" && (
          <div>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
            {product.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-ink/5 border border-ink/10 text-ink/70 text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Shipping & Details" && (
          <div>
            <table className="w-full text-sm mb-5">
              <tbody>
                {details.map(([label, value]) => (
                  <tr key={label} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink w-1/3">{label}</td>
                    <td className="py-3 text-gray-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sea freight is the cheaper option (roughly 6–8 weeks); air freight is faster (roughly 1–2 weeks).
              Shipping and customs are estimated from item weight when you place your order, and you can follow
              every stage from the Track Order page.
            </p>
          </div>
        )}

        {tab === "Reviews" && (
          <div>
            {product.ratingCount > 0 && (
              <div className="inline-block text-center mb-6 px-6 py-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                <p className="font-head text-4xl font-bold text-ink">{product.ratingAvg}</p>
                <div className="flex justify-center my-1"><Stars value={product.ratingAvg} className="text-xs" /></div>
                <p className="text-gray-400 text-xs">{product.ratingCount} review{product.ratingCount === 1 ? "" : "s"}</p>
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-4 mb-8">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-50 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold font-head">
                          {(review.name || "A")[0].toUpperCase()}
                        </span>
                        <span className="font-head text-ink text-sm font-semibold">{review.name || "Anonymous"}</span>
                      </div>
                      <Stars value={review.rating} className="text-xs" />
                    </div>
                    {review.title && <p className="font-head text-ink text-sm font-semibold mb-1">{review.title}</p>}
                    {review.comment && <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>}
                    <p className="text-gray-300 text-xs mt-2">{new Date(review.createdAt).toDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm mb-6">No reviews yet. Be the first!</p>
            )}

            <ReviewForm productId={product._id} onSubmitted={onReviewed} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setImageIndex(0);
    setRelated([]);

    (async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        if (cancelled) return;
        setProduct(res.data);
        const categoryId = res.data.category?._id;
        if (categoryId) {
          const more = await api.get("/products", { params: { category: categoryId, sort: "featured", limit: 5 } });
          if (!cancelled) setRelated(more.data.products.filter((p) => p._id !== res.data._id).slice(0, 4));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4">
            <FaBoxOpen className="text-3xl text-primary/50" />
          </div>
          <h2 className="font-head text-ink text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">It may have been removed or the link is incorrect.</p>
          <Link to="/products" className="text-primary text-sm underline">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const images = productImages(product);
  const { onSale, discountPct } = getPricing(product);
  const step = (delta) => setImageIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-16">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.category?.name && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.category._id}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{product.name}</span>
        </nav>

        <div className="flex gap-4 lg:gap-6 mb-10 flex-col lg:flex-row">
          {images.length > 1 && (
            <div className="no-scrollbar lg:w-[72px] flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] flex-shrink-0 order-2 lg:order-1">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-full rounded-xl overflow-hidden border-2 bg-white transition-all duration-200 ${
                    i === imageIndex ? "border-primary shadow-md shadow-primary/20" : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 order-1 lg:order-2 min-w-0">
            <div className="relative bg-white rounded-2xl overflow-hidden group border border-gray-100 aspect-square lg:max-h-[560px] w-full">
              {images.length > 0 ? (
                <img src={images[imageIndex]} alt={product.name} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <FaBoxOpen className="text-6xl text-gray-200" />
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:text-primary hover:scale-110 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:text-primary hover:scale-110 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </>
              )}
              {onSale && discountPct > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg font-head shadow-md shadow-primary/30">
                  -{discountPct}% OFF
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[340px] xl:w-[380px] flex-shrink-0 order-3">
            <div className="lg:sticky lg:top-32">
              {/* key resets quantity and variant choices when navigating between products */}
              <InfoPanel key={product._id} product={product} />
            </div>
          </div>
        </div>

        <DetailTabs key={product._id} product={product} onReviewed={setProduct} />

        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-head text-xl font-bold text-ink">
                More from <span className="text-gradient">{product.category?.name}</span>
              </h2>
              <Link to={`/products?category=${product.category._id}`} className="text-xs text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item, index) => (
                <ProductCard key={item._id} product={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
