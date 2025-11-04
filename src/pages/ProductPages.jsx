import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import api from "../services/axiosConfig";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        console.log("📡 Fetching product from backend with ID:", id);

        const res = await api.get(`/api/products/${id}`);
        const p = res.data.product || res.data || null;

        console.log("✅ FULL PRODUCT OBJECT FROM BACKEND ↓↓↓");
        console.table(p);
        console.log("🧾 All product fields:", JSON.stringify(p, null, 2));

        if (!mounted) return;
        if (!p) {
          console.warn("⚠️ No product found for ID:", id);
          setProduct(null);
          setImages([]);
          return;
        }

        // Ensure product always has a usable ID
        const fixedProduct = { ...p, _id: p._id || p.id || id };
        setProduct(fixedProduct);

        // Image setup
        const baseImgs =
          Array.isArray(fixedProduct.images) && fixedProduct.images.length
            ? fixedProduct.images
            : fixedProduct.image
            ? [fixedProduct.image]
            : [];

        setImages(baseImgs);
        setCurrent(0);

        console.log("🖼️ Images set:", baseImgs);
        console.log("💰 Price:", fixedProduct.price);
        console.log("🏷️ Discount:", fixedProduct.discount);
        console.log("📦 Stock:", fixedProduct.stock);
        console.log("🗂️ Category:", fixedProduct.category);
      } catch (err) {
        if (mounted) setProduct(null);
        console.error("❌ Error loading product:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const increment = () => setQty((s) => Math.min(99, s + 1));
  const decrement = () => setQty((s) => Math.max(1, s - 1));

  const handleAdd = async () => {
    await addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading)
    return <div className="w-full px-4 py-10 text-center">Loading product…</div>;
  if (!product)
    return (
      <div className="w-full px-4 py-10 text-center">Product not found</div>
    );

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice =
    product.finalPrice ||
    Math.round(price * (1 - (discount || 0) / 100) * 100) / 100;

  return (
    <motion.div
      className="w-full px-4 lg:px-8 py-10 grid md:grid-cols-2 gap-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* LEFT: gallery */}
      <div className="space-y-4">
        <div className="w-full rounded-lg overflow-hidden shadow relative bg-white flex items-center justify-center">
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrent((c) => (c - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20 hover:scale-105"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20 hover:scale-105"
              >
                ›
              </button>
            </>
          )}

          <img
            src={images[current] || product.image || ""}
            alt={`${product.name} - ${current + 1}`}
            className="w-full max-h-[520px] object-contain"
            loading="lazy"
          />

          {added && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-3 right-3 bg-[var(--brand)] text-white text-sm px-3 py-1 rounded shadow"
            >
              ✓ Added
            </motion.div>
          )}
        </div>

        {images && images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-full h-20 rounded overflow-hidden border ${
                  i === current ? "ring-2 ring-[var(--brand)]" : ""
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name}-${i}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: details */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          {product.name}
        </h1>
        <p className="text-gray-500 mb-4">{product.category}</p>

        {/* PRICE + DISCOUNT + STOCK */}
        <div className="mb-4 space-y-1">
          {discount > 0 ? (
            <>
              <div className="text-lg text-gray-500 line-through">
                PKR {price.toLocaleString()}
              </div>
              <div className="text-2xl font-semibold text-[var(--brand)]">
                PKR {finalPrice.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-green-600">
                {discount}% OFF
              </div>
            </>
          ) : (
            <div className="text-2xl font-semibold text-[var(--brand)]">
              PKR {price.toLocaleString()}
            </div>
          )}

          <div
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          {product.description || "Handcrafted jewelry with premium materials."}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border rounded overflow-hidden">
            <button
              onClick={decrement}
              className="px-3 py-2 text-lg hover:bg-gray-100"
            >
              −
            </button>
            <div className="w-12 text-center py-2">{qty}</div>
            <button
              onClick={increment}
              className="px-3 py-2 text-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            id="add-btn"
            className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 text-white font-semibold rounded-lg shadow transition"
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>

        <div className="text-sm text-gray-600 mt-auto">
          {product.sku && <div>SKU: {product.sku}</div>}
          {product.material && <div>Material: {product.material}</div>}
        </div>
      </div>
    </motion.div>
  );
}
