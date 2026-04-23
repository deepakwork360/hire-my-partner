"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Heart, Star, Sparkles, CheckCircle2 } from "lucide-react";
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

const MIN_CUSTOM_TIP = 250;
const MAX_CUSTOM_TIP = 100000;

export default function ChooseTip({ onTipChange }: ProportionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleSelect = (amount: number, label: string) => {
    setSelected(amount);
    setCustomValue("");
    setError(null);
    setIsApplied(false);
    onTipChange(amount, label, "");
  };

  const handleCustomChange = (val: string) => {
    setCustomValue(val);
    setSelected(null);
    setIsApplied(false);
    
    const amount = parseFloat(val);
    
    if (val === "") {
      setError(null);
      onTipChange(null, "Custom Tip", "");
      return;
    }

    if (amount < MIN_CUSTOM_TIP) {
      setError(`Minimum custom tip is ₹${MIN_CUSTOM_TIP}`);
    } else if (amount > MAX_CUSTOM_TIP) {
      setError(`Maximum custom tip is ₹${MAX_CUSTOM_TIP.toLocaleString()}`);
    } else {
      setError(null);
    }

    onTipChange(amount || 0, "Custom Tip", val);
  };

  const handleApply = () => {
    if (!error && customValue) {
      setIsApplied(true);
      // Small timeout to reset the applied state visual if needed, 
      // or keep it until next change
    }
  };

  return (
    <div className={`max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 ${outfit.className}`}>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main text-3xl font-black uppercase tracking-wider">Choose Tip Amount</h2>
          <p className="text-text-muted text-sm font-medium tracking-wide">Select a preset amount or enter a custom value below</p>
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
                  ? "bg-primary/10 border-primary shadow-2xl shadow-primary/10" 
                  : "bg-bg-card border-border-main hover:bg-bg-secondary hover:border-primary/30"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-bg-secondary text-text-muted"
                }`}>
                  <Icon size={28} />
                </div>
                
                <div className="space-y-1">
                  <p className={`text-xl font-black ${isSelected ? "text-primary" : "text-text-main"}`}>₹{option.amount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{option.label}</p>
                </div>

                {isSelected && (
                  <motion.div 
                    layoutId="selected-tip"
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-bg-base"
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] p-px bg-border-main/50 overflow-hidden group shadow-2xl shadow-black/5"
        >
          <div className="bg-bg-card rounded-[39px] p-8 md:p-12 relative overflow-hidden border border-border-main">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/15 transition-colors duration-700" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Premium Feature</span>
                </div>
                <h3 className="text-text-main text-2xl md:text-3xl font-black uppercase tracking-wider leading-tight">
                  Enter Custom <br className="hidden md:block" /> Tip Amount
                </h3>
                <p className="text-text-muted text-sm max-w-sm mx-auto lg:mx-0 font-medium leading-relaxed">
                  Every contribution is valued. Enter a specific amount that reflects your appreciation.
                </p>
              </div>

              <div className="w-full lg:w-[450px] relative group">
                {/* Input Container */}
                <div className="relative flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] select-none">
                      ₹
                    </span>
                     <input 
                      type="number" 
                      value={customValue}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !error && customValue) {
                          handleApply();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      placeholder="0"
                      className={`w-full h-24 pl-16 pr-8 bg-bg-secondary border rounded-3xl text-text-main text-4xl font-black focus:outline-none transition-all placeholder:text-text-muted/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        error 
                        ? "border-red-500/50 focus:border-red-500/80 focus:bg-red-500/5" 
                        : "border-border-main focus:border-primary/40 focus:bg-primary/5"
                      }`}
                    />
                    
                    {/* Premium Focus Border Overlay */}
                    <div className={`absolute inset-0 rounded-3xl border scale-[1.03] opacity-0 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-500 pointer-events-none ${
                      error ? "border-red-500/20" : "border-primary/20"
                    }`} />
                  </div>

                  {/* Confirm Button */}
                  <motion.button
                    onClick={handleApply}
                    whileHover={!error && customValue ? { scale: 1.05 } : {}}
                    whileTap={!error && customValue ? { scale: 0.95 } : {}}
                    disabled={!!error || !customValue}
                    className={`h-16 px-8 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all flex flex-col items-center justify-center gap-1 min-w-[110px] ${
                      isApplied
                      ? "bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                      : !error && customValue
                      ? "bg-primary text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
                      : "bg-bg-secondary text-text-muted cursor-not-allowed border border-border-main"
                    }`}
                  >
                    <CheckCircle2 size={16} className={isApplied ? "scale-110" : ""} />
                    <span>{isApplied ? "Applied" : "Apply"}</span>
                  </motion.button>
                  
                  {/* Subtle Glow beneath input */}
                  <div className={`absolute -inset-2 blur-2xl rounded-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    error ? "bg-red-500/5" : "bg-primary/5"
                  }`} />
                </div>

                {/* Validation Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-3 ml-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Quick Add Suggestion */}
                <div className="mt-4 flex items-center justify-between px-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Secure Payment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



