"use client";

import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import { Info, Clock } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function CookieEffectiveDate() {
  return (
    <section
      className={`pt-8 md:pt-12 pb-20 px-4 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-bg-secondary border border-border-main rounded-[48px] p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-linear-to-r from-transparent to-primary" />
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">
                  Cookie Usage Basics
                </h2>
                <div className="w-8 h-px bg-linear-to-l from-transparent to-primary" />
              </div>

              {/* Refined Date Badge - Centered & Subtle */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border-main">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                  Last Updated:{" "}
                  <span className="text-text-main">April 17, 2026</span>
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl space-y-8">
              <p className="text-text-muted text-lg md:text-xl font-light leading-relaxed text-center">
                This Cookie Policy explains how Meet Me uses cookies and similar
                technologies to recognize you when you visit our platform. It
                explains what these technologies are and why we use them.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



