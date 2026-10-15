import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaHeart, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { navLinks, site, tickerMessages } from "../config/site";
import BrandMark from "./BrandMark.jsx";
import MobileMenu from "./MobileMenu.jsx";

const badgeCount = (n) => (n > 9 ? "9+" : n);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Announcement ticker */}
      <div className="fixed top-0 left-0 w-full overflow-hidden z-50 h-8 flex items-center bg-gradient-to-r from-secondary via-primary to-secondary">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] stripe-bg" />
        <div className="ticker">
          {/* Rendered twice so the -50% translate loops seamlessly */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {tickerMessages.map((message) => (
                <span
                  key={message}
                  className="font-nav text-white text-[10px] font-semibold tracking-[1.5px] uppercase whitespace-nowrap px-8"
                >
                  ✦ {message}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav
        className={`font-nav fixed left-0 top-8 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.07)] border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100/70"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-primary to-secondary" />
        <div className="container px-4 lg:px-8">
          <div className="flex items-center justify-between h-[68px] lg:h-[74px]">
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <BrandMark />
              <div>
                <p className="font-display font-bold text-[21px] lg:text-[24px] leading-tight bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {site.name}
                </p>
                <p className="text-[7px] font-medium tracking-[3.5px] text-gray-500 mt-0.5">{site.tagline}</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `relative px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-sm"
                        : "text-gray-700 hover:text-primary after:absolute after:bottom-[3px] after:left-1/2 after:h-[1.5px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-current after:transition-all hover:after:w-3/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-1 lg:gap-2">
              <Link
                to="/wishlist"
                title="Wishlist"
                aria-label="Wishlist"
                className="relative p-2.5 rounded-xl hover:bg-rose-50 transition-all duration-200 group"
              >
                <FaHeart className="text-[17px] text-primary group-hover:text-rose-500 transition-colors duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow">
                    {badgeCount(wishlistCount)}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                title="Cart"
                aria-label="Cart"
                className="relative p-2.5 rounded-xl hover:bg-secondary/10 transition-all duration-200 group"
              >
                <FaShoppingCart className="text-[17px] text-primary group-hover:text-secondary transition-colors duration-200" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-secondary to-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow">
                    {badgeCount(itemCount)}
                  </span>
                )}
              </Link>
              <div className="hidden lg:block w-px h-5 bg-gray-200 mx-1" />
              <Link
                to={user ? "/account" : "/login"}
                title={user ? "My account" : "Login"}
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
              >
                <FaUser className="text-[13px] text-primary" />
                {user ? `Hi, ${user.name?.split(" ")[0]}` : "Login"}
              </Link>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes className="text-[18px] text-red-500" /> : <FaBars className="text-[20px] text-primary" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for the fixed ticker + nav */}
      <div className="h-[100px] lg:h-[106px]" />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
