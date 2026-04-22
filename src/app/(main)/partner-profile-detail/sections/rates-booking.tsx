"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { CheckCircle2, Circle, HeartHandshake, Zap, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ADD_ONS = [
  { id: "photo", label: "Casual Photoshoot", price: 1500, icon: Zap },
  { id: "playlist", label: "Personalized Playlist", price: 500, icon: Sparkles },
  { id: "travel", label: "Extra Travel Time", price: 2000, icon: Clock },
];

export default function RatesBooking() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const hourlyRate = 4999;
  const minHours = 2;

  const handleToggle = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const calculateTotal = () => {
    const base = hourlyRate * minHours;
    const extras = ADD_ONS.filter((addon) =>
      selectedAddOns.includes(addon.id),
    ).reduce((sum, item) => sum + item.price, 0);
    return base + extras;
  };

  return (
    <section
      className={`relative py-10 md:py-16 lg:py-20 px-4 bg-bg-base overflow-hidden ${outfit.className}`}
    >
      {/* ── BACKGROUND AMBIANCE ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-dark/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] w-full mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch">
          
          {/* Left Column: Configuration Dashboard */}
          <div className="flex-[1.4] flex flex-col bg-bg-card backdrop-blur-3xl border border-border-main rounded-[32px] p-5 md:p-8 shadow-2xl shadow-black/5 relative overflow-hidden">
             {/* Subtitle */}
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={10} className="text-primary" />
                <span className="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Reservation Logic</span>
             </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2
                className={`${rochester.className} text-4xl md:text-5xl text-text-main mb-0.5 leading-none`}
              >
                Rates & <span className="text-primary">Options</span>
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mt-2" />
            </motion.div>

            {/* Base Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-bg-secondary border border-border-main rounded-2xl group hover:bg-bg-card transition-all">
                <p className="text-text-muted text-[8px] font-black uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                  Hourly Rate
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-text-main text-2xl font-black">₹{hourlyRate}</span>
                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">/ Hr</span>
                </div>
              </div>
              <div className="p-4 bg-bg-secondary border border-border-main rounded-2xl group hover:bg-bg-card transition-all">
                <p className="text-text-muted text-[8px] font-black uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                  Min Engagement
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-text-main text-2xl font-black">{minHours}</span>
                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">Hours</span>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <h3 className="text-text-main text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
                <Sparkles size={12} className="text-primary" />
                Experience Add-ons
              </h3>
              <div className="space-y-2">
                {ADD_ONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  const Icon = addon.icon;
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggle(addon.id)}
                      className={`flex items-center justify-between p-3.5 rounded-[18px] cursor-pointer transition-all duration-300 border ${
                        isSelected 
                          ? "bg-primary/10 border-primary/40 shadow-[0_10px_25px_rgba(var(--primary-rgb),0.1)]" 
                          : "bg-bg-base border-border-main hover:border-primary/30 hover:shadow-md hover:bg-bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isSelected ? "bg-primary text-white" : "bg-bg-card text-text-muted"}`}>
                           <Icon size={16} />
                        </div>
                        <div>
                           <p className={`text-xs font-bold tracking-tight transition-colors ${isSelected ? "text-primary font-black" : "text-text-main"}`}>
                             {addon.label}
                           </p>
                           <p className="text-[7px] font-black uppercase tracking-widest text-text-muted">Premium Service</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-black tracking-widest ${isSelected ? "text-primary" : "text-text-muted"}`}>
                           + ₹{addon.price}
                         </span>
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                           isSelected 
                             ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                             : "border-slate-300 dark:border-slate-600 bg-bg-secondary/50 shadow-inner"
                         }`}>
                            {isSelected && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="flex-1 lg:max-w-[340px] flex flex-col bg-bg-card backdrop-blur-3xl border border-border-main rounded-[32px] p-5 md:p-7 shadow-2xl shadow-black/5 relative overflow-hidden">
             <div className="relative flex flex-col h-full">
                <h3 className="text-text-main text-[8px] font-black uppercase tracking-[0.4em] mb-6 pb-3 border-b border-border-main">
                  Summary
                </h3>

                <div className="space-y-3 mb-8 flex-grow">
                   <div className="flex justify-between items-center group">
                      <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Base Investment</span>
                      <span className="text-text-main text-sm font-black">₹{hourlyRate * minHours}</span>
                   </div>

                   {ADD_ONS.map((addon) => {
                     if (selectedAddOns.includes(addon.id)) {
                       return (
                         <motion.div
                           key={`summary-${addon.id}`}
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="flex justify-between items-center"
                         >
                           <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{addon.label}</span>
                           <span className="text-primary text-sm font-black">₹{addon.price}</span>
                         </motion.div>
                       );
                     }
                     return null;
                   })}
                </div>

                <div className="mt-auto pt-6 border-t border-border-main">
                   <div className="flex flex-col gap-0.5 mb-5 text-center">
                      <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">Total Investment</span>
                      <span className="text-text-main text-3xl md:text-4xl font-black tracking-tighter">
                        ₹{calculateTotal()}
                      </span>
                   </div>

                   <Link
                     href="/checkout"
                     className="group relative w-full h-12 bg-primary rounded-xl flex items-center justify-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg hover:-translate-y-1 transition-all overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                     <HeartHandshake size={18} />
                     <span>Secure Booking</span>
                   </Link>
                   
                   <p className="text-center text-text-muted text-[7px] font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                      <ShieldCheck size={9} />
                      Secure Transaction
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}



