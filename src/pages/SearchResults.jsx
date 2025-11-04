import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../services/axiosConfig";
import { motion } from "framer-motion";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProductCard({ p }) {
  return (
    <motion.div
      className="border rounded p-3 hover:shadow-lg transition bg-white"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to={`/product/${p._id}`}>
        <img
          src={p.images?.[0] || ""}
          alt={p.name}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="mt-2 font-semibold">{p.name}</h3>
        <div className="text-gray-600">PKR {p.price}</div>
      </Link>
    </motion.div>
  );
}

export default function SearchResults() {
  const q = useQuery().get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalize = (txt) => (txt || "").toLowerCase().trim();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.get("/api/products")
      .then((res) => {
        if (!mounted) return;
        const all = Array.isArray(res.data.products) ? res.data.products : [];
        const query = normalize(q);

        // Smart partial + plural search
        const matches = all.filter((p) => {
          const title = normalize(p.name);
          const category = normalize(p.category);
          return (
            title.includes(query) ||
            category.includes(query) ||
            title.startsWith(query) ||
            category.startsWith(query)
          );
        });

        setProducts(matches);
      })
      .catch(() => setProducts([]))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search results for{" "}
        <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          "{q}"
        </span>
      </h1>
      {loading ? (
        <div className="text-center py-12">Searching…</div>
      ) : products.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">No products found.</div>
      )}
    </div>
  );
}