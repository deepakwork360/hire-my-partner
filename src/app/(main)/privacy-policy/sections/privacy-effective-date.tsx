"use client";

import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import { Info, Clock } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function PrivacyEffectiveDate() {
  return (
    <section className={`py-12 md:py-16 px-4 bg-[#050505] relative overflow-hidden ${outfit.className}`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 md:p-16 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full -z-10" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-linear-to-r from-transparent to-pink-500" />
                <Info className="w-5 h-5 text-pink-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Welcome to Meet Me
                </h2>
                <div className="w-8 h-px bg-linear-to-l from-transparent to-pink-500" />
              </div>

              {/* Refined Date Badge - Centered & Subtle */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                  Last Updated: <span className="text-slate-300">April 17, 2026</span>
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl space-y-8">
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed text-center">
                Your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our dating platform.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
