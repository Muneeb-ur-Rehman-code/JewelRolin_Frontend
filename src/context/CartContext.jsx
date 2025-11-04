// filepath: src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/axiosConfig";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const userId = user?._id ?? user?.id ?? user?.userId ?? null;
  const token = user?.token ?? user?.accessToken ?? null;

  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // ✅ Fetch Cart
  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }

    let mounted = true;
    async function fetchCart() {
      try {
        const res = await api.get(`/api/users/${userId}/cart`, authHeaders);
        if (!mounted) return;
        setCart(res.data.cart || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        if (mounted) setCart([]);
      }
    }

    fetchCart();
    return () => (mounted = false);
  }, [userId, token]);

  // ✅ Robust Add to Cart with full debugging info
const addToCart = async (productOrId, qtyChange = 1) => {
  if (!userId) {
    alert("Please log in to add items to your cart!");
    return;
  }

  let productId = null;

  if (!productOrId) {
    console.error("🛒 addToCart: no product provided", productOrId);
    alert("Product missing. Please refresh and try again.");
    return;
  }

  // 🧠 DEBUG: Show the full incoming object
  console.log("🧩 addToCart called with:", productOrId);
  console.log("📦 Type of productOrId:", typeof productOrId);

  if (typeof productOrId === "string") {
    productId = productOrId;
  } else if (typeof productOrId === "object") {
    // 🧠 DEBUG: Show what keys exist in the product
    console.log("🔍 Keys inside productOrId:", Object.keys(productOrId));

    productId =
  productOrId._id ||
  productOrId.id ||
  productOrId.productId || // ✅ added this line
  productOrId.product?._id ||
  productOrId.product?.id ||
  (typeof productOrId.product === "string"
    ? productOrId.product
    : null);


    // 🧠 DEBUG: Show nested product info if available
    if (productOrId.product) {
      console.log("🧱 Nested product object:", productOrId.product);
    }
  }

  // 🧠 Show final extracted ID
  console.log("🪪 Extracted productId:", productId);

  if (!productId) {
    console.error("🛒 addToCart: ❌ product id missing", productOrId);
    console.warn("💡 Check what productOrId looks like above ⬆️");
    alert("Product ID missing. Please refresh and try again.");
    return;
  }

  try {
    const res = await api.post(
      `/api/users/${userId}/cart`,
      { productId, quantity: qtyChange },
      authHeaders
    );

    console.log("✅ Product added to cart:", productId);
    if (res.data?.cart) {
      setCart(res.data.cart);
    } else {
      console.warn("⚠️ Cart response missing:", res.data);
    }
  } catch (err) {
    console.error("🚨 Error adding to cart:", err.response?.data || err.message);
  }
};


  // ✅ Remove item
  const removeFromCart = async (productId) => {
    if (!userId) return;

    try {
      const res = await api.delete(
        `/api/users/${userId}/cart/${productId}`,
        authHeaders
      );
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    if (!userId) return;
    try {
      await api.delete(`/api/users/${userId}/cart`, authHeaders);
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ Totals
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      ((item.product?.price ?? item.price ?? 0) * (item.quantity ?? 0)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
