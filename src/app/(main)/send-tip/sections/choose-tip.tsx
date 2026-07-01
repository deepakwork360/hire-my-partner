"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Heart, Star, Sparkles, CheckCircle2, type LucideIcon } from "lucide-react";
import { Outfit, Rochester } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });

type ProportionProps = {
  onTipChange: (amount: number | null, label: string, custom: string) => void;
};

type TipOption = {
  amount: number;
  label: string;
  icon: string | LucideIcon;
  color: "rose" | "amber" | "emerald" | "violet";
};

const TIP_OPTIONS: TipOption[] = [
  { amount: 200, label: "Warm Thank You", icon: "/icons/heart.png", color: "rose" },
  { amount: 500, label: "Great Session", icon: "/icons/star.png", color: "amber" },
  { amount: 1000, label: "Exceptional Service", icon: "/icons/shield.png", color: "emerald" },
  { amount: 2000, label: "Amazing Companion", icon: "/icons/fire.png", color: "violet" },
];

const MIN_CUSTOM_TIP = 250;
const MAX_CUSTOM_TIP = 100000;

export default function ChooseTip({ onTipChange }: ProportionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelect = (amount: number, label: string) => {
    setSelected(amount);
    setCustomValue("");
    setError(null);
    setIsApplied(false);
    setIsVerifying(false);
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
      setError(`Min. ₹${MIN_CUSTOM_TIP}`);
    } else if (amount > MAX_CUSTOM_TIP) {
      setError(`Max. ₹${MAX_CUSTOM_TIP.toLocaleString()}`);
    } else {
      setError(null);
    }
  };

  const handleApplyCustom = () => {
    if (error || !customValue) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsApplied(true);
      const amount = parseFloat(customValue);
      onTipChange(amount, "Custom Tip", customValue);
    }, 700);
  };

  return (
    <div className={`max-w-[1400px] mx-auto px-4 md:px-6 py-6 ${outfit.className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
                      className={`${rochester.className} text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-tight`}
          >
            Choose{" "}
            <span className={`${rochester.className} text-primary`}>
              Tip Amount
            </span>
          </motion.h2>
          <p className="text-text-muted text-sm font-medium tracking-wide">Select a preset amount or enter a custom value below</p>
        </div>

        {/* Preset & Custom Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TIP_OPTIONS.map((option, idx) => {
            const Icon = option.icon;
            const isSelected = selected === option.amount;

            const colors = {
              rose: {
                bg: "bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/30",
                selectedBg: "bg-linear-to-br from-rose-500 to-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20",
                iconBg: "bg-rose-500/10 text-rose-500",
                iconSelectedBg: "bg-white/20 text-white",
                textColor: "text-rose-500",
              },
              amber: {
                bg: "bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/30",
                selectedBg: "bg-linear-to-br from-amber-500 to-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20",
                iconBg: "bg-amber-500/10 text-amber-500",
                iconSelectedBg: "bg-white/20 text-white",
                textColor: "text-amber-500",
              },
              emerald: {
                bg: "bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30",
                selectedBg: "bg-linear-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20",
                iconBg: "bg-emerald-500/10 text-emerald-500",
                iconSelectedBg: "bg-white/20 text-white",
                textColor: "text-emerald-500",
              },
              violet: {
                bg: "bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/30",
                selectedBg: "bg-linear-to-br from-violet-500 to-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20",
                iconBg: "bg-violet-500/10 text-violet-500",
                iconSelectedBg: "bg-white/20 text-white",
                textColor: "text-violet-500",
              },
            }[option.color || "rose"];

            return (
              <motion.button
                key={option.amount}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSelect(option.amount, option.label)}
                className={`relative cursor-pointer p-5 rounded-[24px] border transition-all flex flex-col items-center justify-center gap-3 text-center min-h-[160px] group ${
                  isSelected 
                  ? colors.selectedBg
                  : `bg-bg-card border-border-main ${colors.bg}`
                }`}
              >
                <div className="flex items-center justify-center transition-transform group-hover:scale-110">
                  {typeof Icon === "string" ? (
                    <img src={Icon} alt={option.label} className="w-15 h-15 object-contain" />
                  ) : (
                    <Icon size={34} className={isSelected ? "text-white" : colors.textColor} />
                  )}
                </div>
                
                <div className="space-y-0.5">
                  <p className={`text-lg font-black ${isSelected ? "text-white" : colors.textColor}`}>₹{option.amount}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-white/80" : "text-text-muted"}`}>{option.label}</p>
                </div>

                {isSelected && (
                  <motion.div 
                    layoutId="selected-tip"
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-primary shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Custom Card Option */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`relative p-5 rounded-[24px] border transition-all flex flex-col justify-between gap-3 min-h-[160px] ${
              isApplied
                ? "bg-linear-to-br from-primary to-primary-dark border-primary text-white shadow-lg shadow-primary/20"
                : customValue && !error
                  ? "bg-primary/5 border-primary/50 shadow-md"
                  : "bg-bg-card border-border-main hover:border-primary/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {isApplied ? (
                // SUCCESS STATE
                <motion.div
                  key="applied-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/70 block">Custom Tip Lock</span>
                    <p className="text-xl font-black !text-white leading-tight">₹{parseFloat(customValue).toLocaleString("en-IN")}</p>
                    <p className="text-[9px] font-medium text-white/80">Applied to booking checkout.</p>
                  </div>
                  
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-white">
                      <CheckCircle2 size={10} className="fill-white text-primary" />
                      <span>Ready</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsApplied(false);
                        onTipChange(null, "Custom Tip", "");
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-white underline underline-offset-2 hover:text-white/85 cursor-pointer bg-transparent border-none"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              ) : isVerifying ? (
                // LOADING STATE
                <motion.div
                  key="verifying-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-3 py-4"
                >
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Submitting...</span>
                </motion.div>
              ) : (
                // INPUT STATE
                <motion.div
                  key="input-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Custom Amount</span>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-base font-black text-primary">₹</span>
                      <input
                        type="number"
                        value={customValue}
                        disabled={isVerifying}
                        onChange={(e) => handleCustomChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !error && customValue) {
                            handleApplyCustom();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        placeholder="250+"
                        className={`w-full h-11 pl-7 pr-2 bg-bg-secondary/50 border rounded-xl text-text-main text-sm font-black focus:outline-none transition-all placeholder:text-text-muted/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          error ? "border-red-500/50 focus:border-red-500/80" : "border-border-main focus:border-primary/40"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-main/20 flex items-center justify-between gap-2 min-h-[30px]">
                    {error ? (
                      <span className="text-red-400 text-[8px] font-black uppercase tracking-wider leading-tight">{error}</span>
                    ) : customValue ? (
                      <button
                        onClick={handleApplyCustom}
                        className="w-full py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-primary/10 flex items-center justify-center gap-1 border-none"
                      >
                        Submit
                      </button>
                    ) : (
                      <>
                        <span className="text-text-muted text-[8px] font-bold uppercase tracking-wider">Min. ₹250</span>
                        <span className="text-[7px] text-text-muted/60 font-black uppercase tracking-widest">Secure</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



