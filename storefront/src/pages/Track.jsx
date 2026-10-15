import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowRight, FaCheck, FaSearch, FaTimes } from "react-icons/fa";
import api from "../api/client";
import { requestCategories, site } from "../config/site";
import { formatGHS } from "../utils/pricing";

const ORDER_PREFIX = "MMC-";
const REQUEST_PREFIX = "MMR-";

// Stages mirror ORDER_STATUSES in backend/models/Order.js
const ORDER_STAGES = [
  { value: "pending_payment", label: "Order Received", short: "We have your order and will contact you to confirm it and arrange payment." },
  { value: "paid", label: "Payment Confirmed", short: "Payment received. We're placing the order with the supplier." },
  { value: "ordered_from_china", label: "Ordered from Supplier", short: "Your items have been ordered from the supplier in China." },
  { value: "shipped_from_china", label: "Shipped from China", short: "Your shipment has left China and is on its way to Ghana." },
  { value: "arrived_ghana_customs", label: "Arrived at Ghana Customs", short: "Your shipment has landed and is being processed by customs." },
  { value: "cleared_customs", label: "Cleared Customs", short: "Customs clearance is complete. Delivery is being arranged." },
  { value: "out_for_delivery", label: "Out for Delivery", short: "Your order is on its way to your address." },
  { value: "delivered", label: "Delivered", short: "Your order has been delivered." },
];

// Stages mirror the status enum in backend/models/ImportRequest.js
const REQUEST_STAGES = [
  { value: "submitted", label: "Request Received", short: "Our team is reviewing your request and preparing a quote." },
  { value: "quoted", label: "Quote Ready", short: "We've priced your request. Our team will contact you to confirm it." },
  { value: "accepted", label: "Quote Accepted", short: "You've accepted the quote. We're preparing your order." },
  { value: "converted_to_order", label: "Order Placed", short: "Your request is now an order and is being sourced." },
];

const STOPPED = {
  cancelled: { label: "Cancelled", short: "This order has been cancelled. Contact us if you have questions." },
  rejected: { label: "Quote Declined", short: "The quote for this request was declined. Contact us if you'd like a new one." },
  expired: { label: "Quote Expired", short: "The quote for this request has expired. Contact us for an updated one." },
};

const HOW_IT_WORKS = [
  { step: "01", title: "Place an Order or Request", desc: "Order from the catalog, or send a custom request for anything you've seen online." },
  { step: "02", title: "Receive Your Number", desc: `Orders get an ${ORDER_PREFIX} number and requests get an ${REQUEST_PREFIX} reference. Keep it safe.` },
  { step: "03", title: "We Source & Ship", desc: "We buy from the supplier in China and ship by sea or air, updating the status at every stage." },
  { step: "04", title: "Delivered to You", desc: "Once it clears customs in Ghana, we deliver to your address." },
];

