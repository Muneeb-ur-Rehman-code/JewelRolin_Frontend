import api from "../../services/axiosConfig";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

 useEffect(() => {
  api
    .get(`/api/products/${id}`)
    .then((res) => {
      const p = res.data.product;
      if (!p) {
        alert("Product not found.");
        navigate("/admin/dashboard");
        return;
      }
      setForm({
        title: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        category: p.category,
        stock: p.stock || 0, // ✅ add this
        images: (p.images || []).map((u) => ({ src: u })), // normalize to {src}
      });
    })
    .catch(() => {
      alert("Product not found.");
      navigate("/admin/dashboard");
    });
}, [id, navigate]);

  // ✅ Handle input field changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Handle adding new image URL
  const handleImageAdd = async () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), { src: url }],
      }));
    }
  };

  // ✅ Handle removing image by index
  const handleImageRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle replacing an image
  const handleImageReplace = async (index) => {
    const url = prompt("Enter new image URL:");
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: prev.images.map((img, i) => (i === index ? { src: url } : img)),
      }));
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = Number(form.price || 0);
    const discount = Number(form.discount || 0);

    // For now send JSON update (images are URLs). If you want file upload on edit,
    // update backend PUT route to accept multipart/form-data.
    const updatedProduct = {
      name: form.title,
      description: form.description,
      price,
      discount,
      category: form.category,
        stock: Number(form.stock || 0), // ✅ new addition
      images: (form.images || []).map((i) => i.src || i),
    };

    try {
      await api.put(`/api/products/${id}`, updatedProduct);
      alert("✅ Product updated.");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Update product error:", err.response || err.message);
      alert("Error updating product: " + (err.response?.data?.message || err.message));
    }
  };

  if (!form) return <div className="text-center py-20">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        ✨ Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
        />

        <div className="grid grid-cols-2 gap-3">
  <input
    name="price"
    type="number"
    value={form.price}
    onChange={handleChange}
    placeholder="Price"
    className="border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
  />
  <input
    name="discount"
    type="number"
    value={form.discount}
    onChange={handleChange}
    placeholder="Discount %"
    className="border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
  />
</div>
        {/* ✅ Stock Field */}
<input
  name="stock"
  type="number"
  value={form.stock}
  onChange={handleChange}
  placeholder="Stock Quantity"
  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[var(--brand)]"
/>

        {/* ✅ Images Section */}
        <div>
          <label className="block font-medium mb-2">Product Images</label>
          <button
            type="button"
            onClick={handleImageAdd}
            className="px-4 py-2 rounded-lg shadow text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
          >
            ➕ Add Image
          </button>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {form.images?.map((u, i) => (
              <div
                key={i}
                className="relative border rounded overflow-hidden group"
              >
                <img
                  src={u.src || u}
                  alt=""
                  className="w-full h-28 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                  <button
                    type="button"
                    onClick={() => handleImageReplace(i)}
                    className="px-2 py-1 text-xs bg-[var(--accent)] text-white rounded"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Save / Cancel */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="submit"
            className="flex-1 py-2 sm:py-3 rounded-lg shadow font-semibold text-white 
                     bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] 
                     hover:opacity-90 transition text-sm sm:text-base"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex-1 py-2 sm:py-3 rounded-lg shadow border hover:bg-gray-100 
                     transition text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}