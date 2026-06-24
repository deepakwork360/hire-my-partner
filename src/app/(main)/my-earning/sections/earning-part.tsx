"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Wallet, ArrowUpRight, Banknote } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { partners } from "@/modules/partner/data/partners";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

const getLoggedPartner = (currentUser: any) => {
  if (!currentUser) return null;
  try {
    const approvedStr = localStorage.getItem("approved_partners");
    if (approvedStr) {
      const list = JSON.parse(approvedStr);
      const found = list.find((p: any) => 
        (p.id && String(p.id).toLowerCase() === String(currentUser.id).toLowerCase()) ||
        (p.name && p.name.toLowerCase() === currentUser.name.toLowerCase())
      );
      if (found) return found;
    }
  } catch (e) {
    console.error(e);
  }
  
  const nameLower = currentUser.name?.toLowerCase();
  const matched = partners.find(p => 
    p.name.toLowerCase() === nameLower ||
    String(p.id).toLowerCase() === String(currentUser.id).toLowerCase()
  );
  return matched || null;
};

export default function EarningPart() {
  const { user } = useAuthStore();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [done, setDone] = useState(false);
  const [dynamicEarnings, setDynamicEarnings] = useState(0);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loggedPartner = getLoggedPartner(user);
        if (loggedPartner) {
          setIsPartner(true);
          const existing = localStorage.getItem("hire_my_partner_partner_earnings");
          if (existing) {
            const list = JSON.parse(existing);
            const filtered = list.filter((item: any) => 
              String(item.partnerId).toLowerCase() === String(loggedPartner.id).toLowerCase()
            );
            const total = filtered.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
            setDynamicEarnings(total);
          }
        } else {
          setIsPartner(false);
          setDynamicEarnings(0);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const totalDisplay = isPartner ? (12350 + dynamicEarnings) : 0;
  const withdrawableDisplay = isPartner ? (9000 + dynamicEarnings) : 0;

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 2000);
  };

  return (
    <div className={`${outfit.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-bg-card border border-border-main rounded-[32px] p-8 md:p-10 shadow-xl shadow-black/5"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
               <Wallet size={14} className="text-primary" />
               <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Earnings Summary</span>
            </div>
            
            <h2 className={`${rochester.className} text-5xl text-text-main tracking-wide`}>
              My Earnings
            </h2>

            <div className="flex flex-col gap-4 xl:gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-primary text-lg xl:text-xl font-black tracking-tight">Total Earnings:</span>
                <span className="text-text-main text-3xl md:text-4xl xl:text-5xl font-black">₹{totalDisplay.toLocaleString()}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-primary text-lg xl:text-xl font-black tracking-tight">Withdrawable Amount:</span>
                <span className="text-text-main text-3xl md:text-4xl xl:text-5xl font-black underline decoration-primary/60 underline-offset-8">₹{withdrawableDisplay.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleWithdraw}
            disabled={isWithdrawing || done}
            className={`group relative cursor-pointer overflow-hidden px-10 h-16 rounded-2xl font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 transition-all duration-500 ${
              done 
                ? "bg-emerald-600 text-white" 
                : "bg-linear-to-r from-primary-dark via-primary to-accent text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            }`}
          >
            {isWithdrawing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : done ? (
              "Request Sent ✓"
            ) : (
              <>
                <Banknote size={16} />
                Withdraw Now
              </>
            )}
            
            {/* Animated shine effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}



