import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const STATUS_OPTIONS = [
  "pending_payment", "paid", "ordered_from_china", "shipped_from_china",
  "arrived_ghana_customs", "cleared_customs", "out_for_delivery", "delivered", "cancelled",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    api.get("/orders", { params: { status: statusFilter || undefined, page } }).then((res) => {
      setOrders(res.data.orders);
      setPages(res.data.pages);
    });
  };

  useEffect(load, [statusFilter, page]);

  return (
    <div>
      <h1>Orders</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Order #</th><th>Customer</th><th>Total (GH₵)</th><th>Status</th><th>Placed</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.orderNumber}</td>
                <td>{o.customer?.name || o.user?.name}<br /><span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>{o.customer?.phone || o.user?.phone}</span></td>
                <td>{o.totalGHS.toFixed(2)}</td>
                <td><span className="status-pill">{o.status.replace(/_/g, " ")}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/orders/${o._id}`}>Manage</Link></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="btn-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ padding: "8px 12px" }}>Page {page} of {pages || 1}</span>
        <button className="btn-primary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
