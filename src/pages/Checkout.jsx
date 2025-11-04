// src/components/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/axiosConfig";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart, subtotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: "COD", // only allowed enums: COD, Card
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    } else if (name === "cardExpiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    } else if (name === "cardCVV") {
      value = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      errs.email = "Valid email required";
    if (!form.address.trim()) errs.address = "Address required";
    if (!form.city.trim()) errs.city = "City required";
    if (!/^03[0-9]{9}$/.test(form.phone))
      errs.phone = "Enter valid phone (03XXXXXXXXX)";
    if (form.paymentMethod === "Card") {
      const cleanCard = form.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCard)) errs.cardNumber = "Card number must be 16 digits";
      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.cardExpiry))
        errs.cardExpiry = "Expiry must be in MM/YY format";
      if (!/^[0-9]{3}$/.test(form.cardCVV)) errs.cardCVV = "CVV must be 3 digits";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setLoading(true);

    if (!user) {
      setLoading(false);
      alert("Please sign in to place an order.");
      navigate("/signin");
      return;
    }

    try {
      // Prepare products payload
      const productsPayload = cart
        .map((item) => {
          const stock = item.product?.stock ?? 0;
          if (stock < 1) return null;
          const qty = Math.max(1, Math.min(Number(item.qty ?? item.quantity ?? 1), stock));
          return {
            productId: item.product?._id ?? item.productId ?? item._id,
            quantity: qty,
            price: item.product?.price ?? item.price ?? 0,
          };
        })
        .filter(Boolean);

      if (productsPayload.length === 0) {
        setLoading(false);
        alert("No items in cart or all items are out of stock.");
        return;
      }

      const orderPayload = {
        user: user._id ?? user.id,
        products: productsPayload,
        total,
        address: form.address,
        city: form.city,
        phone: form.phone,
       paymentMethod: form.paymentMethod === "card" ? "Card" : "COD", // <-- key fix
        name: form.name,
        email: form.email,
      };

      const headers = { Authorization: `Bearer ${user.token ?? ""}` };

      if (form.paymentMethod === "Card") {
        const createRes = await api.post("/api/orders", orderPayload, { headers });
        const createdOrder = createRes.data.order;
        if (!createdOrder?._id) throw new Error("Order creation failed");

        const stripeRes = await api.post(
          "/api/payments/create-checkout-session",
          { orderId: createdOrder._id },
          { headers }
        );

        setLoading(false);
        window.location.href = stripeRes.data.url;
        return;
      } else {
        const res = await api.post("/api/orders", orderPayload, { headers });
        clearCart();
        setLoading(false);
        navigate("/success", { state: { order: res.data.order } });
      }
    } catch (err) {
      setLoading(false);
      console.error("Order failed", err.response?.data || err.message);
      alert("Order failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        className="max-w-3xl w-full bg-white p-6 sm:p-8 rounded-xl shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "address", "city", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === "phone" ? "Phone (03XXXXXXXXX)" : field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === "email" ? "email" : "text"}
                className="w-full border px-3 py-2 rounded"
                required
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {/* Payment Methods */}
          <div>
            <label className="font-semibold">Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
             {["cod", "card"].map((method) => (
  <label
    key={method}
    className={`border rounded p-3 cursor-pointer flex items-center gap-2 ${
      form.paymentMethod.toLowerCase() === method ? "border-[var(--accent)] bg-gray-50" : ""
    }`}
    onClick={async () => {
      if (method === "card") {
        // 🚀 Directly go to Stripe checkout
        if (!user) {
          alert("Please sign in to place an order.");
          navigate("/signin");
          return;
        }

        setLoading(true);

        try {
          // prepare cart order data
          const productsPayload = cart
            .map((item) => ({
              productId: item.product?._id ?? item.productId ?? item._id,
              quantity: Math.max(1, Number(item.qty ?? 1)),
              price: item.product?.price ?? item.price ?? 0,
            }))
            .filter(Boolean);

          const orderPayload = {
            user: user._id ?? user.id,
            products: productsPayload,
            total,
            address: form.address || "N/A",
            city: form.city || "N/A",
            phone: form.phone || "00000000000",
            paymentMethod: "Card",
            name: form.name,
            email: form.email,
          };

          const headers = { Authorization: `Bearer ${user.token ?? ""}` };

          // ✅ Create order first
          const createRes = await api.post("/api/orders", orderPayload, { headers });
          const createdOrder = createRes.data.order;
          if (!createdOrder?._id) throw new Error("Order creation failed");

          // ✅ Then request Stripe session
          const stripeRes = await api.post(
            "/api/payments/create-checkout-session",
            { orderId: createdOrder._id },
            { headers }
          );

          // ✅ Redirect to Stripe checkout
          setLoading(false);
          window.location.href = stripeRes.data.url;
        } catch (err) {
          setLoading(false);
          console.error("Stripe redirect failed:", err);
          alert("Payment error: " + (err.response?.data?.message || err.message));
        }
      } else {
        setForm((s) => ({ ...s, paymentMethod: "COD" }));
      }
    }}
  >
    {method === "cod" ? "Cash on Delivery" : "Card Payment"}
  </label>
))}

            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center pt-3">
            <div>
              <div className="text-sm text-gray-600">Subtotal: PKR {subtotal}</div>
              <div className="text-sm text-gray-600">Shipping: PKR {shipping}</div>
              <div className="font-semibold">Total: PKR {total}</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 w-fit bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 text-white font-semibold rounded transition"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
