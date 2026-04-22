"use client";

import { motion } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface CategorySwitcherProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  className?: string;
  id?: string;
}

export default function CategorySwitcher({
  activeCategory,
  setActiveCategory,
  className = "",
  id = "default",
}: CategorySwitcherProps) {
  return (
    <div className={`flex items-center ${className} ${outfit.className}`}>
      <div className="flex p-1.5 bg-white/5 backdrop-blur-3xl border border-border-main rounded-[24px] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <button
          onClick={() => setActiveCategory("hired_by_me")}
          className={`relative px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
            activeCategory === "hired_by_me"
              ? "text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          {activeCategory === "hired_by_me" && (
            <motion.div
              layoutId={`${id}-activeCategory`}
              className="absolute inset-0 bg-gradient-to-r from-primary-dark to-accent rounded-[18px]"
            />
          )}
          <span className="relative z-10">Hired by Me</span>
        </button>

        <button
          onClick={() => setActiveCategory("hired_me")}
          className={`relative px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
            activeCategory === "hired_me"
              ? "text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          {activeCategory === "hired_me" && (
            <motion.div
              layoutId={`${id}-activeCategory`}
              className="absolute inset-0 bg-gradient-to-r from-primary-dark to-accent rounded-[18px]"
            />
          )}
          <span className="relative z-10">Hired Me</span>
        </button>
      </div>
    </div>
  );
}



