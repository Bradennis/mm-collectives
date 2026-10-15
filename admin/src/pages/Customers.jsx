import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const load = () => api.get("/admin/customers").then((res) => setCustomers(res.data));
  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id) => {
    await api.patch(`/admin/customers/${id}/status`);
    load();
  };

  return (
    <div>
      <h1>Customers</h1>
      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Contact</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}<br /><span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>{c.phone}</span></td>
                <td>{c.orderCount}</td>
                <td>GH₵ {c.totalSpentGHS.toFixed(2)}</td>
                <td>
                  <span className="status-pill" style={{ background: c.isActive ? "#dcfce7" : "#fee2e2", color: c.isActive ? "var(--color-success)" : "var(--color-danger)" }}>
                    {c.isActive ? "Active" : "Suspended"}
                  </span>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => toggleStatus(c._id)} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer" }}>
                    {c.isActive ? "Suspend" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
