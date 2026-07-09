"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface PremiumDurationPickerProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  options?: number[];
  placeholder?: string;
}

export default function PremiumDurationPicker({
  value,
  onChange,
  label,
  options = [0.01, 1, 2, 3, 4, 5, 8, 10, 12, 24],
  placeholder = "Select Duration",
}: PremiumDurationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 w-full ${outfit.className} ${isOpen ? "z-[9999]" : "z-auto"}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full cursor-pointer min-h-[58px] py-4 pl-5 pr-12 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group/btn border border-solid shadow-sm select-none outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-4 ${
            isOpen
              ? "bg-bg-base border-primary/60 ring-primary/20"
              : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus:border-primary/60 focus:ring-primary/20"
          }`}
        >
          <Clock 
            size={18} 
            className={`transition-colors duration-300 ${isOpen || value ? "text-primary" : "text-text-muted group-hover/btn:text-primary"}`} 
          />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 text-primary/60">
              Duration
            </span>
            <span className="text-xs font-bold text-text-main">
              {value === 0.01 ? "1 Minute" : `${value} ${value === 1 ? "Hour" : "Hours"}`}
            </span>
          </div>

          <ChevronRight 
            size={16} 
            className={`absolute right-5 transition-transform duration-500 text-text-muted ${isOpen ? "rotate-90 text-primary" : ""}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-[100] top-full mt-3 w-full bg-bg-secondary border border-border-main rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-3">
                <div className="space-y-1">
                  {options.map((opt) => {
                    const isSelected = value === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          onChange(opt);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-primary text-white" 
                            : "text-text-muted hover:bg-bg-card hover:text-text-main"
                        }`}
                      >
                        {opt === 0.01 ? "1 Minute" : `${opt} ${opt === 1 ? "Hour" : "Hours"}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
