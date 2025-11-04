// src/pages/OurStory.jsx
import React from "react";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* heading */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our{" "}
        <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          Story
        </span>
      </motion.h1>

      {/* paragraph */}
      <motion.p
        className="text-lg leading-relaxed text-center text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        At{" "}
        <span className="font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          JewelRolins
        </span>
        , every piece of jewelry tells a story of passion, craftsmanship, and
        elegance. Founded with love for detail, our mission is to make every
        customer feel special by wearing designs that combine tradition with
        modern style.
      </motion.p>
    </div>
  );
}
