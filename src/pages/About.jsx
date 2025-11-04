import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            About JewelRolin
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            A fusion of tradition, elegance, and innovation — every JewelRolin
            piece reflects the art of timeless craftsmanship designed for the
            modern soul.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] opacity-20 blur-3xl rounded-full"></div>
            <img
              src="/src/assets/JeweRolin.png"
              alt="About JewelRolin"
              className="w-full h-auto rounded-2xl shadow-2xl hover:scale-[1.03] transition-transform duration-500"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4 text-[var(--brand)]">
              Crafted with Passion & Precision
            </h3>
            <p className="text-gray-700 leading-relaxed text-base mb-6">
              At JewelRolin, we believe jewelry is more than adornment — it’s a
              reflection of identity and emotion. Every gem we craft carries a
              story of authenticity and elegance. From concept to creation, our
              artisans breathe life into designs that honor both tradition and
              modern artistry.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="backdrop-blur-sm bg-white/70 border border-gray-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h4 className="font-semibold text-[var(--brand)] mb-2">
                  ✨ Handmade Excellence
                </h4>
                <p className="text-sm text-gray-600">
                  Every item is crafted meticulously by hand, ensuring uniqueness
                  and top-notch quality in every detail.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="backdrop-blur-sm bg-white/70 border border-gray-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h4 className="font-semibold text-[var(--brand)] mb-2">
                  🌿 Sustainable Luxury
                </h4>
                <p className="text-sm text-gray-600">
                  We ethically source materials and embrace eco-conscious
                  practices — luxury with responsibility.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            Why Choose JewelRolin?
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            We’re not just jewelers — we’re storytellers. Our mission is to create
            exquisite pieces that celebrate love, individuality, and sustainability.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Certified Materials",
              "Unique Custom Designs",
              "Lifetime Polishing Service",
              "Global Shipping",
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
