// filepath: src/pages/Cart.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import cartAnimation from "../assets/Shopping.json";

export default function Cart() {
  const { cart, removeFromCart, clearCart, addToCart, subtotal } =
    useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <div className="flex justify-center mb-6">
          <Lottie
            animationData={cartAnimation}
            loop
            autoplay
            className="w-56 h-56 sm:w-72 sm:h-72"
          />
        </div>
        <Link
          to="/"
          className="inline-block mt-2 px-5 py-2 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-3 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const product = item.product || {};
            const rawImage = product.images?.[0] || item.image;
            const imageUrl = rawImage
              ? rawImage.startsWith?.("http")
                ? rawImage
                : `/uploads/${rawImage}`
              : "/placeholder.png";

            const name = product.name || item.title || "Unnamed Product";
            const price = product.price || item.price || 0;
            const quantity = item.quantity || item.qty || 1;
            const productId = product._id || item._id || item.product || null;

            return (
              <div
                key={productId || index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-lg p-3 bg-white shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={name}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  className="w-full sm:w-24 h-44 sm:h-24 object-cover rounded flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{name}</h3>
                  <p className="text-sm font-semibold">PKR {price}</p>

                  <div className="mt-3 sm:mt-2 flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => addToCart(productId, -1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <div className="px-3">{quantity}</div>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => addToCart(productId, 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right flex-shrink-0 sm:w-32">
                  <div className="font-semibold">
                    PKR {(price * quantity).toFixed(0)}
                  </div>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <aside className="border rounded-lg p-5 h-fit bg-white shadow-sm md:sticky md:top-24">
          <div className="text-lg font-semibold mb-3">Order Summary</div>
          <div className="flex justify-between mb-2">
            <div>Subtotal</div>
            <div className="font-semibold">PKR {subtotal.toFixed(0)}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Shipping calculated at checkout
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full px-4 py-2 mb-3 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </motion.div>
  );
}
