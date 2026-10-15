import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client";
import { formatGHS } from "../utils/pricing";

const label = (status) => status.replace(/_/g, " ");

function StatusPill({ status }) {
  return (
    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
      {label(status)}
    </span>
  );
}

export default function Account() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [importRequests, setImportRequests] = useState([]);

  const loadRequests = () => api.get("/import-requests/mine").then((res) => setImportRequests(res.data)).catch(() => {});

  useEffect(() => {
    if (!user) return;
    api.get("/orders/mine").then((res) => setOrders(res.data)).catch(() => {});
    loadRequests();
  }, [user]);

  const respond = async (id, accept) => {
    await api.patch(`/import-requests/${id}/respond`, { accept });
    loadRequests();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 text-center">
        <div>
          <h2 className="font-head text-2xl font-bold text-gray-900 mb-3">Your Account</h2>
          <p className="text-gray-400 text-sm mb-6">Log in to see your orders and product requests.</p>
          <Link to="/login" className="btn-solid px-8 py-3">Log In <FaArrowRight className="text-xs" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="min-w-0">
            <p className="eyebrow mb-1.5">My Account</p>
            <h1 className="font-head text-3xl font-bold text-gray-900 truncate">
              Hi, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 truncate">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="flex-shrink-0 flex items-center gap-2 text-xs text-gray-500 border border-gray-200 bg-white rounded-xl px-4 py-2.5 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <h2 className="font-head text-lg font-bold text-gray-900 mb-3">My Orders</h2>
        {orders.length === 0 ? (
          <div className="panel p-6 text-sm text-gray-400 mb-8">
            No orders yet. <Link to="/products" className="text-primary hover:underline">Browse products</Link>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {orders.map((order) => (
              <div key={order._id} className="panel p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-head font-bold text-gray-900 tracking-wide">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length === 1 ? "" : "s"} · GH₵{formatGHS(order.totalGHS)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={order.status} />
                  <Link to={`/track-request?ref=${order.orderNumber}`} className="text-primary text-xs font-semibold hover:underline whitespace-nowrap">
                    Track →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-head text-lg font-bold text-gray-900 mb-3">My Product Requests</h2>
        {importRequests.length === 0 ? (
          <div className="panel p-6 text-sm text-gray-400">
            No requests yet. <Link to="/request-product" className="text-primary hover:underline">Request a product</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {importRequests.map((request) => (
              <div key={request._id} className="panel p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-head font-bold text-gray-900 text-sm">{request.productName || request.description}</p>
                    <p className="text-xs text-gray-400">
                      {request.referenceNumber && `${request.referenceNumber} · `}Qty {request.quantity} · {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={request.status} />
                </div>
                {request.quotedTotalGHS != null && (
                  <p className="text-sm text-gray-700 mt-3">
                    Quoted total: <span className="font-head font-bold text-primary">GH₵{formatGHS(request.quotedTotalGHS)}</span>
                  </p>
                )}
                {request.adminNote && <p className="text-xs text-gray-500 mt-1">{request.adminNote}</p>}
                <div className="flex items-center gap-3 mt-3">
                  {request.status === "quoted" && (
                    <>
                      <button onClick={() => respond(request._id, true)} className="btn-solid px-4 py-2 text-xs">Accept Quote</button>
                      <button onClick={() => respond(request._id, false)} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs hover:bg-gray-50">Decline</button>
                    </>
                  )}
                  {request.referenceNumber && (
                    <Link to={`/track-request?ref=${request.referenceNumber}`} className="text-primary text-xs font-semibold hover:underline">
                      Track →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
