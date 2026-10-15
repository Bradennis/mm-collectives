import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeadset, FaSearchPlus, FaShieldAlt, FaShip, FaTag } from "react-icons/fa";
import api from "../api/client";
import Hero from "../components/Hero.jsx";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard.jsx";
import { categoryImage } from "../utils/placeholders";

const HOME_CATEGORY_LIMIT = 6;
const HOME_PRODUCT_LIMIT = 8;

const promises = [
  {
    icon: FaShieldAlt,
    title: "Checked Before Dispatch",
    desc: "Items are sourced directly and quality-checked before they leave for Ghana.",
  },
  {
    icon: FaShip,
    title: "Sea or Air Freight",
    desc: "Choose cheaper sea freight or faster air freight, with shipping and customs estimated upfront.",
  },
  {
    icon: FaHeadset,
    title: "Tracked End to End",
    desc: "Follow your order from the supplier in China through customs to your door.",
  },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productTotal, setProductTotal] = useState(null);
  const [showingFeatured, setShowingFeatured] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});

    (async () => {
      try {
        const [featured, all] = await Promise.all([
          api.get("/products", { params: { featured: true, sort: "featured", limit: HOME_PRODUCT_LIMIT } }),
          api.get("/products", { params: { limit: HOME_PRODUCT_LIMIT } }),
        ]);
        setProductTotal(all.data.total);
        // Until some products are marked featured, show the newest ones instead of an empty section
        if (featured.data.products.length > 0) {
          setProducts(featured.data.products);
        } else {
          setProducts(all.data.products);
          setShowingFeatured(false);
        }
      } catch {
        // leave the section empty; the rest of the page still renders
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { number: productTotal ?? "—", label: "Products" },
    { number: categories.length || "—", label: "Categories" },
    { number: "Sea + Air", label: "Freight Options" },
    { number: "Live", label: "Order Tracking" },
  ];

  return (
    <div className="bg-[#f5f5f5]">
      <Hero stats={stats} />

      {categories.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-1.5">Shop by Category</p>
                <h2 className="font-head text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  What are you <span className="text-primary">looking for?</span>
                </h2>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                See all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, HOME_CATEGORY_LIMIT).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="fade-up group relative rounded-xl overflow-hidden block bg-gray-100 aspect-[3/4] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <img
                    src={categoryImage(category)}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-head text-white font-semibold text-[16px] leading-tight">{category.name}</p>
                    <span className="text-white/60 text-[10px] group-hover:text-secondary transition-colors">Shop now →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden relative min-h-[140px] bg-gradient-to-r from-ink via-[#16213e] to-primary">
            <div className="absolute inset-0 opacity-[0.06] stripe-bg" />
            <div className="relative flex items-center justify-between px-6 sm:px-10 py-8 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="text-orange-400 text-sm" />
                  <span className="text-orange-300 text-xs tracking-widest uppercase font-semibold">On Sale Deals</span>
                </div>
                <h3 className="font-head text-white text-2xl sm:text-3xl font-bold leading-tight">
                  Marked down <span className="text-orange-400">this week</span>
                </h3>
                <p className="text-white/60 text-sm mt-1">Reduced prices on selected imported products</p>
              </div>
              <Link to="/products?tab=onSale" className="font-head inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
                Shop Deals <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-1.5">Our Collection</p>
              <h2 className="font-head text-3xl md:text-4xl font-bold text-gray-900">
                {showingFeatured ? "Featured" : "Latest"} <span className="text-gradient">Products</span>
              </h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-75 transition-opacity">
              View all <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: HOME_PRODUCT_LIMIT }, (_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}
          </div>

          {!loading && products.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">Products are on the way — check back soon.</p>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn-grad px-8 py-3.5">
              View All Products <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Our Promise</p>
            <h2 className="font-head text-3xl font-bold text-gray-900">Why Shop With Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promises.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl border-2 border-gray-100 bg-[#fafafa] transition-all duration-200 hover:border-primary hover:-translate-y-0.5">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center bg-primary/10">
                  <Icon className="text-lg text-primary" />
                </div>
                <div>
                  <h3 className="font-head font-bold text-primary mb-1">{title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden p-8 md:p-10 text-center">
            <div className="absolute inset-0 dot-bg" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-primary/30 rounded-full opacity-40" />
            <div className="relative z-10">
              <p className="text-[11px] font-semibold tracking-[3px] uppercase text-secondary mb-2">Not in our catalog?</p>
              <h3 className="font-head text-xl md:text-2xl font-bold text-white mb-4">Request Any Product from China</h3>
              <Link to="/request-product" className="btn-solid px-7 py-3">
                <FaSearchPlus className="text-xs" /> Submit a Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
