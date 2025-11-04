import api from "../../services/axiosConfig";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function UserDetail() {
  const { id } = useParams();
   console.log("Route param id:", id); // ✅ log the ID
  const navigate = useNavigate();
 // const { getAllUsers } = useContext(AuthContext);
  const [user, setUser] = useState(null);

 useEffect(() => {
   console.log("Route param id:", id); // ✅ log the ID
  if (!id) return; // prevent API call if id is undefined

  api.get(`/api/users/${id}`)
    .then(res => setUser(res.data.user))
    .catch(() => setUser(null));
}, [id]);


  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow mt-6 text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-500">
          ⚠️ User not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow mt-6">
  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent">
    User Details
  </h2>

  {/* Wrapper with scroll */}
  <div className="overflow-x-auto ">
    <table className="min-w-full text-sm sm:text-base">
      <tbody>
        <tr className="border-b">
          <td className="p-2 font-semibold whitespace-nowrap">ID</td>
          <td className="p-2 break-all">{user._id}</td>
        </tr>
        <tr className="border-b">
          <td className="p-2 font-semibold whitespace-nowrap">Name</td>
          <td className="p-2 whitespace-nowrap">
            {user.name} 
          </td>
        </tr>
        <tr className="border-b">
          <td className="p-2 font-semibold whitespace-nowrap">Email</td>
          <td className="p-2 break-all">{user.email}</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold whitespace-nowrap">Role</td>
          <td className="p-2 capitalize">{user.role}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="mt-6 text-center">
    <button
      onClick={() => navigate(-1)}
      className="px-4 sm:px-5 py-2 rounded-lg shadow font-semibold bg-[var(--brand)] text-white hover:opacity-90 transition text-sm sm:text-base"
    >
      ⬅ Back to Users
    </button>
  </div>
</div>

  );
}
