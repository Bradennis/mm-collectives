import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../api/client";

const PIE_COLORS = ["#3730a3", "#06b6d4", "#d97706", "#16a34a", "#dc2626", "#8b5cf6", "#0891b2", "#65a30d", "#be123c"];

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 700 }}>{value}</p>
      {sub && <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [funnel, setFunnel] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics/overview").then((res) => setOverview(res.data));
    api.get("/admin/analytics/revenue", { params: { days: 30 } }).then((res) => setRevenueSeries(res.data));
    api.get("/admin/analytics/top-products", { params: { limit: 5 } }).then((res) => setTopProducts(res.data));
    api.get("/admin/analytics/funnel").then((res) => setFunnel(res.data));
  }, []);

  if (!overview) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={`GH₵ ${overview.totalRevenueGHS.toFixed(2)}`} sub="paid orders" />
        <StatCard label="Total Orders" value={overview.totalOrders} />
        <StatCard label="Customers" value={overview.totalCustomers} />
        <StatCard label="Products" value={overview.totalProducts} />
        <StatCard label="Pending Import Requests" value={overview.pendingImportRequests} sub="awaiting quote" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="card">
          <h3>Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3730a3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={overview.ordersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status }) => status}
              >
                {overview.ordersByStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="soldCount" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Import Request Funnel</h3>
          {funnel && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              {[
                ["Submitted", funnel.submitted],
                ["Quoted", funnel.quoted],
                ["Accepted", funnel.accepted],
                ["Converted to Order", funnel.converted],
              ].map(([label, count]) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>{label}</span><span>{count}</span>
                  </div>
                  <div style={{ background: "#eee", borderRadius: 4, height: 8 }}>
                    <div
                      style={{
                        width: `${funnel.submitted ? (count / funnel.submitted) * 100 : 0}%`,
                        background: "var(--color-primary)",
                        height: 8,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
