// src/pages/admin/AddProduct.jsx
import api from "../../services/axiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// normalize category input
function normalizeCategory(input) {
  if (!input) return "";
  const normalized = input.trim().toLowerCase();
  const categories = ["Rings", "Watches", "Necklaces", "Earrings", "Bracelets"];
  for (const c of categories) {
    if (c.toLowerCase().includes(normalized) || normalized.includes(c.toLowerCase())) {
      return c;
    }
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

// Convert Google Drive share link → direct image link
const normalizeDriveLink = (url) => {
  const match = url && url.match(/[-\w]{25,}/);
  if (match) return `https://drive.google.com/uc?export=view&id=${match[0]}`;
  return url;
};

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    images: [],
  });
  const [imageInput, setImageInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const addImageUrl = () => {
    if (!imageInput) return;
    const url = normalizeDriveLink(imageInput.trim());
    if (!url) {
      setMessage("Invalid URL");
      return;
    }
    setForm((s) => ({ ...s, images: [...s.images, { src: url }] }));
    setImageInput("");
    setMessage("✅ Image added.");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const toAdd = files.map((file) => ({
      src: URL.createObjectURL(file),
      file,
    }));
    setForm((s) => ({ ...s, images: [...s.images, ...toAdd] }));
    setMessage("✅ Local image(s) added.");
  };

  const handleRemoveImage = (i) => {
    const copy = [...form.images];
    const removed = copy.splice(i, 1)[0];
    if (removed?.file && removed.src && removed.src.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(removed.src);
      } catch {}
    }
    setForm((s) => ({ ...s, images: copy }));
  };

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1] || "");
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCategory = normalizeCategory(form.category);
    const price = Number(form.price || 0);
    const discount = Number(form.discount || 0);

    const formData = new FormData();
    formData.append("name", form.title);
    formData.append("description", form.description || "");
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("category", cleanCategory || "Uncategorized");

    const urlList = [];

    form.images.forEach((imageObj, index) => {
      const imgSrc = typeof imageObj === "string" ? imageObj : imageObj?.src;
      const file = imageObj?.file;

      if (file instanceof File) {
        formData.append("images", file);
      } else if (typeof imgSrc === "string" && imgSrc.startsWith("data:")) {
        const fileFromData = dataURLtoFile(imgSrc, `image-${Date.now()}-${index}.jpg`);
        formData.append("images", fileFromData);
      } else if (typeof imgSrc === "string" && imgSrc) {
        urlList.push(imgSrc);
      }
    });

    if (urlList.length > 0) {
      formData.append("imageUrls", JSON.stringify(urlList));
    }

    try {
      // Do NOT set Content-Type header here — let browser set boundary
      await api.post("/api/products", formData);
      alert("✅ Product added.");
      navigate("/admin/dashboard");
    } catch (err) {
      // better error message handling
      console.error("Add product error:", err.response?.data || err.message || err);
      const msg = err.response?.data?.message || err.normalizedMessage || err.message || "Error adding product";
      alert("Error adding product: " + msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (Rings, Watches...)"
          className="w-full border px-3 py-2 rounded"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="border px-3 py-2 rounded w-full"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Add Image</label>

          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL (Google Drive, Unsplash, etc.)"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 rounded-lg shadow text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
            >
              Add
            </button>
          </div>

          <label className="px-4 py-2 border rounded cursor-pointer inline-block">
            Upload from PC
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {message && <p className="text-green-600 text-sm">{message}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {form.images.map((imgObj, i) => {
            const src = typeof imgObj === "string" ? imgObj : imgObj?.src;
            if (!src) return null; // avoid empty src warnings
            return (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg shadow font-semibold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
