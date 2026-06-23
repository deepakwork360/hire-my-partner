"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Gift, Calendar, MessageSquareHeart, User } from "lucide-react";
import Image from "next/image";
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

export default function VirtualGifts() {
  const { user } = useAuthStore();
  const [gifts, setGifts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loggedPartner = getLoggedPartner(user);
        if (loggedPartner) {
          const existing = localStorage.getItem("hire_my_partner_partner_earnings");
          if (existing) {
            const list = JSON.parse(existing);
            const filtered = list.filter((item: any) => 
              item.type === "gift" && 
              item.isVirtual && 
              String(item.partnerId).toLowerCase() === String(loggedPartner.id).toLowerCase()
            );
            setGifts(filtered);
          }
        } else {
          setGifts([]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  return (
    <div className={`${outfit.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-bg-card border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col gap-8 shadow-xl shadow-black/5"
      >
        <div className="flex flex-col gap-3 relative">
          <div className="absolute -left-10 top-0 w-1 h-full bg-linear-to-b from-primary-dark to-accent rounded-full blur-[1px] opacity-50 hidden md:block" />
          <h2 className={`${rochester.className} text-4xl text-text-main tracking-wide flex items-center gap-4`}>
            Virtual Gifts Received
            <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent" />
          </h2>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Gift size={10} className="text-primary" />
            Tokens of appreciation and virtual gifts sent by clients
          </p>
        </div>

        {gifts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {gifts.map((gift, idx) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-secondary/40 border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:border-primary/20 transition-all group"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border-main shrink-0 shadow-md">
                    <Image
                      src={gift.giftImage || "https://i.pinimg.com/736x/9e/4c/3e/9e4c3e1a86011ee313113c7b033de3dd.jpg"}
                      alt={gift.giftTitle || "Virtual Gift"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-text-main font-bold text-base group-hover:text-primary transition-colors">
                          {gift.giftTitle}
                        </span>
                        <span className="text-emerald-500 font-black text-sm">
                          +₹{gift.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <User size={10} className="text-primary shrink-0" />
                          From: {gift.sender || "Client"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-primary shrink-0" />
                          {gift.time} · {gift.date?.split(",")[1]?.trim() || gift.date}
                        </span>
                      </div>
                    </div>
                    {gift.message && (
                      <div className="bg-bg-card border border-border-main/50 rounded-xl p-3 flex gap-2">
                        <MessageSquareHeart size={12} className="text-violet-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-text-muted leading-relaxed font-medium italic">
                          "{gift.message}"
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-3 bg-bg-secondary/20 rounded-2xl border border-dashed border-border-main">
            <Gift size={32} className="text-text-muted animate-pulse" />
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest">
              No virtual gifts received yet
            </p>
            <p className="text-text-muted/60 text-[11px] max-w-xs mx-auto">
              Your virtual gifts and appreciation tokens from completed sessions will show up here.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
