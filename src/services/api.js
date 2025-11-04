// src/services/api.js
import axios from "axios";

export const LOCAL_KEY = "muhi_local_products_v1";
const LEGACY_KEY = "custom_products";
const DRIVE_API_KEY = "AIzaSyBWN-Vidl_rWoWAg8gEErj49CANp6i6yH4";

/**
 * Convert a Google Drive fileId into a direct viewable URL using Drive API
 */
export async function getDriveImage(fileId) {
  try {
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType&key=${DRIVE_API_KEY}`;
    const meta = await axios.get(metaUrl);

    if (meta.data.mimeType && meta.data.mimeType.startsWith("image/")) {
      return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
    }
    console.warn("File is not an image:", meta.data);
    return null;
  } catch (err) {
    console.error("Drive API failed", err.response?.data || err);
    return null;
  }
}

/**
 * Safely parse JSON from localStorage
 */
function safeParseLS(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn(`Failed to parse localStorage.${key}`, err);
    return [];
  }
}

/**
 * Get merged products:
 * - legacy admin products (custom_products) first (if present),
 * - then local products (muhi_local_products_v1),
 * - then public bundled products.json
 *
 * Duplicate IDs are removed, keeping the first occurrence (legacy -> local -> public).
 */
export async function getProducts() {
  let publicProducts = [];
  try {
    const res = await axios.get("/products.json");
    publicProducts = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    // network / file not found — we'll still return local data below
    console.warn("Failed to load /products.json:", err?.message || err);
  }

  // load both storages
  const legacy = safeParseLS(LEGACY_KEY);
  const local = safeParseLS(LOCAL_KEY);

  // combined order: legacy, local, public
  const combined = [...legacy, ...local, ...publicProducts];

  // dedupe by id (string-safe), keep first
  const seen = new Set();
  const dedup = [];
  for (const p of combined) {
    // some older entries might not have id — guard against that by generating a fallback key
    const rawId = p && (p.id ?? p._id ?? `${p.title || ""}_${p.price || ""}_${p.createdAt || ""}`);
    const key = String(rawId);
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(p);
  }

  return dedup;
}

/** Get single product by id from merged list (string-safe compare) */
export async function getProduct(id) {
  const list = await getProducts();
  return list.find((p) => String(p.id) === String(id)) || null;
}

/**
 * Add product locally (no backend). Returns the saved product (with id).
 * Note: this writes to LOCAL_KEY (muhi_local_products_v1) — legacy admin UI
 * might still write to custom_products; getProducts() merges both keys.
 */
export function addProduct(product) {
  const local = safeParseLS(LOCAL_KEY);
  const id = Date.now().toString();
  const newP = {
    id,
    title: product.title || "Untitled",
    price: Number(product.price || 0),
    image: product.image || "",
    description: product.description || "",
    images: product.images || [],
    category: product.category || "",
    discount: Number(product.discount || 0),
    sku: product.sku || "",
    material: product.material || "",
    createdAt: new Date().toISOString(),
  };
  local.unshift(newP);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(local));

  // notify other parts of the app (Home/Search listeners)
  try {
    window.dispatchEvent(new Event("storage")); // keep compatibility
  } catch {}
  window.dispatchEvent(new Event("custom_products_changed"));

  return newP;
}

/** Clear local admin-added products (for testing) — clears both keys for safety */
export function clearLocalProducts() {
  localStorage.removeItem(LOCAL_KEY);
  localStorage.removeItem(LEGACY_KEY);
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {}
  window.dispatchEvent(new Event("custom_products_changed"));
}
