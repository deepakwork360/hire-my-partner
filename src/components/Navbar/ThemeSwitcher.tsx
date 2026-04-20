"use client";

import { useState, useEffect } from "react";
import { Palette, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, ThemeType } from "@/context/ThemeContext";

const themes: { id: ThemeType; label: string; color: string }[] = [
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { id: "violet", label: "Violet", color: "bg-violet-600" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme, isAutoRotate, setAutoRotate } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
        title="Change Theme"
      >
        <Palette size={20} className={isAutoRotate ? "animate-pulse text-primary" : "text-white"} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-64 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-4 z-50 backdrop-blur-xl"
            >
              <div className="mb-4 px-2">
                <h3 className="text-white font-bold text-sm">Luxury Themes</h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">
                  Select a curated palette
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      theme === t.id && !isAutoRotate
                        ? "bg-white/5 border border-white/10"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${t.color} shadow-lg`} />
                      <span className="text-sm font-medium text-slate-200">{t.label}</span>
                    </div>
                    {theme === t.id && !isAutoRotate && (
                      <Check size={14} className="text-primary" />
                    )}
                  </button>
                ))}

                <div className="h-px bg-white/5 my-2" />

                <button
                  onClick={() => {
                    setAutoRotate(true);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isAutoRotate
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <RotateCcw size={16} className={isAutoRotate ? "animate-spin-slow text-primary" : "text-slate-400"} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-white block">Auto-Rotate</span>
                      <span className="text-[10px] text-slate-500">Rotate on new session</span>
                    </div>
                  </div>
                  {isAutoRotate && <Check size={14} className="text-primary" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
