// server/index.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// --- Simple products store for demo (replace with DB if needed)
const PRODUCTS_FILE = path.join(__dirname, "products.json");

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}
function writeProducts(arr) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(arr, null, 2));
}

// --- ROUTES ---

// Get all products
app.get("/api/products", (req, res) => {
  res.json(readProducts());
});

// Get single product by id
app.get("/api/products/:id", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Admin: add product manually
app.post("/api/products", (req, res) => {
  const products = readProducts();
  const newP = {
    ...req.body,
    id: Date.now().toString(),
  };
  products.unshift(newP);
  writeProducts(products);
  res.json(newP);
});

// Admin: fetch Instagram post data by post URL and return image + caption
app.get("/api/instagram/fetch", async (req, res) => {
  const { postUrl } = req.query;
  if (!postUrl) return res.status(400).json({ error: "postUrl required" });

  try {
    const token = process.env.FB_APP_TOKEN; // keep in .env
    const oembedUrl = "https://graph.facebook.com/v15.0/instagram_oembed";
    const resp = await axios.get(oembedUrl, {
      params: { url: postUrl, access_token: token },
    });
    // resp.data contains html, thumbnail_url, author_name, etc.
    return res.json({ success: true, data: resp.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch from Instagram. See server logs." });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
