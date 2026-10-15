import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function ImportRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [quoteForms, setQuoteForms] = useState({}); // { [id]: { estimatedUnitCostGHS, estimatedShippingGHS, adminNote } }

  const load = () => api.get("/import-requests", { params: { status: statusFilter || undefined } }).then((res) => setRequests(res.data));
  useEffect(load, [statusFilter]);

  const handleQuoteChange = (id, field, value) => {
    setQuoteForms((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const submitQuote = async (id) => {
    const q = quoteForms[id] || {};
    await api.patch(`/import-requests/${id}/quote`, {
      estimatedUnitCostGHS: Number(q.estimatedUnitCostGHS) || 0,
      estimatedShippingGHS: Number(q.estimatedShippingGHS) || 0,
      adminNote: q.adminNote || "",
    });
    load();
  };

  return (
    <div>
      <h1>Import Requests</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">All</option>
          <option value="submitted">Submitted (needs quote)</option>
          <option value="quoted">Quoted (awaiting customer)</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="converted_to_order">Converted to Order</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {requests.map((r) => (
          <div key={r._id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{r.contact?.name || r.user?.name}</strong> — {r.contact?.phone || r.user?.phone}
                {(r.contact?.email || r.user?.email) && <> — {r.contact?.email || r.user?.email}</>}
                {!r.user && <span className="status-pill" style={{ marginLeft: 6 }}>Guest</span>}
                {r.referenceNumber && <p style={{ margin: "6px 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Ref: {r.referenceNumber}</p>}
                {r.productName && <p style={{ margin: "6px 0", fontWeight: 600 }}>{r.productName}{r.brand ? ` (${r.brand})` : ""}{r.category ? ` — ${r.category}` : ""}</p>}
                {r.description && <p style={{ margin: "6px 0" }}>{r.description}</p>}
                {r.deliveryAddress && <p style={{ margin: "6px 0", fontSize: "0.85rem" }}>Deliver to: {r.deliveryAddress}</p>}
                {r.additionalNotes && <p style={{ margin: "6px 0", fontSize: "0.85rem" }}>Notes: {r.additionalNotes}</p>}
                {r.productLink && <a href={r.productLink} target="_blank" rel="noreferrer">View product link</a>}
                <p style={{ margin: "6px 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Quantity: {r.quantity}</p>
              </div>
              <span className="status-pill">{r.status.replace(/_/g, " ")}</span>
            </div>

            {r.status === "submitted" && (
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <input
                  type="number"
                  placeholder="Unit cost (GH₵)"
                  onChange={(e) => handleQuoteChange(r._id, "estimatedUnitCostGHS", e.target.value)}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", width: 140 }}
                />
                <input
                  type="number"
                  placeholder="Shipping estimate (GH₵)"
                  onChange={(e) => handleQuoteChange(r._id, "estimatedShippingGHS", e.target.value)}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", width: 180 }}
                />
                <input
                  placeholder="Note to customer"
                  onChange={(e) => handleQuoteChange(r._id, "adminNote", e.target.value)}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", flex: 1, minWidth: 160 }}
                />
                <button className="btn-primary" onClick={() => submitQuote(r._id)}>Send Quote</button>
              </div>
            )}

            {r.quotedTotalGHS && (
              <p style={{ marginTop: 8 }}>Quoted Total: <strong>GH₵ {r.quotedTotalGHS.toFixed(2)}</strong></p>
            )}
          </div>
        ))}
        {requests.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No requests in this filter.</p>}
      </div>
    </div>
  );
}
