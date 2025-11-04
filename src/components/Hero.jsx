import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const handleScroll = (e) => {
    e.preventDefault();
    const target = document.querySelector("#our-products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="grid md:grid-cols-2 items-center gap-10 py-10 sm:py-16">
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-snug mb-4">
          Discover
          <br />
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            Timeless Jewelry
          </span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md">
          Elegance. Passion. Craftsmanship. Find unique, hand-crafted jewelry
          that defines your style and enhances your beauty.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="#our-products"
            onClick={handleScroll}
            className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] shadow-md hover:opacity-90 transition"
          >
            Explore Collection
          </a>

          <a
            href="/about"
            className="px-6 py-3 rounded-full border border-[var(--brand)] text-[var(--brand)] font-semibold hover:bg-[var(--brand)] hover:text-white transition"
          >
            Learn More
          </a>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] blur-3xl opacity-30 rounded-full -z-10" />
          <img
            src="/src/assets/JeweRolin.png"
            alt="Hero"
            className="w-full h-auto rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform"
          />
        </div>
      </motion.div>
    </section>
  );
}
