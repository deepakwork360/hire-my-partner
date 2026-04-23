"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Filter, ChevronRight, X, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Outfit } from "next/font/google";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface FilterByProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

export default function FilterBy({ activeTab, onTabChange, onClose }: FilterByProps) {
  const tabs = ["All", "Upcoming", "Past"];
  const [localTab, setLocalTab] = useState(activeTab);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const handleReset = () => {
    setLocalTab("All");
    setSearchName("");
    setSearchDate("");
    onTabChange("All");
  };

  const handleApply = () => {
    onTabChange(localTab);
    if (onClose) onClose();
  };

  return (
    <div className={`flex flex-col h-full bg-bg-secondary/40 backdrop-blur-2xl animate-in fade-in slide-in-from-left duration-700 relative ${outfit.className}`}>
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 lg:p-8 border-b border-border-main bg-bg-secondary/60 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Filter className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-text-main tracking-tight">Filters</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg-card rounded-full text-text-muted hover:text-text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar">
        {/* Booking Status Tabs */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black">
            Booking Status
          </label>
          <div className="flex flex-col gap-2 p-1.5 bg-bg-card rounded-2xl border border-border-main">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setLocalTab(tab)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between group ${
                  localTab === tab
                    ? "text-text-main bg-primary/10 shadow-sm"
                    : "text-text-muted hover:text-text-main hover:bg-bg-secondary"
                }`}
              >
                <span>{tab}</span>
                {localTab === tab && (
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
        <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black">
          Search by Name
        </label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search partner..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full h-14 bg-bg-base border border-border-main rounded-2xl pl-11 pr-4 text-sm text-text-main shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-bg-secondary transition-all"
            />
          </div>
      </div>

      {/* Search by Date */}
      <PremiumDatePicker
        label="Search by Date"
        value={searchDate}
        onChange={setSearchDate}
        placeholder="Choose a date"
      />
      </div>

      {/* Fixed Action Buttons Footer */}
      <div className="p-6 lg:p-8 bg-bg-secondary border-t border-border-main grid grid-cols-2 gap-4 z-30">
        <button
          onClick={handleReset}
          className="flex cursor-pointer items-center justify-center gap-2 h-14 rounded-2xl bg-bg-card border border-border-main text-text-main font-bold hover:bg-bg-secondary transition-all group"
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Reset</span>
        </button>
        <button 
          onClick={handleApply}
          className="h-14 cursor-pointer rounded-2xl bg-linear-to-r from-primary to-primary-dark font-bold text-white text-sm tracking-wide shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}



