"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface Option {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface PremiumDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function PremiumDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  icon: Icon,
  className = "",
}: PremiumDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
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
    <div ref={containerRef} className={`relative flex flex-col gap-2 ${outfit.className} ${className} ${isOpen ? "z-10000" : "z-auto"}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* The Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-14 pl-5 pr-12 rounded-2xl text-left transition-all duration-300 flex items-center gap-3 group/btn border border-border-main bg-bg-secondary shadow-sm ${
            isOpen ? "border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" : "hover:border-primary/30"
          }`}
        >
          {Icon && (
            <Icon 
              size={18} 
              className={`transition-colors duration-300 ${isOpen ? "text-primary" : "text-text-muted group-hover/btn:text-primary"}`} 
            />
          )}
          
          <span className={`text-xs font-bold truncate ${selectedOption ? "text-text-main" : "text-text-muted"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown 
            size={16} 
            className={`absolute right-5 transition-transform duration-500 text-text-muted ${isOpen ? "rotate-180 text-primary" : ""}`} 
          />
        </button>

        {/* Ambient Glow behind trigger */}
        <div className={`absolute -inset-1 bg-primary/5 blur-xl rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none ${isOpen ? "opacity-100" : ""}`} />

        {/* The Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute z-9999 top-full mt-3 w-full bg-bg-secondary border border-border-main rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl overflow-hidden p-2"
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option, idx) => {
                  const isSelected = option.value === value;
                  const OptionIcon = option.icon;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full h-11 px-4 rounded-xl flex items-center gap-3 transition-all duration-200 group/opt ${
                        isSelected 
                        ? "bg-primary text-white" 
                        : "text-text-muted hover:bg-bg-card hover:text-text-main"
                      }`}
                    >
                      {OptionIcon && (
                        <OptionIcon size={14} className={isSelected ? "text-white" : "text-slate-500 group-hover/opt:text-primary"} />
                      )}
                      <span className="text-xs font-bold tracking-wide">
                        {option.label}
                      </span>
                      
                      {isSelected && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" 
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
