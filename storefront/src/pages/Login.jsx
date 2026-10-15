import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="eyebrow mb-1.5">Welcome Back</p>
          <h1 className="font-head text-3xl font-bold text-gray-900">
            Log <span className="text-gradient">In</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="login-email">Email</label>
            <input id="login-email" type="email" required autoComplete="email" className="field" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" required autoComplete="current-password" className="field" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-600 text-xs" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-solid w-full py-3">
            {submitting ? "Logging in…" : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          No account? <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">You can also order and track without an account.</p>
      </div>
    </div>
  );
}
