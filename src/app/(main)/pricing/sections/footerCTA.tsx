"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Phone, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function FooterCTA() {
  return (
    <section
      className={`py-12 md:py-16 px-4 bg-[#050505] relative overflow-hidden ${outfit.className}`}
    >
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/2 backdrop-blur-2xl border border-white/5 rounded-[48px] p-10 md:p-20 overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Internal Glow Effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full transition-all duration-700 group-hover:bg-pink-500/20" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full transition-all duration-700 group-hover:bg-rose-500/20" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-8"
            >
              <h3
                className={`${rochester.className} text-4xl md:text-5xl lg:text-6xl text-pink-500`}
              >
                Still Not Sure?
              </h3>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Get in Touch
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12"
            >
              Have questions or need help choosing the right plan? We’re here to
              help you make the best decision for your needs.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-1 transition-all duration-300 group/btn">
                <Phone className="w-4 h-4" />
                <span>Schedule a Call</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <MessageSquare className="w-4 h-4 text-pink-500" />
                <Link href="/contact">Contact Support</Link>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
