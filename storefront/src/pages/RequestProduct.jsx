import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaCheck, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaUser } from "react-icons/fa";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { requestCategories, site } from "../config/site";

const STEPS = [
  { id: 1, label: "Product Info", icon: FaBoxOpen },
  { id: 2, label: "Your Details", icon: FaUser },
  { id: 3, label: "Review & Submit", icon: FaCheck },
];

const emptyForm = {
  productName: "",
  category: "",
  brand: "",
  quantity: 1,
  productLink: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  deliveryAddress: "",
  additionalNotes: "",
};

const NEXT_STEPS = [
  "We review your request and prepare a quote",
  "You confirm the quote with our team",
  "We source the product in China and ship it to Ghana",
  "We deliver it to you",
];

function validateProduct(form) {
  const errors = {};
  if (!form.productName.trim()) errors.productName = "Product name is required";
  if (!form.category) errors.category = "Please select a category";
  if (!(Number(form.quantity) >= 1)) errors.quantity = "Quantity must be at least 1";
  if (form.productLink && !/^https?:\/\/.+/i.test(form.productLink)) errors.productLink = "Link must start with http:// or https://";
  return errors;
}

function validateContact(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Your name is required";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email address";
  if (!form.email && !form.phone) errors.email = "Please provide at least an email or phone number";
  return errors;
}

function FieldError({ message }) {
  return message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;
}

