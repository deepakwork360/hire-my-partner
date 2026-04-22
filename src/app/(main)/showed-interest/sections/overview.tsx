"use client";

import ProfileInterest from "@/components/Profile Interest Analytics/profile-interest";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const mockInterestData = {
  totalInterestReceived: 842,
  newInLast7Days: 48,
  connectionsMade: 156,
};

export default function Overview() {
  return (
    <div className={`space-y-10 ${outfit.className}`}>
      {/* Analytics Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border-main"
      >
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Heart className="text-primary" size={24} />
           </div>
           <div>
              <h3 className="text-white text-xl font-black uppercase tracking-wider">Interest Analytics</h3>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={12} className="text-primary" />
                 Engagement metrics and connection trends
              </p>
           </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <ProfileInterest data={mockInterestData} />
    </div>
  );
}



