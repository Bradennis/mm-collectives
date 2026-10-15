import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/orders", label: "Orders", icon: "📦" },
  { path: "/products", label: "Products", icon: "🛍️" },
  { path: "/import-requests", label: "Import Requests", icon: "📥" },
  { path: "/customers", label: "Customers", icon: "👥" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 230, background: "var(--color-sidebar)", color: "#fff", padding: "20px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px", marginBottom: 30 }}>
          <strong style={{ fontSize: "1.2rem" }}>MM Collectives</strong>
          <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: "2px 0 0" }}>Admin Dashboard</p>
        </div>
        <nav>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 20px",
                  color: active ? "#fff" : "#c7c8e0",
                  background: active ? "var(--color-primary)" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: "var(--color-surface)",
            padding: "14px 24px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 16,
            boxShadow: "var(--shadow)",
          }}
        >
          <span style={{ color: "var(--color-text-muted)" }}>{user?.name} ({user?.role})</span>
          <button onClick={logout} className="btn-primary" style={{ padding: "6px 14px" }}>Logout</button>
        </header>
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
