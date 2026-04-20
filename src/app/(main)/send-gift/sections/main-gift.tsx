"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function MainGift() {
  return (
    <section className={`relative w-full ${outfit.className}`}>
      {/* Banner Background */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/gift-banner.webp")' }}
        >
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1
              className={`${rochester.className} text-6xl md:text-8xl text-white tracking-wide mb-4 drop-shadow-2xl`}
            >
              Send a Gift
            </h1>

            <p className="text-slate-200 text-sm md:text-lg font-medium tracking-[0.1em] max-w-xl mx-auto leading-relaxed md:uppercase opacity-90">
              Choose a thoughtful gift for the person you booked for.
            </p>

            {/* Subtle Divider Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-1 w-24 bg-pink-500 rounded-full mt-6 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            />
          </motion.div>
        </div>

        {/* Bottom Fade Transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-5" />
      </div>
    </section>
  );
}
