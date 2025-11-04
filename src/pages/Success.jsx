// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      console.log("🧾 Stripe session ID:", sessionId);

      if (!sessionId) {
        console.error("❌ No session_id found in URL");
        setStatus("Invalid session. Please try again.");
        setLoading(false);
        return;
      }

      try {
        // ✅ CALL YOUR BACKEND (change port if needed)
        const backendURL = "https://jewelrolinbackend-production.up.railway.app//api/payments/verify-session";

        const res = await axios.get(backendURL, {
          params: { session_id: sessionId },
        });

        console.log("💳 Stripe Verify Response:", res.data);

        if (res.data?.payment_status === "paid") {
          console.log("✅ Payment successful!");
          setStatus("Payment successful! Thank you for your order.");
          
        } else if (res.data?.payment_status === "unpaid" || res.data?.payment_status === "canceled") {
          console.warn("⚠️ Payment failed or canceled.");
          setStatus("Payment failed or was canceled. Please try again.");
        } else {
          console.warn("⚠️ Payment not completed. Status:", res.data?.payment_status);
          setStatus("Payment not completed. Please contact support.");
        }
      } catch (error) {
        console.error("❌ Error verifying payment:", error.message);
        setStatus("Error verifying payment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          {loading ? "Processing..." : "Payment Status"}
        </h1>
        <p className="text-gray-700 mb-6">{status}</p>

        {!loading && (
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            Go Back Home
          </button>
        )}
      </div>
    </div>
  );
}
