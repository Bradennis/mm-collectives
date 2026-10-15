import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const STATUS_OPTIONS = [
  "pending_payment", "paid", "ordered_from_china", "shipped_from_china",
  "arrived_ghana_customs", "cleared_customs", "out_for_delivery", "delivered", "cancelled",
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get(`/orders/${id}`).then((res) => {
    setOrder(res.data);
    setNewStatus(res.data.status);
    setTrackingNumber(res.data.trackingNumber || "");
  });

  useEffect(load, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus, note, trackingNumber });
      setNote("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order {order.orderNumber}</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        {order.customer?.name || order.user?.name} — {order.customer?.email || order.user?.email || "no email"} — {order.customer?.phone || order.user?.phone}
        {!order.user && " (guest order)"}
        {order.shippingMode && ` — ${order.shippingMode} freight`}
        {order.notes && <><br />Customer note: {order.notes}</>}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h3>Items</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span>{item.name} x {item.quantity}</span>
              <span>GH₵ {(item.unitPriceGHS * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
            <span>Total</span><span>GH₵ {order.totalGHS.toFixed(2)}</span>
          </div>

          <h3 style={{ marginTop: 20 }}>Shipping Address</h3>
          <p>
            {order.shippingAddress?.area}, {order.shippingAddress?.city}, {order.shippingAddress?.region}
            <br />
            Landmark: {order.shippingAddress?.landmark} — {order.shippingAddress?.phone}
          </p>
        </div>

        <div className="card">
          <h3>Update Status</h3>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" }}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <input
            placeholder="Tracking number (optional)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" }}
          />
          <textarea
            placeholder="Internal note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" }}
          />
          <button className="btn-primary" onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Update Order"}
          </button>

          <h3 style={{ marginTop: 20 }}>Status History</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem" }}>
            {order.statusHistory?.slice().reverse().map((h, idx) => (
              <div key={idx} style={{ borderLeft: "2px solid var(--color-primary)", paddingLeft: 8 }}>
                <strong>{h.status.replace(/_/g, " ")}</strong> — {new Date(h.changedAt).toLocaleString()}
                {h.note && <p style={{ margin: "2px 0 0", color: "var(--color-text-muted)" }}>{h.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
