import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { site } from "../config/site";
import BrandMark from "./BrandMark.jsx";

const shopLinks = [
  { name: "All Products", path: "/products" },
  { name: "New Arrivals", path: "/new-products" },
  { name: "Custom Orders", path: "/request-product" },
  { name: "Track Order", path: "/track-request" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "My Account", path: "/account" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
];

const contacts = [
  { icon: <FaPhone />, text: site.phoneDisplay, href: site.phoneHref },
  { icon: <FaEnvelope />, text: site.email, href: `mailto:${site.email}` },
  { icon: <FaMapMarkerAlt />, text: site.location },
];

const socials = [
  { name: "WhatsApp", icon: <FaWhatsapp />, url: site.whatsappHref, bg: "bg-green-500 hover:bg-green-600" },
  { name: "Facebook", icon: <FaFacebookF />, url: site.socials.facebook, bg: "bg-blue-600 hover:bg-blue-700" },
  { name: "Instagram", icon: <FaInstagram />, url: site.socials.instagram, bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" },
  { name: "TikTok", icon: <FaTiktok />, url: site.socials.tiktok, bg: "bg-black" },
].filter((s) => s.url);

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-ink">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="text-gray-500 hover:text-secondary transition-colors text-sm flex items-center gap-1.5 group">
              <FaArrowRight className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-700">
      <div className="h-1 w-full bg-gradient-to-r from-secondary via-primary to-secondary" />

      <div className="container px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <BrandMark size="w-12 h-12" pulse={false} />
              <div>
                <p className="text-base font-black tracking-wide text-ink uppercase">MM</p>
                <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase">Collectives</p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-sm">{site.blurb}</p>
            <div className="space-y-2.5">
              {contacts.map((contact) => {
                const Row = contact.href ? "a" : "div";
                return (
                  <Row key={contact.text} href={contact.href} className="flex items-center gap-2.5 group">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0 bg-gradient-to-br from-secondary to-primary">
                      {contact.icon}
                    </span>
                    <span className="text-sm text-gray-600 group-hover:text-secondary transition-colors">{contact.text}</span>
                  </Row>
                );
              })}
            </div>
          </div>

          <LinkColumn title="Shop" links={shopLinks} />
          <LinkColumn title="Company" links={companyLinks} />

          <div>
            <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-ink">Stay Connected</h3>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Message us for order updates, quotes, and help choosing between sea and air freight.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-9 h-9 ${social.bg} rounded-lg flex items-center justify-center text-white text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <Link to="/request-product" className="btn-grad mt-5 px-4 py-2.5 text-xs">
              Request an Item <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/30">
        <div className="container px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-secondary transition-colors">Terms</Link>
              <Link to="/track-request" className="hover:text-secondary transition-colors">Track</Link>
            </div>
          </div>
        </div>
      </div>

      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-30 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </footer>
  );
}
