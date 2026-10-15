import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaBoxOpen, FaChevronLeft, FaChevronRight, FaSearch, FaSortAmountDown, FaTimes } from "react-icons/fa";
import api from "../api/client";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard.jsx";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_SORT = "featured";

// key = ?tab= value, param = the /api/products filter it switches on
const TABS = [
  { key: "all", label: "All Products" },
  { key: "featured", label: "Featured", param: "featured" },
  { key: "new", label: "New", param: "new" },
  { key: "bestseller", label: "Bestsellers", param: "bestseller" },
  { key: "onSale", label: "On Sale", param: "onSale" },
];

const SORTS = [
  { value: "featured", label: "Featured First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

// Pages to show in the pager: first, last, and two either side of the current page
const pagerPages = (current, total) =>
  Array.from({ length: total }, (_, i) => i + 1).filter((p) => Math.abs(p - current) <= 2 || p === 1 || p === total);

// `fixedTab` locks the page to one filter (used by /new-products)
export default function Products({ fixedTab, eyebrow, title, accent }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters live in the URL so they survive refresh, back/forward and sharing
  const tabParam = searchParams.get("tab");
  const tab = fixedTab || (TABS.some((t) => t.key === tabParam) ? tabParam : "all");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || DEFAULT_SORT;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    // Any filter change returns to page 1
    next.delete("page");
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => updateParams({ search: searchInput.trim() }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    const params = { sort, page, limit: PAGE_SIZE };
    if (search) params.search = search;
    if (category) params.category = category;
    const tabFilter = TABS.find((t) => t.key === tab)?.param;
    if (tabFilter) params[tabFilter] = true;

    setLoading(true);
    setError("");
    api
      .get("/products", { params })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => !cancelled && setError("Failed to load products. Please try again."))
      .finally(() => !cancelled && setLoading(false));

    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      cancelled = true;
    };
  }, [tab, category, search, sort, page]);

  const hasFilters = Boolean(search || category || (!fixedTab && tab !== "all") || sort !== DEFAULT_SORT);
  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const categoryName = categories.find((c) => c._id === category)?.name;
  const visiblePages = pagerPages(page, pages);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {title && (
          <div className="mb-6">
            <p className="eyebrow mb-1.5">{eyebrow}</p>
            <h1 className="font-head text-3xl md:text-4xl font-bold text-gray-900">
              {title} <span className="text-gradient">{accent}</span>
            </h1>
          </div>
        )}

        {!fixedTab && (
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 mb-5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => updateParams({ tab: t.key === "all" ? "" : t.key })}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-200 whitespace-nowrap border ${
                  tab === t.key
                    ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md shadow-primary/25"
                    : "bg-white text-gray-800 border-gray-200 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-300 p-3 mb-5 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-44">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 text-xs" />
            <input
              type="text"
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="field pl-8 text-[13px]"
            />
          </div>
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value })}
            aria-label="Category"
            className="flex-shrink-0 py-2.5 px-3 text-[13px] border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-primary/40 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="relative flex-shrink-0">
            <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 text-xs pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value === DEFAULT_SORT ? "" : e.target.value })}
              aria-label="Sort by"
              className="pl-8 pr-3 py-2.5 text-[13px] border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-primary/40 bg-white"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {(search || category) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
                "{search}"
                <button onClick={() => { setSearchInput(""); updateParams({ search: "" }); }} aria-label="Clear search">
                  <FaTimes className="text-[9px]" />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-medium border border-secondary/20">
                {categoryName || "Category"}
                <button onClick={() => updateParams({ category: "" })} aria-label="Clear category">
                  <FaTimes className="text-[9px]" />
                </button>
              </span>
            )}
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-red-700 text-sm">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          !error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4">
                <FaBoxOpen className="text-2xl text-primary/50" />
              </div>
              <h3 className="font-head text-ink text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters</p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-primary text-sm underline">Clear all filters</button>
              )}
            </div>
          )
        ) : (
          <>
            <p className="text-[11px] text-gray-400 mb-4">Showing {products.length} of {total} products</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </>
        )}

        {!loading && pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={page <= 1}
              aria-label="Previous page"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:border-primary hover:text-primary transition-all"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            {visiblePages.map((p, i) => (
              <React.Fragment key={p}>
                {i > 0 && visiblePages[i - 1] !== p - 1 && <span className="text-gray-300 text-sm px-1">…</span>}
                <button
                  onClick={() => updateParams({ page: String(p) })}
                  className={`w-9 h-9 rounded-xl text-[13px] border transition-all font-medium ${
                    p === page
                      ? "bg-gradient-to-br from-primary to-secondary text-white border-transparent shadow-md shadow-primary/25"
                      : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
            <button
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={page >= pages}
              aria-label="Next page"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:border-primary hover:text-primary transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