export default function RequestProduct() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState(null);

  // The session loads asynchronously, so prefill once it arrives without overwriting anything typed
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name || "", email: f.email || user.email || "", phone: f.phone || user.phone || "" }));
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fieldClass = (name) => `field ${errors[name] ? "field-error" : ""}`;

  const goTo = (next) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    const found = step === 1 ? validateProduct(form) : validateContact(form);
    setErrors(found);
    if (Object.keys(found).length === 0) goTo(step + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await api.post("/import-requests", { ...form, quantity: Number(form.quantity) });
      setReference(res.data.referenceNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
    setReference(null);
    setStep(1);
  };

  const categoryLabel = requestCategories.find((c) => c.value === form.category)?.label;

  if (reference) {
    return (
      <div className="min-h-screen bg-gray-50 pt-12 pb-16 px-4">
        <div className="max-w-lg mx-auto panel p-10 text-center fade-up">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-3xl text-primary" />
          </div>
          <h2 className="font-head text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            We've received your request. Our team will review it and get back to you with a quote.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-4 mb-6 inline-block">
            <p className="text-primary text-[10px] tracking-widest uppercase mb-1">Reference Number</p>
            <p className="font-head text-2xl font-bold text-gray-900 tracking-wider">{reference}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2.5">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">What happens next</p>
            {NEXT_STEPS.map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mb-6">Save your reference number — you'll need it to track this request.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/track-request?ref=${reference}`} className="btn-solid px-6 py-3">Track This Request</Link>
            <button onClick={reset} className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[3px] uppercase text-gray-900 mb-1.5">{site.name}</p>
          <h1 className="font-head text-3xl md:text-4xl font-bold mb-2 text-gradient">Request a Product</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Can't find what you're looking for? Tell us what you need and we'll source it directly from China for you.
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const current = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md shadow-primary/25"
                        : current
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {done ? <FaCheck className="text-sm" /> : <Icon className="text-sm" />}
                  </div>
                  <span className={`text-[11px] sm:text-xs mt-1.5 font-medium ${current ? "text-gray-900" : done ? "text-primary" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-2 sm:mx-3 mb-5 transition-all duration-300 ${done ? "bg-primary/40" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="panel overflow-hidden">
          {step === 1 && (
            <div className="p-6 sm:p-8 slide-in">
              <div className="mb-6">
                <h2 className="font-head text-gray-900 font-bold text-lg">Product Information</h2>
                <p className="text-gray-400 text-xs mt-0.5">Tell us about the product you want</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="req-productName">Product Name <span className="text-red-400">*</span></label>
                  <input id="req-productName" name="productName" value={form.productName} onChange={onChange} placeholder="e.g. 65-inch smart TV, office chair, running shoes…" className={fieldClass("productName")} />
                  <FieldError message={errors.productName} />
                </div>

                <div>
                  <p className="field-label">Category <span className="text-red-400">*</span></p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {requestCategories.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        aria-pressed={form.category === c.value}
                        onClick={() => {
                          setForm((f) => ({ ...f, category: c.value }));
                          setErrors((prev) => ({ ...prev, category: "" }));
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium leading-tight transition-all duration-200 ${
                          form.category === c.value
                            ? "border-primary bg-gradient-to-r from-primary to-primary/90 text-white shadow-md shadow-primary/25"
                            : "border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary bg-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <FieldError message={errors.category} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label" htmlFor="req-brand">Brand</label>
                    <input id="req-brand" name="brand" value={form.brand} onChange={onChange} placeholder="If you have a preference" className="field" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="req-quantity">Quantity <span className="text-red-400">*</span></label>
                    <input id="req-quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={onChange} className={fieldClass("quantity")} />
                    <FieldError message={errors.quantity} />
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="req-productLink">Product Link</label>
                  <input id="req-productLink" name="productLink" value={form.productLink} onChange={onChange} placeholder="https://… (optional)" className={fieldClass("productLink")} />
                  {errors.productLink ? (
                    <FieldError message={errors.productLink} />
                  ) : (
                    <p className="text-gray-400 text-xs mt-1">Seen it on 1688, Alibaba, or Taobao? Paste the link here.</p>
                  )}
                </div>

                <div>
                  <label className="field-label" htmlFor="req-description">Description</label>
                  <textarea id="req-description" name="description" value={form.description} onChange={onChange} rows={3} placeholder="Describe the product — colour, size, specifications, model number…" className="field resize-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 sm:p-8 slide-in">
              <div className="mb-6">
                <h2 className="font-head text-gray-900 font-bold text-lg">Your Details</h2>
                <p className="text-gray-400 text-xs mt-0.5">So we can reach you about your request</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="req-name">Full Name <span className="text-red-400">*</span></label>
                  <input id="req-name" name="name" value={form.name} onChange={onChange} placeholder="Your full name" className={fieldClass("name")} />
                  <FieldError message={errors.name} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label" htmlFor="req-email">Email Address</label>
                    <input id="req-email" name="email" type="email" value={form.email} onChange={onChange} placeholder="your@email.com" className={fieldClass("email")} />
                    <FieldError message={errors.email} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="req-phone">Phone Number</label>
                    <input id="req-phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="0241234567" className="field" />
                  </div>
                </div>
                <p className="text-gray-400 text-xs -mt-2">Please provide at least an email or phone number.</p>
                <div>
                  <label className="field-label" htmlFor="req-deliveryAddress">Delivery Address</label>
                  <textarea id="req-deliveryAddress" name="deliveryAddress" value={form.deliveryAddress} onChange={onChange} rows={2} placeholder="Where should we deliver? (optional — we'll confirm later)" className="field resize-none" />
                </div>
                <div>
                  <label className="field-label" htmlFor="req-additionalNotes">Additional Notes</label>
                  <textarea id="req-additionalNotes" name="additionalNotes" value={form.additionalNotes} onChange={onChange} rows={3} placeholder="Any other details, budget range, urgency, or special requirements…" className="field resize-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 sm:p-8 slide-in">
              <div className="mb-6">
                <h2 className="font-head text-gray-900 font-bold text-lg">Review & Submit</h2>
                <p className="text-gray-400 text-xs mt-0.5">Check everything looks right before submitting</p>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-5" role="alert">
                  <FaExclamationTriangle className="flex-shrink-0 text-xs" />
                  {submitError}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-700 text-sm font-semibold">Product</h3>
                  <button onClick={() => goTo(1)} className="text-primary text-xs hover:underline">Edit</button>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-head text-gray-900 font-bold text-sm">{form.productName}</p>
                  {categoryLabel && <p className="text-gray-500 text-xs">{categoryLabel}</p>}
                  {form.brand && <p className="text-gray-500 text-xs">Brand: {form.brand}</p>}
                  <p className="text-gray-500 text-xs">Qty: {form.quantity} unit{Number(form.quantity) > 1 ? "s" : ""}</p>
                  {form.productLink && (
                    <a href={form.productLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline block truncate">
                      View product link
                    </a>
                  )}
                  {form.description && <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{form.description}</p>}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-700 text-sm font-semibold">Your Details</h3>
                  <button onClick={() => goTo(2)} className="text-primary text-xs hover:underline">Edit</button>
                </div>
                <div className="space-y-1">
                  <p className="font-head text-gray-900 text-sm font-semibold">{form.name}</p>
                  {form.email && <p className="text-gray-500 text-xs">{form.email}</p>}
                  {form.phone && <p className="text-gray-500 text-xs">{form.phone}</p>}
                  {form.deliveryAddress && <p className="text-gray-500 text-xs">{form.deliveryAddress}</p>}
                  {form.additionalNotes && <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mt-1">{form.additionalNotes}</p>}
                </div>
              </div>

              <p className="text-gray-400 text-[11px] text-center mb-5 leading-relaxed">
                By submitting, you agree to be contacted by our team regarding your product request.
              </p>
              <button onClick={submit} disabled={submitting} className="btn-solid w-full py-4">
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                ) : (
                  "Submit Product Request"
                )}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50">
            {step > 1 ? (
              <button onClick={() => goTo(step - 1)} className="flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                <FaChevronLeft className="text-xs" /> Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <button onClick={next} className="btn-solid px-6 py-2.5">
                Continue <FaChevronRight className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
