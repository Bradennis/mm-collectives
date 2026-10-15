import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheck,
  FaChevronLeft,
  FaExclamationTriangle,
  FaMinus,
  FaPlane,
  FaPlus,
  FaShip,
  FaShoppingCart,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatGHS, getPricing } from "../utils/pricing";

const STEPS = [
  { n: 1, label: "Review Cart" },
  { n: 2, label: "Your Details" },
];

const SHIPPING_MODES = [
  { value: "sea", icon: FaShip, title: "Sea freight", detail: "Cheaper · about 6–8 weeks" },
  { value: "air", icon: FaPlane, title: "Air freight", detail: "Faster · about 1–2 weeks" },
];

const variantText = (selections = {}) =>
  Object.entries(selections).map(([name, value]) => `${name}: ${value}`).join(" · ");

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {STEPS.map(({ n, label }, index) => (
        <div key={n} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-head transition-all duration-300 ${
                step >= n ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-md shadow-primary/30" : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > n ? <FaCheck className="text-xs" /> : n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= n ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
          </div>
          {index < STEPS.length - 1 && <div className={`w-16 h-px transition-all duration-300 ${step > n ? "bg-primary" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function OrderPlacedModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="pop-in bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" role="dialog" aria-modal="true">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
          <FaCheck className="text-3xl text-green-500" />
        </div>
        <p className="eyebrow mb-1">Order Received!</p>
        <h2 className="font-head text-2xl font-bold text-gray-900 mb-4">We'll be in touch</h2>
        <div className="inline-block bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-5">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order Number</p>
          <p className="font-head text-xl font-bold text-gray-900 tracking-wider">{order.orderNumber}</p>
        </div>

        <div className="text-left text-sm bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
          <div className="flex justify-between"><span className="text-gray-500">Items</span><span>GH₵{formatGHS(order.itemsSubtotalGHS)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Shipping (est., {order.shippingMode})</span><span>GH₵{formatGHS(order.shippingFeeGHS)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Customs (est.)</span><span>GH₵{formatGHS(order.customsFeeGHS)}</span></div>
          <div className="flex justify-between font-head font-bold text-gray-900 pt-1.5 border-t border-gray-200"><span>Estimated total</span><span>GH₵{formatGHS(order.totalGHS)}</span></div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          No payment has been taken. Our team will contact you to confirm the order and arrange payment.
          Keep your order number — you can use it to track progress.
        </p>
        <div className="flex gap-3">
          <Link to={`/track-request?ref=${order.orderNumber}`} className="btn-solid flex-1 py-3">Track Order</Link>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRemove({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="pop-in bg-white rounded-2xl shadow-xl max-w-xs w-full p-6 text-center" role="dialog" aria-modal="true">
        <FaExclamationTriangle className="text-2xl text-amber-500 mx-auto mb-3" />
        <h3 className="font-head text-base font-bold text-gray-900 mb-2">Remove Item?</h3>
        <p className="text-gray-500 text-sm mb-5">This will remove the item from your cart.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 font-head bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Remove</button>
        </div>
      </div>
    </div>
  );
}

function ItemThumb({ item, size }) {
  return (
    <div className={`${size} rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100`}>
      {item.image ? (
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><FaBoxOpen className="text-gray-300" /></div>
      )}
    </div>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, subtotalGHS, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [details, setDetails] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: "",
    area: "",
    landmark: "",
    notes: "",
  });
  const [mode, setMode] = useState("sea");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // The session loads asynchronously, so prefill once it arrives without overwriting anything typed
  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({ ...d, name: d.name || user.name || "", phone: d.phone || user.phone || "", email: d.email || user.email || "" }));
  }, [user]);

  const setField = (field) => (e) => setDetails({ ...details, [field]: e.target.value });

  const goToStep = (next) => {
    setStep(next);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = async () => {
    if (!details.name.trim()) return setError("Please enter your full name.");
    if (!details.phone.trim()) return setError("Please enter a phone number we can reach you on.");
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) return setError("Please enter a valid email address.");
    if (!details.area.trim()) return setError("Please enter a delivery address.");

    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variantSelections: i.variantSelections })),
        customer: { name: details.name.trim(), phone: details.phone.trim(), email: details.email.trim() },
        shippingAddress: { city: details.city.trim(), area: details.area.trim(), landmark: details.landmark.trim() },
        notes: details.notes.trim(),
        mode,
      });
      setPlacedOrder(res.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-[80vh] bg-gray-50">
        <OrderPlacedModal order={placedOrder} onClose={() => navigate("/products")} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
            <FaShoppingCart className="text-4xl text-primary" />
          </div>
          <h2 className="font-head text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Browse our collections and add products you're interested in.</p>
          <Link to="/products" className="btn-solid px-8 py-3.5">
            Browse Products <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4">
      {pendingRemoval && (
        <ConfirmRemove
          onConfirm={() => {
            removeItem(pendingRemoval);
            setPendingRemoval(null);
          }}
          onCancel={() => setPendingRemoval(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="eyebrow mb-1.5">{step === 1 ? "Review & Order" : "Your Details"}</p>
          <h1 className="font-head text-3xl font-bold text-gray-900">
            {step === 1 ? "Your " : "Delivery "}
            <span className="text-gradient">{step === 1 ? "Cart" : "Info"}</span>
          </h1>
        </div>

        <StepIndicator step={step} />

        {step === 1 && (
          <div className="slide-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const { unit, original, groupBuy } = getPricing(item, item.quantity);
                const variants = variantText(item.variantSelections);
                return (
                  <div key={item.key} className="panel p-4">
                    <div className="flex gap-4">
                      <Link to={`/products/${item.slug}`}><ItemThumb item={item} size="w-20 h-20" /></Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/products/${item.slug}`} className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                              {item.name}
                            </Link>
                            {variants && <p className="text-gray-400 text-xs mt-0.5">{variants}</p>}
                            {item.categoryName && (
                              <span className="inline-block text-[9px] text-white bg-gradient-to-r from-primary to-secondary px-2 py-0.5 rounded-full mt-1 font-medium">
                                {item.categoryName}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setPendingRemoval(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-3">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-head font-bold text-gray-900">
                                <span className="text-[11px] text-secondary">GH₵</span>
                                <span className="text-[16px] ml-0.5">{formatGHS(unit)}</span>
                              </span>
                              {original && <span className="text-gray-400 text-xs line-through">GH₵{formatGHS(original)}</span>}
                            </div>
                            {groupBuy && <p className="text-green-600 text-[10px] font-medium">Group-buy price applied</p>}
                            <p className="text-gray-400 text-[10px] mt-0.5">Subtotal: GH₵{formatGHS(unit * item.quantity)}</p>
                          </div>
                          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>
                            <span className="w-8 text-center font-head text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button onClick={clearCart} className="text-xs text-gray-600 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                  <FaTrash className="text-[10px]" /> Clear all items
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="panel p-5 shadow-md shadow-primary/5 lg:sticky lg:top-32">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary mb-1">Summary</p>
                <h2 className="font-head text-lg font-bold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2.5 pb-4 border-b border-gray-100 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                    <span className="font-head font-semibold text-gray-900">GH₵{formatGHS(subtotalGHS)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping & customs</span>
                    <span className="text-gray-400 text-xs italic">Estimated at next step</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-5">
                  No payment is taken online. Our team will contact you to confirm your order and arrange payment.
                </p>
                <button onClick={() => goToStep(2)} className="btn-solid w-full py-3.5">
                  Continue to Details <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="slide-in max-w-3xl mx-auto">
            <button onClick={() => goToStep(1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
              <FaChevronLeft className="text-xs" /> Back to Cart
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3 panel p-6 shadow-md shadow-primary/5">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary mb-1">Step 2 of 2</p>
                <h2 className="font-head text-xl font-bold text-gray-900 mb-5">Your Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="field-label" htmlFor="cart-name">Full Name <span className="text-red-400">*</span></label>
                    <input id="cart-name" className="field" placeholder="Your full name" value={details.name} onChange={setField("name")} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label" htmlFor="cart-phone">Phone Number <span className="text-red-400">*</span></label>
                      <input id="cart-phone" type="tel" className="field" placeholder="e.g. 0241234567" value={details.phone} onChange={setField("phone")} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="cart-email">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input id="cart-email" type="email" className="field" placeholder="your@email.com" value={details.email} onChange={setField("email")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label" htmlFor="cart-city">City / Town</label>
                      <input id="cart-city" className="field" placeholder="e.g. Accra" value={details.city} onChange={setField("city")} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="cart-landmark">Landmark</label>
                      <input id="cart-landmark" className="field" placeholder="Nearest landmark" value={details.landmark} onChange={setField("landmark")} />
                    </div>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="cart-area">Delivery / Pickup Address <span className="text-red-400">*</span></label>
                    <textarea id="cart-area" rows={2} className="field resize-none" placeholder="Where should we deliver?" value={details.area} onChange={setField("area")} />
                  </div>

                  <div>
                    <p className="field-label">Shipping Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {SHIPPING_MODES.map(({ value, icon: Icon, title, detail }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setMode(value)}
                          aria-pressed={mode === value}
                          className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                            mode === value ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-primary/40 bg-white"
                          }`}
                        >
                          <Icon className={`mb-1.5 ${mode === value ? "text-primary" : "text-gray-400"}`} />
                          <p className="font-head text-sm font-semibold text-gray-900">{title}</p>
                          <p className="text-[11px] text-gray-500">{detail}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="cart-notes">Additional Notes</label>
                    <textarea id="cart-notes" rows={2} className="field resize-none" placeholder="Any specific requirements?" value={details.notes} onChange={setField("notes")} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="panel p-5 shadow-md shadow-primary/5 md:sticky md:top-32">
                  <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary mb-1">Your Order</p>
                  <h3 className="font-head text-base font-bold text-gray-900 mb-4">{itemCount} {itemCount === 1 ? "item" : "items"}</h3>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <ItemThumb item={item} size="w-10 h-10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 font-medium line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mb-1">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="font-head font-bold text-gray-900 text-sm">GH₵{formatGHS(subtotalGHS)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-4">Shipping and customs estimates are added when you place the order.</p>

                  {error && (
                    <div className="shake flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3" role="alert">
                      <FaExclamationTriangle className="text-red-500 text-xs mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 text-xs flex-1">{error}</p>
                      <button onClick={() => setError("")} aria-label="Dismiss" className="text-red-400 hover:text-red-600"><FaTimes className="text-[10px]" /></button>
                    </div>
                  )}

                  <button onClick={placeOrder} disabled={submitting} className="btn-solid w-full py-3.5">
                    {submitting ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <>Place Order <FaArrowRight className="text-xs" /></>
                    )}
                  </button>
                  <p className="text-gray-400 text-[10px] text-center mt-3 leading-relaxed">No payment required now. We'll contact you shortly.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
