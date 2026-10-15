import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaChevronRight,
  FaEnvelope,
  FaHeart,
  FaPhone,
  FaShoppingCart,
  FaStore,
  FaTimes,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { navLinks, site } from "../config/site";
import BrandMark from "./BrandMark.jsx";

const sectionLabel = "text-[9px] font-bold text-gray-400 uppercase tracking-[3px] px-1 mb-2";
const divider = "mx-4 my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent";

export default function MobileMenu({ open, onClose }) {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`font-nav fixed top-0 right-0 z-50 h-screen w-[320px] max-w-[88vw] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-secondary via-primary to-secondary px-5 pt-5 pb-6">
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] stripe-bg" />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/35 hover:rotate-90 transition-all duration-200 z-10"
            aria-label="Close menu"
          >
            <FaTimes className="text-xs" />
          </button>

          <div className="relative z-10 flex items-center gap-3">
            <BrandMark size="w-12 h-12" />
            <div className="text-white">
              <p className="font-display font-bold text-[22px] leading-tight drop-shadow">{site.name}</p>
              <p className="text-[7px] font-medium tracking-[3.5px] text-white/65 mt-0.5">{site.tagline}</p>
            </div>
          </div>

          <div className="relative z-10 flex gap-2 mt-4">
            <Link
              to="/cart"
              className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 bg-black/20 hover:bg-black/35 border border-white/20 transition-all duration-200"
            >
              <FaShoppingCart className="text-white text-sm" />
              <div>
                <p className="text-white text-[11px] font-semibold leading-tight">Cart</p>
                <p className="text-white/55 text-[9px]">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
            <Link
              to="/wishlist"
              className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 bg-black/20 hover:bg-black/35 border border-white/20 transition-all duration-200"
            >
              <FaHeart className="text-white text-sm" />
              <div>
                <p className="text-white text-[11px] font-semibold leading-tight">Wishlist</p>
                <p className="text-white/55 text-[9px]">{wishlistCount} saved</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-3 pt-4 pb-2">
            <p className={sectionLabel}>Navigation</p>
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] transition-all duration-200 border ${
                      isActive
                        ? "bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20 font-semibold text-primary"
                        : "border-transparent font-medium text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label === "New" ? "New Arrivals" : link.label}
                  <FaChevronRight className="text-[9px] text-gray-300" />
                </NavLink>
              ))}
              <NavLink
                to={user ? "/account" : "/login"}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium text-gray-700 hover:bg-gray-50 border border-transparent"
              >
                <span className="flex items-center gap-2">
                  <FaUser className="text-[11px] text-primary" />
                  {user ? "My Account" : "Login / Register"}
                </span>
                <FaChevronRight className="text-[9px] text-gray-300" />
              </NavLink>
            </div>
          </div>

          <div className={divider} />

          <div className="px-3 pb-2">
            <p className={sectionLabel}>Contact Us</p>
            <div className="space-y-0.5">
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-600">
                  <FaWhatsapp className="text-white text-xs" />
                </span>
                <span className="text-[12px] text-gray-600 font-medium">Chat on WhatsApp</span>
              </a>
              <a href={site.phoneHref} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary">
                  <FaPhone className="text-white text-[9px]" />
                </span>
                <span className="text-[12px] text-gray-600 font-medium">{site.phoneDisplay}</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary">
                  <FaEnvelope className="text-white text-[9px]" />
                </span>
                <span className="text-[12px] text-gray-600 font-medium">{site.email}</span>
              </a>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-400 py-4 px-4">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>

        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <Link
            to="/products"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-[13px] font-semibold tracking-wide shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaStore className="text-xs opacity-80" />
            Shop All Products
          </Link>
        </div>
      </aside>
    </>
  );
}
