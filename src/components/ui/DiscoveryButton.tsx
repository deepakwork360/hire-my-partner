"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";
import React from "react";
import { Loader2, Plus } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

interface DiscoveryButtonProps {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export default function DiscoveryButton({
  label,
  onClick,
  loading = false,
  className = "",
}: DiscoveryButtonProps) {
  return (
    <div className={`relative group ${outfit.className} ${className}`}>
      {/* 1. Pulsing Aura Backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      {/* 2. Rotating Border Container */}
      <div className="relative p-[1px] rounded-full overflow-hidden bg-white/10 group-hover:bg-transparent transition-colors duration-500">
        {/* Animated Conic Gradient Border */}
        <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_240deg,rgb(var(--primary-rgb))_270deg,rgb(var(--primary-dark-rgb))_300deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 3. Main Button Surface (Glassmorphism) */}
        <button
          onClick={onClick}
          disabled={loading}
          className={`
            relative 
            flex items-center justify-center gap-4
            px-12 py-5 
            bg-[#0E0E10]/90 backdrop-blur-xl
            rounded-full 
            text-white 
            transition-all duration-500
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
            hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {/* Inner Gloss */}
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Scanning Beam (Loading State Only) */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent skew-x-12 z-0"
              />
            )}
          </AnimatePresence>

          {/* Label & Icon Content */}
          <div className="relative z-10 flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <div className="p-1 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Plus className="w-4 h-4" />
              </div>
            )}
            <span className="text-sm font-bold tracking-[0.2em] uppercase">
              {loading ? "Scanning Universe..." : label}
            </span>
          </div>

          {/* Subtle Corner Glow */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-accent/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </button>
      </div>
    </div>
  );
}
