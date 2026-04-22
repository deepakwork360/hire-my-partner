"use client";
import { useState, useEffect } from "react";
import { Palette, Check, RotateCcw, Sparkles, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, Theme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/toastStore";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { id: "violet", label: "Violet", color: "bg-violet-600" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
];

export default function ThemeSwitcher() {
  const { activeTheme, setTheme, isPreferenceSet, resetToRotation, appearance, toggleAppearance } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isAutoRotate = !isPreferenceSet;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-border-main text-text-main hover:bg-bg-card transition-all active:scale-95 group"
        title="Change Theme"
      >
        <Palette 
          size={20} 
          className={isAutoRotate ? "animate-pulse text-primary" : "text-text-main group-hover:rotate-12 transition-transform"} 
        />
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
              className="absolute right-0 mt-3 w-64 bg-bg-base border border-border-main rounded-3xl shadow-2xl p-4 z-50 backdrop-blur-xl"
            >
              <div className="mb-4 px-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <h3 className="text-text-main font-black text-sm tracking-tight">Luxury Themes</h3>
                    <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">
                      Select your palette
                    </p>
                  </div>
                  
                  {/* Appearance Toggle */}
                  <button
                    onClick={() => {
                      toggleAppearance();
                      setIsOpen(false);
                    }}
                    className="w-10 h-10 rounded-xl bg-bg-secondary border border-border-main flex items-center justify-center text-text-main hover:bg-bg-card transition-all active:scale-90 relative group/toggle"
                    title={appearance === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    <AnimatePresence mode="wait">
                      {appearance === "dark" ? (
                        <motion.div
                          key="moon"
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        >
                          <Moon size={18} className="text-blue-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sun"
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        >
                          <Sun size={18} className="text-amber-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition-all group ${
                      activeTheme === t.id && isPreferenceSet
                        ? "bg-primary/10 border border-primary/20 shadow-lg"
                        : "hover:bg-bg-secondary border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${t.color} shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)] group-hover:scale-110 transition-transform`} />
                      <span className={`text-sm font-bold ${activeTheme === t.id && isPreferenceSet ? "text-text-main" : "text-text-muted group-hover:text-text-main"}`}>
                        {t.label}
                      </span>
                    </div>
                    {activeTheme === t.id && isPreferenceSet && (
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-primary" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}

                <div className="h-px bg-border-main my-2" />

                <button
                  onClick={() => {
                    resetToRotation();
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all relative overflow-hidden group ${
                    isAutoRotate
                      ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "bg-bg-secondary border border-border-main hover:bg-bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isAutoRotate ? "bg-emerald-500/20" : "bg-bg-base/40"}`}>
                      <RotateCcw 
                        size={16} 
                        className={`${isAutoRotate ? "text-emerald-400 animate-spin" : "text-text-muted group-hover:rotate-180"} transition-all duration-700`} 
                        style={isAutoRotate ? { animationDuration: '4s' } : {}} 
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${isAutoRotate ? "text-emerald-400" : "text-white"}`}>
                          Auto-Rotate
                        </span>
                        {isAutoRotate && <Sparkles size={10} className="text-emerald-400 animate-pulse" />}
                      </div>
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                        Fresh theme per visit
                      </span>
                    </div>
                  </div>
                  
                  {isAutoRotate && (
                    <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Active</span>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
