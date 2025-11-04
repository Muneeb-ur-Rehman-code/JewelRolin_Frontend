// src/pages/Admin/Orders.jsx
import api from "../../services/axiosConfig";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const sessionId = location.state?.sessionId; // session_id from Success page
  console.log("🧾 Stripe session ID from Success page:", sessionId);

  // ✅ Fetch orders
  useEffect(() => {
    api.get("/api/orders")
      .then(res => {
        setOrders(res.data.orders || []);
        console.log("📦 Orders fetched:", res.data.orders || []);
      })
      .catch(err => {
        console.error("❌ Error fetching orders:", err?.response?.data || err.message);
      });
  }, []);

  // ✅ Change order status manually
  const changeStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      console.log(`✅ Order ${orderId} status updated to: ${status}`);
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    }
  };


  // ✅ No orders case
  if (!orders.length)
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h1>
        <div className="p-6 bg-white rounded shadow text-gray-500">No orders yet.</div>
      </div>
    );

  // ✅ Render orders normally
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h1>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-sm sm:text-base">
            {/* Order Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <div className="font-semibold">
                  Order #{order._id || i}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  By: {order.user?.name || order.user?.email || "Unknown"}
                </div>
                {order.user && (
                  <div className="text-gray-600 text-xs sm:text-sm">
                    Email: {order.user.email} | Phone: {order.user.phone || "N/A"}
                  </div>
                )}
              </div>

              <div className="sm:text-right">
                <div className="font-semibold">PKR {order.total}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Delivery: {order.address || "N/A"}</div>
              </div>
            </div>

            {/* Items */}
            <div className="mt-3">
              <div className="font-semibold mb-2">Items</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {order.products?.map((it, j) => (
                  <div key={j} className="border rounded p-2">
                    <div className="font-medium">{it.productId?.name || "Product"}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Price: PKR {it.productId?.price || it.price} × {it.qty || 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">PAYMENT:</span>
              <div className="font-medium">{order.paymentStatus || "Pending"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
