// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-950 text-gray-300 mt-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto px-3 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* brand */}
        <div>
          <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            JewelRolins
          </h2>
          <p className="text-sm leading-relaxed">
            Discover premium handcrafted jewelry. Shine every day with elegance
            & style.
          </p>
        </div>

        {/* quick links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[var(--brand)] transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[var(--brand)] transition">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/our-story"
                className="hover:text-[var(--brand)] transition"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[var(--brand)] transition">
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add"
                className="hover:text-[var(--brand)] transition"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* support */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-[var(--brand)] transition">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-[var(--brand)] transition"
              >
                Register
              </Link>
            </li>
            {/* Removed Order Success link */}
          </ul>
        </div>

        {/* social */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-[var(--accent)] hover:to-[var(--brand)] hover:text-white transition-all duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/jewelrolin_by_humaira?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-[var(--accent)] hover:to-[var(--brand)] hover:text-white transition-all duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/923056087065?text=Hello%20JewelRolins!%20I%20am%20interested%20in%20your%20jewelry.%20Can%20you%20share%20more%20details%3F"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-[var(--accent)] hover:to-[var(--brand)] hover:text-white transition-all duration-300"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} JewelRolins. All rights reserved.
      </div>
    </motion.footer>
  );
}