const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function Detail({ label, children, wide }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-1">{label}</p>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

function Pipeline({ stages, currentIndex }) {
  return (
    <div className="panel p-6 mb-6">
      <p className="text-[11px] font-bold tracking-[2px] uppercase text-gray-900 mb-6">Progress</p>
      <div className="relative pl-10">
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />
        <div
          className="absolute left-[15px] top-0 w-0.5 bg-gradient-to-b from-primary to-secondary transition-all duration-700"
          style={{ height: `${(Math.max(currentIndex, 0) / (stages.length - 1)) * 100}%` }}
        />
        {stages.map((stage, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          return (
            <div key={stage.value} className="relative flex items-start py-3">
              <div
                className={`absolute -left-10 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${
                  done
                    ? "bg-gradient-to-br from-primary to-primary/80 border-primary text-white"
                    : current
                    ? "bg-white border-primary shadow-md shadow-primary/20"
                    : "bg-white border-gray-200"
                }`}
              >
                {done ? <FaCheck className="text-xs" /> : <span className={`w-2 h-2 rounded-full ${current ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
              <div className="min-w-0 pt-1">
                <p className={`font-head text-sm font-semibold leading-tight ${current ? "text-gray-900" : done ? "text-gray-600" : "text-gray-300"}`}>
                  {stage.label}
                </p>
                {current && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{stage.short}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Result({ kind, data, onReset }) {
  const stages = kind === "order" ? ORDER_STAGES : REQUEST_STAGES;
  const reference = kind === "order" ? data.orderNumber : data.referenceNumber;
  const stopped = STOPPED[data.status];
  const currentIndex = stages.findIndex((s) => s.value === data.status);
  const stage = stopped || stages[currentIndex] || stages[0];
  const finished = currentIndex === stages.length - 1;
  const latestNote = kind === "order" ? [...(data.statusHistory || [])].reverse().find((h) => h.note)?.note : data.adminNote;
  const categoryLabel = requestCategories.find((c) => c.value === data.category)?.label || data.category;

  return (
    <div className="fade-up">
      <div className={`rounded-2xl border p-6 mb-6 ${stopped ? "bg-red-50 border-red-200" : finished ? "bg-emerald-50 border-emerald-200" : "bg-orange-50 border-orange-200"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${stopped ? "bg-red-500" : finished ? "bg-emerald-500" : "bg-primary dot-pulse"}`} />
            <div className="min-w-0">
              <p className={`font-head text-xl font-bold leading-tight ${stopped ? "text-red-700" : finished ? "text-emerald-700" : "text-primary"}`}>{stage.label}</p>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{stage.short}</p>
            </div>
          </div>
          <button onClick={onReset} className="flex-shrink-0 text-xs text-gray-600 border border-gray-300 bg-white rounded-lg px-3 py-1.5 hover:border-gray-400 transition-all">
            New search
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-[11px] tracking-[2px] uppercase text-primary mb-1">{kind === "order" ? "Order Number" : "Reference Number"}</p>
          <p className="font-head text-lg font-bold text-gray-900 tracking-wider">{reference}</p>
        </div>
      </div>

      {stopped ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <FaTimes className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm leading-relaxed">
            If you believe this is an error or need help, contact us on{" "}
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a> with your number above.
          </p>
        </div>
      ) : (
        <Pipeline stages={stages} currentIndex={currentIndex} />
      )}

      <div className="panel overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-secondary">
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-white">{kind === "order" ? "Order Details" : "Request Details"}</p>
        </div>
        <div className="p-6">
          {kind === "order" ? (
            <>
              <div className="space-y-2 mb-5">
                {data.items.map((item, index) => (
                  <div key={index} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-head font-semibold text-gray-900 whitespace-nowrap">GH₵{formatGHS(item.unitPriceGHS * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm mb-5">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>GH₵{formatGHS(data.itemsSubtotalGHS)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>GH₵{formatGHS(data.shippingFeeGHS)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Customs</span><span>GH₵{formatGHS(data.customsFeeGHS)}</span></div>
                <div className="flex justify-between font-head font-bold text-gray-900 pt-1.5"><span>Total</span><span>GH₵{formatGHS(data.totalGHS)}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <Detail label="Placed">{formatDate(data.createdAt)}</Detail>
                <Detail label="Freight"><span className="capitalize">{data.shippingMode || "sea"}</span></Detail>
                <Detail label="Payment"><span className="capitalize">{data.paymentStatus}</span></Detail>
                {data.trackingNumber && <Detail label="Tracking No.">{data.trackingNumber}</Detail>}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {data.productName && (
                <Detail label="Product"><span className="font-head font-bold text-gray-900">{data.productName}</span></Detail>
              )}
              <Detail label="Quantity">{data.quantity} unit{data.quantity > 1 ? "s" : ""}</Detail>
              {categoryLabel && <Detail label="Category">{categoryLabel}</Detail>}
              {data.brand && <Detail label="Brand">{data.brand}</Detail>}
              <Detail label="Submitted">{formatDate(data.createdAt)}</Detail>
              {data.quotedTotalGHS != null && (
                <Detail label="Quoted Total"><span className="font-head font-bold text-primary">GH₵{formatGHS(data.quotedTotalGHS)}</span></Detail>
              )}
              {data.description && <Detail label="Description" wide><span className="leading-relaxed">{data.description}</span></Detail>}
            </div>
          )}

          {latestNote && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-primary mb-2">Message from our team</p>
              <p className="text-sm text-gray-600 leading-relaxed">{latestNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("ref") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { kind: "order" | "request", data }
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const lookup = async (raw) => {
    const reference = raw.trim().toUpperCase();
    if (!reference) return setError("Please enter your order or reference number.");
    const isOrder = reference.startsWith(ORDER_PREFIX);
    if (!isOrder && !reference.startsWith(REQUEST_PREFIX)) {
      return setError(`Numbers begin with ${ORDER_PREFIX} (orders) or ${REQUEST_PREFIX} (custom requests).`);
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const path = isOrder ? `/orders/track/${encodeURIComponent(reference)}` : `/import-requests/track/${encodeURIComponent(reference)}`;
      const res = await api.get(path);
      setResult({ kind: isOrder ? "order" : "request", data: res.data });
      setSearchParams({ ref: reference }, { replace: true });
    } catch (err) {
      if (err.response?.status === 404) setError("Nothing found. Please double-check your number and try again.");
      else if (err.response?.status === 429) setError("Too many attempts. Please wait a few minutes and try again.");
      else setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Arriving with ?ref= (from the order confirmation or account page) looks it up straight away
  useEffect(() => {
    const initial = searchParams.get("ref");
    if (initial) lookup(initial);
  }, []);

  const reset = () => {
    setInput("");
    setResult(null);
    setError("");
    setSearchParams({}, { replace: true });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 dot-bg" />
        <div className="absolute top-16 right-16 w-64 h-64 border border-primary/30 rounded-full opacity-40" />
        <div className="absolute bottom-8 left-10 w-40 h-40 border border-primary/20 rounded-full opacity-30" />
        <div className="relative z-10 text-center px-4 py-16 md:py-20 fade-up">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-secondary mb-4">{site.name}</p>
          <h1 className="font-head text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Track Your <span className="text-secondary">Order</span>
          </h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-5" />
          <p className="text-white/60 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Enter your order or request number to see exactly where it is between China and your doorstep.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 fade-up">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(input);
          }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/60 p-6"
        >
          <label htmlFor="track-ref" className="block text-[11px] font-semibold tracking-[2px] uppercase text-gray-400 mb-3">
            Order / Reference Number
          </label>
          <div className="flex gap-3">
            <input
              id="track-ref"
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError("");
              }}
              placeholder={`${ORDER_PREFIX}XXXXXXXX`}
              autoComplete="off"
              spellCheck={false}
              className="font-head flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-3.5 text-base font-semibold tracking-wider text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all uppercase bg-gray-50"
            />
            <button type="submit" disabled={loading} className="btn-solid px-6 py-3.5 whitespace-nowrap">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Tracking…</>
              ) : (
                <><FaSearch className="text-xs" /> Track</>
              )}
            </button>
          </div>
          {error && (
            <p className="shake flex items-start gap-2 mt-3 text-red-600 text-xs leading-relaxed" role="alert">
              <span className="flex-shrink-0">⚠</span> {error}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-3 text-center">
            Shown when you placed your order or request — e.g. <span className="font-medium text-gray-500">{ORDER_PREFIX}A1B2C3D4</span> or{" "}
            <span className="font-medium text-gray-500">{REQUEST_PREFIX}K7R2M9XQ</span>
          </p>
        </form>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {result ? (
          <Result kind={result.kind} data={result.data} onReset={reset} />
        ) : (
          <div className="fade-up">
            <div className="mb-8">
              <p className="eyebrow mb-1 text-center">How It Works</p>
              <h2 className="font-head text-2xl font-bold text-gray-900 text-center mb-1">
                From China to <span className="text-gradient">Your Door</span>
              </h2>
              <div className="w-10 h-0.5 bg-primary mx-auto mb-8" />
              <div className="space-y-3">
                {HOW_IT_WORKS.map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-white hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-transparent transition-all duration-300">
                      <span className="font-head text-xs font-bold text-primary group-hover:text-white transition-colors duration-300">{item.step}</span>
                    </div>
                    <div>
                      <p className="font-head text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-gray-900 rounded-2xl overflow-hidden p-8 text-center">
              <div className="absolute inset-0 dot-bg" />
              <div className="absolute -top-6 -right-6 w-32 h-32 border border-primary/30 rounded-full opacity-40" />
              <div className="relative z-10">
                <p className="text-[11px] font-semibold tracking-[3px] uppercase text-secondary mb-2">Don't have a request yet?</p>
                <h3 className="font-head text-xl font-bold text-white mb-4">Request Any Product from China</h3>
                <Link to="/request-product" className="btn-solid px-7 py-3">
                  Submit a Request <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
