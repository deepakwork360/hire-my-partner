"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Heart, Star, Sparkles } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

type ProportionProps = {
  onTipChange: (amount: number | null, label: string, custom: string) => void;
};

const TIP_OPTIONS = [
  { amount: 200, label: "Warm Thank You", icon: Heart },
  { amount: 500, label: "Great Session", icon: Star },
  { amount: 1000, label: "Exceptional Service", icon: Coins },
  { amount: 2000, label: "Amazing Companion", icon: Sparkles },
];

export default function ChooseTip({ onTipChange }: ProportionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");

  const handleSelect = (amount: number, label: string) => {
    setSelected(amount);
    setCustomValue("");
    onTipChange(amount, label, "");
  };

  const handleCustomChange = (val: string) => {
    setCustomValue(val);
    setSelected(null);
    const amount = parseFloat(val) || 0;
    onTipChange(amount, "Custom Tip", val);
  };

  return (
    <div className={`max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 ${outfit.className}`}>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-white text-3xl font-black uppercase tracking-wider">Choose Tip Amount</h2>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Select a preset amount or enter a custom value below</p>
        </div>

        {/* Preset Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIP_OPTIONS.map((option, idx) => {
            const Icon = option.icon;
            const isSelected = selected === option.amount;

            return (
              <motion.button
                key={option.amount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelect(option.amount, option.label)}
                className={`relative p-8 rounded-[32px] border transition-all flex flex-col items-center gap-4 text-center group ${
                  isSelected 
                  ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]" 
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-slate-400"
                }`}>
                  <Icon size={28} />
                </div>
                
                <div className="space-y-1">
                  <p className={`text-xl font-black ${isSelected ? "text-white" : "text-slate-300"}`}>₹{option.amount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{option.label}</p>
                </div>

                {isSelected && (
                  <motion.div 
                    layoutId="selected-tip"
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-[#050505]"
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 space-y-4">
              <h3 className="text-white text-xl font-black uppercase tracking-wider">Custom Tip Amount</h3>
              <p className="text-slate-500 text-sm">Enter the specific amount you'd like to share with your partner.</p>
            </div>

            <div className="w-full md:w-[400px] relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary">₹</span>
              <input 
                type="number" 
                value={customValue}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="0"
                className="w-full h-20 pl-12 pr-6 bg-black/40 border border-white/10 rounded-2xl text-white text-3xl font-black focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-800"
              />
              <div className="absolute inset-0 rounded-2xl border border-primary/20 scale-[1.02] opacity-0 group-focus-within:opacity-100 transition-all pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
