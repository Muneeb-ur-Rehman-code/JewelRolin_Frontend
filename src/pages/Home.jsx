import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/axiosConfig";
import Hero from "../components/Hero.jsx";
import { CartContext } from "../context/CartContext.jsx";

function ProductCard({ p }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: p._id,
      title: p.name,
      price: p.price,
      image: p.images?.[0] ?? "",
      qty: 1,
      discount: p.discount || 0,
      stock: p.stock || 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const prefetch = useCallback(() => {}, []);

  return (
    <motion.div
      className="border rounded p-3 hover:shadow-xl transition bg-white flex flex-col group relative"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseEnter={prefetch}
    >
      <Link
        to={`/product/${encodeURIComponent(p._id)}`}
        title={`View ${p.name}`}
        aria-label={`View ${p.name}`}
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white px-2 py-1 rounded-full shadow flex items-center justify-center transition transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </Link>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded">
        <motion.img
          src={p.images?.[0] ?? ""}
          alt={p.name}
          className="w-full h-48 sm:h-56 md:h-60 object-cover rounded transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>

      {/* Product Details */}
      <h3 className="mt-3 font-semibold text-base sm:text-lg">{p.name}</h3>
      <div className="text-sm sm:text-base mb-2">
        <span className="font-semibold">PKR {p.price}</span>
      </div>

      {/* Discount & Stock Info */}
      <div className="text-xs text-gray-500 mb-3 flex flex-col gap-1">
        <span>
          💸 Discount:{" "}
          <span className="text-[var(--brand)] font-medium">
            {p.discount ? `${p.discount}%` : "No discount"}
          </span>
        </span>
        <span>
          📦 Stock:{" "}
          <span
            className={`font-medium ${
              p.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {p.stock > 0 ? `${p.stock} available` : "Out of stock"}
          </span>
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        disabled={p.stock <= 0}
        className={`mt-auto px-4 py-2 rounded text-white text-sm sm:text-base relative transition ${
          p.stock <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90"
        }`}
      >
        {added ? "✓ Added!" : p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
      </button>

      {/* Added animation */}
      {added && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-2 right-12 bg-[var(--brand)] text-white text-xs px-2 py-1 rounded shadow"
        >
          Added!
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/products")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const normalize = (str) => str?.toLowerCase() || "";

  let filtered =
    category === "All"
      ? products
      : products.filter((p) => {
          const c = normalize(p.category);
          const t = normalize(p.name);
          const combined = `${c} ${t}`;
          return combined.includes(category.toLowerCase().slice(0, -1));
        });

  if (sort === "low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const categories = [
    "All",
    "Rings",
    "Watches",
    "Necklaces",
    "Earrings",
    "Bracelets",
  ];

  return (
    <div className="max-w-8xl mx-auto px-3 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      <section id="our-products" className="mt-12">
        <motion.div
          className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            Our Products
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full border transition text-sm sm:text-base ${
                  category === c
                    ? "bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white"
                    : "text-gray-700 hover:text-[var(--brand)]"
                }`}
              >
                {c}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 px-3 py-2 border rounded-lg text-sm focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading products…
          </motion.div>
        ) : filtered.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <ProductCard key={p._id || i} p={p} />
            ))}
          </div>
        ) : (
          <motion.div
            className="col-span-full text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            No products found
          </motion.div>
        )}
      </section>
    </div>
  );
}
