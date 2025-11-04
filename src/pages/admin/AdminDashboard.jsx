import React, { useEffect, useState } from "react";
import api from "../../services/axiosConfig";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/orders"),
        api.get("/api/users/getAllUsers"),
        ]);

        setProducts(productsRes.data.products || []);
        setOrders(ordersRes.data.orders || []);
       // setUsers(usersRes.data.users || []);
      } catch (err) {
        console.error("Dashboard data fetch error:", err.response?.data || err.message || err);
        // show normalized message when available
        const msg = err.response?.data?.message || err.message || "Failed to fetch dashboard data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message || err);
      const msg = err.response?.data?.message || err.message || "Error deleting product";
      alert("Error deleting product: " + msg);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      {/* header & actions omitted for brevity - keep your original UI */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Products</h2>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/add" className="px-4 py-2 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white shadow hover:opacity-90 transition text-sm sm:text-base">
            + Add Product
          </Link>
          <Link to="/" className="px-4 py-2 rounded border bg-white hover:bg-gray-50 transition text-sm sm:text-base">
            View Store
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 sm:p-3">ID</th>
              <th className="p-2 sm:p-3">Name</th>
              <th className="p-2 sm:p-3">Category</th>
              <th className="p-2 sm:p-3">Price</th>
              <th className="p-2 sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => (
                <tr key={p._id || `prod-${idx}`} className="border-t hover:bg-gray-50">
                  <td className="p-2 sm:p-3">{p._id || "—"}</td>
                  <td className="p-2 sm:p-3 max-w-[10rem] truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="p-2 sm:p-3">{p.category}</td>
                  <td className="p-2 sm:p-3">PKR {p.price}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => navigate(`/admin/edit/${p._id}`)} className="px-3 py-1 border rounded hover:bg-gray-100 text-xs sm:text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1 border rounded text-red-600 hover:bg-red-50 text-xs sm:text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
