import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-sidebar)",
      }}
    >
      <form onSubmit={handleSubmit} className="card" style={{ width: 340, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ margin: 0, color: "var(--color-primary)" }}>MM Collectives Admin</h2>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        {error && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>{error}</p>}
        <button className="btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
