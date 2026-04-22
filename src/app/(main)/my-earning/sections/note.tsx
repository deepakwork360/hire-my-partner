"use client";

import { motion } from "framer-motion";
import { Info, Clock } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function Note() {
  return (
    <div className={`${outfit.className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-primary/5 border border-primary/10 rounded-[24px] p-6 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
           <Info size={18} className="text-primary" />
        </div>
        
        <div className="flex flex-col gap-1">
           <h4 className="text-text-main text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              Withdrawal Policy
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
           </h4>
           <div className="flex items-center gap-2 text-text-muted text-xs font-medium leading-relaxed">
              <Clock size={12} className="text-text-muted" />
              <p>Withdrawals are processed within <span className="text-primary/80 font-bold">24–48 hours</span>. Please ensure your bank details are up to date in the settings tab.</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}



