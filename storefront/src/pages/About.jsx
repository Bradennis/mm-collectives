import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxes,
  FaChevronRight,
  FaEnvelope,
  FaGlobeAfrica,
  FaHandshake,
  FaMapMarkedAlt,
  FaPhone,
  FaSearchPlus,
  FaShieldAlt,
  FaShip,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";
import { site } from "../config/site";

const values = [
  {
    icon: FaGlobeAfrica,
    title: "Direct Sourcing",
    description: "We buy straight from suppliers in China and bring the goods to Ghana, cutting out layers of middlemen.",
  },
  {
    icon: FaHandshake,
    title: "Transparent Pricing",
    description: "Prices are in cedis, and shipping and customs are estimated from item weight before you commit.",
  },
  {
    icon: FaShieldAlt,
    title: "Accountable Delivery",
    description: "Every order has a number you can track from the supplier, through customs, to your door.",
  },
];

const reasons = [
  { icon: FaShip, title: "Sea or Air Freight", description: "Pick the cheaper or the faster route" },
  { icon: FaSearchPlus, title: "Custom Sourcing", description: "Request any item you've seen online" },
  { icon: FaUsers, title: "Group-Buy Discounts", description: "Lower prices when you order in bulk" },
  { icon: FaMapMarkedAlt, title: "Order Tracking", description: "Eight stages from order to delivery" },
  { icon: FaBoxes, title: "Growing Catalog", description: "Ready-to-order products across categories" },
  { icon: FaWhatsapp, title: "WhatsApp Support", description: "Talk to a person about your order" },
];

const steps = [
  { step: "01", title: "Browse or Request", desc: "Order from the catalog or tell us what you want sourced." },
  { step: "02", title: "We Confirm & Quote", desc: "Our team confirms availability, pricing and freight with you." },
  { step: "03", title: "We Ship to Ghana", desc: "Your goods travel by sea or air and clear customs." },
  { step: "04", title: "Delivered", desc: "We deliver to your address and close out the order." },
];

function SectionHeading({ eyebrow, title, accent }) {
  return (
    <div className="text-center mb-12">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-head text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {title} <span className="text-gradient">{accent}</span>
      </h2>
      <div className="w-12 h-0.5 bg-primary mx-auto" />
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 dot-bg" />
        <div className="absolute top-24 right-16 w-72 h-72 border border-primary/30 rounded-full opacity-40" />
        <div className="absolute bottom-10 left-10 w-48 h-48 border border-primary/20 rounded-full opacity-30" />
        <div className="relative z-10 text-center px-4 py-16 fade-up">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-secondary mb-4">Our Story</p>
          <h1 className="font-head text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            MM <span className="text-secondary">Collectives</span>
          </h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Your bridge between China's vast marketplace and Ghana's demand for quality, affordable products.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <Link to="/products" className="font-head inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-primary text-white px-7 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">
              Shop Now <FaArrowRight className="text-xs" />
            </Link>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/20 text-white/80 px-7 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">
              <FaWhatsapp className="text-green-400" /> Contact Us
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="eyebrow mb-3">What We Do</p>
            <h2 className="font-head text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Connecting Two <span className="text-gradient">Worlds</span>
            </h2>
            <div className="w-12 h-0.5 bg-primary mb-6" />
            <p className="text-gray-500 leading-relaxed mb-4 text-sm">
              MM Collectives exists for a simple reason: buying from China shouldn't require knowing a supplier,
              a freight agent, and a clearing agent. We handle sourcing, shipping, and customs so you only deal with us.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6 text-sm">
              Shop the catalog for ready-to-order items, or send us a link or description of anything you've found
              on 1688, Alibaba, or Taobao and we'll come back with a quote.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300">
              Explore our products <FaChevronRight className="text-xs" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full border border-primary/20 rounded-2xl" />
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl aspect-[4/3] overflow-hidden border border-gray-200 shadow-xl shadow-primary/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <FaGlobeAfrica className="text-4xl text-primary" />
                </div>
                <p className="font-head text-2xl font-bold text-gray-900 mb-1">China × Ghana</p>
                <p className="text-gray-400 text-sm">Quality products. Fair prices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading eyebrow="What We Believe" title="Our Core" accent="Values" />
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary text-2xl border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  <Icon />
                </div>
                <h3 className="font-head text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading eyebrow="Why Us" title="Why Choose" accent="MM Collectives" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-white hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  <Icon />
                </div>
                <div>
                  <h3 className="font-head text-sm font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading eyebrow="The Process" title="How It" accent="Works" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <p className="font-head text-3xl font-bold text-gradient mb-3">{item.step}</p>
                <h3 className="font-head text-sm font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 dot-bg" />
        <div className="absolute -top-10 right-10 w-64 h-64 border border-primary/30 rounded-full opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-secondary mb-3">Get in Touch</p>
          <h2 className="font-head text-3xl md:text-4xl font-bold text-white mb-2">Talk to Our Team</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Questions about an order, a quote, or which freight option suits you? Reach us directly.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
              <FaPhone className="text-xs" /> {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
              <FaEnvelope className="text-xs" /> {site.email}
            </a>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <Link to="/privacy-policy" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy Policy</Link>
            <span className="text-white/20 text-xs">·</span>
            <Link to="/terms-of-service" className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
