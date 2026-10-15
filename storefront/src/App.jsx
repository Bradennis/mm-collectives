import React, { useEffect } from "react";
import { Link, Navigate, Routes, Route, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import RequestProduct from "./pages/RequestProduct.jsx";
import Track from "./pages/Track.jsx";
import About from "./pages/About.jsx";
import Legal from "./pages/Legal.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

// Old /product/:slug links keep working
function LegacyProductRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/products/${slug}`} replace />;
}

function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-secondary text-xs font-semibold tracking-[4px] uppercase mb-4">404</p>
        <h1 className="font-head text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-solid px-6 py-3">Back to Home</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/new-products"
            element={<Products fixedTab="new" eyebrow="Just Landed" title="New" accent="Arrivals" />}
          />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/request-product" element={<RequestProduct />} />
          <Route path="/track-request" element={<Track />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<Legal type="privacy" />} />
          <Route path="/terms-of-service" element={<Legal type="terms" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />

          {/* Routes from the previous storefront */}
          <Route path="/shop" element={<Navigate to="/products" replace />} />
          <Route path="/product/:slug" element={<LegacyProductRedirect />} />
          <Route path="/checkout" element={<Navigate to="/cart" replace />} />
          <Route path="/import-request" element={<Navigate to="/request-product" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
