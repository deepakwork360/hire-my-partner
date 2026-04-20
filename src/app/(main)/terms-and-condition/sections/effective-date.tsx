"use client";

import { motion } from "framer-motion";
import { Calendar, ShieldCheck } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export default function EffectiveDate() {
  return (
    <div className={`max-w-[1400px] mx-auto px-6 pt-12 ${outfit.className}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl"
      >
        <div className="flex items-center gap-4 px-6 py-2.5 bg-primary/10 rounded-full border border-primary/20">
          <Calendar size={16} className="text-primary" />
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
            Last Updated: <span className="text-white">April 17, 2024</span>
          </p>
        </div>

        <div className="flex items-center gap-4 px-6 py-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <ShieldCheck size={16} className="text-emerald-500" />
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            Secure & Verified Documentation
          </p>
        </div>
      </motion.div>
    </div>
  );
}
