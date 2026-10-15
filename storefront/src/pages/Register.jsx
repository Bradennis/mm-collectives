import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const fields = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "your@email.com", autoComplete: "email" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "e.g. 0241234567", autoComplete: "tel" },
  { name: "password", label: "Password", type: "password", placeholder: "At least 6 characters", autoComplete: "new-password" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="eyebrow mb-1.5">Join Us</p>
          <h1 className="font-head text-3xl font-bold text-gray-900">
            Create an <span className="text-gradient">Account</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="field-label" htmlFor={`register-${field.name}`}>{field.label}</label>
              <input
                id={`register-${field.name}`}
                type={field.type}
                required
                minLength={field.name === "password" ? 6 : undefined}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                className="field"
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              />
            </div>
          ))}
          {error && <p className="text-red-600 text-xs" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-solid w-full py-3">
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
