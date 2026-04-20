"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface FilterByProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FilterBy({ activeTab, onTabChange }: FilterByProps) {
  const tabs = ["All", "Upcoming", "Past"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 ${outfit.className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Filter className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Filters</h2>
      </div>

      {/* Booking Status Tabs */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
          Booking Status
        </label>
        <div className="flex flex-col gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between group ${
                activeTab === tab
                  ? "text-white bg-white/10 shadow-lg"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/2"
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <motion.div layoutId="activeDot">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search by Name */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
          Search by Name
        </label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search partner..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* Search by Date */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
          Search by Date
        </label>
        <div className="relative group">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="date"
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/8 transition-all scheme-dark"
          />
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full group relative overflow-hidden rounded-2xl py-4 bg-linear-to-r from-primary to-primary-dark font-bold text-white text-sm tracking-wide shadow-[0_10px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.45)] active:scale-[0.98] transition-all">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
        Apply Filters
      </button>
    </motion.div>
  );
}
