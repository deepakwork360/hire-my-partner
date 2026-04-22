"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronDown, 
  MapPin, 
  Filter, 
  Check, 
  Star, 
  Clock, 
  Languages, 
  Users,
  ShieldCheck,
  RefreshCcw,
  IndianRupee,
} from "lucide-react";
import PremiumDropdown from "@/components/ui/PremiumDropdown";

interface FilterState {
  age: string;
  gender: string;
  location: string;
  language: string[];
  tags: string[];
  priceRange: [number, number];
  availability: string[];
  timing: string;
  rating: string;
  verified: boolean;
}

const initialFilters: FilterState = {
  age: "",
  gender: "",
  location: "",
  language: [],
  tags: [],
  priceRange: [500, 10000],
  availability: [],
  timing: "",
  rating: "",
  verified: false,
};

const OPTIONS = {
  ageRange: ["18-25", "25-30", "30-40", "40+"],
  locations: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Goa"],
  languages: ["English", "Hindi"],
  tags: ["Friendly", "BookLover", "Talkative", "MusicFan"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  timings: ["10 AM - 01 PM", "01 PM - 04 PM", "04 PM - 07 PM", "07 PM - 10 PM"],
  ratings: ["1+", "2+", "3+", "4+", "5"],
};

export default function FilterBy({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleChange = (name: keyof FilterState, value: any) => {
    setFilters((prev) => {
      if (Array.isArray(prev[name]) && typeof value === 'string') {
        const arr = prev[name] as string[];
        return {
          ...prev,
          [name]: arr.includes(value) 
            ? arr.filter(v => v !== value) 
            : [...arr, value]
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleClearAll = () => {
    setFilters(initialFilters);
    router.push("/browse-partners");
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === "priceRange") {
          const [min, max] = value as [number, number];
          params.append("priceMin", min.toString());
          params.append("priceMax", max.toString());
        } else if (Array.isArray(value)) {
          if (value.length > 0) params.append(key, value.join(","));
        } else if (typeof value === "boolean") {
          if (value) params.append(key, "true");
        } else {
          params.append(key, value.toString());
        }
      }
    });

    router.push(`/browse-partners?${params.toString()}`, { scroll: false });
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary/40 backdrop-blur-2xl border-r border-border-main animate-in fade-in slide-in-from-left duration-700 relative">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-main bg-bg-secondary/60 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-text-main tracking-tight">Filters</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-bg-card rounded-full text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Body Container */}
      <div className="flex-1 overflow-auto relative">
        {/* Top Scroll Shadow */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-bg-base to-transparent z-20 pointer-events-none opacity-60" />
        
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-10 pb-32 pt-4">
          {/* Age Range */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Age Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OPTIONS.ageRange.map((range) => (
                <button
                  key={range}
                  onClick={() => handleChange("age", range)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    filters.age === range 
                    ? "bg-primary border-primary text-white shadow-lg" 
                    : "bg-bg-card border-border-main text-text-muted hover:border-primary/50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female"].map((g) => (
                <button
                  key={g}
                  onClick={() => handleChange("gender", g)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                    filters.gender === g 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-bg-card border-border-main text-text-muted"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Location Select */}
          <PremiumDropdown
            label="Location"
            icon={MapPin}
            value={filters.location}
            onChange={(val) => handleChange("location", val)}
            placeholder="Select City"
            options={OPTIONS.locations.map(loc => ({ value: loc, label: loc, icon: MapPin }))}
          />

          {/* Language Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
               <Languages className="w-3.5 h-3.5" /> Language
            </label>
            <div className="flex flex-wrap gap-2">
              {OPTIONS.languages.map((lang) => {
                const isActive = filters.language.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => handleChange("language", lang)}
                    className={`px-6 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isActive 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-bg-card border-border-main text-text-muted hover:bg-bg-secondary"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Logic (Multi-select) */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Interests / Tags</label>
            <div className="flex flex-wrap gap-2">
              {OPTIONS.tags.map((tag) => {
                const isActive = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleChange("tags", tag)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isActive 
                      ? "bg-linear-to-r from-primary-dark to-accent border-none text-white shadow-lg" 
                      : "bg-bg-card border-border-main text-text-muted hover:bg-bg-secondary"
                    }`}
                  >
                    {isActive && <Check size={12} />}
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Brackets - REBUILT UI */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <IndianRupee className="w-3.5 h-3.5" /> Price Level
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Budget", range: [0, 1000], desc: "Under ₹1K" },
                { label: "Standard", range: [1000, 3000], desc: "₹1K - ₹3K" },
                { label: "Premium", range: [3000, 7000], desc: "₹3K - ₹7K" },
                { label: "Luxury", range: [7000, 15000], desc: "₹7K+" },
              ].map((tier) => {
                const isActive = filters.priceRange[0] === tier.range[0] && filters.priceRange[1] === tier.range[1];
                return (
                  <button
                    key={tier.label}
                    onClick={() => handleChange("priceRange", tier.range)}
                    className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left group ${
                      isActive 
                      ? "bg-primary/10 border-primary shadow-sm" 
                      : "bg-bg-card border-border-main hover:border-primary/30"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isActive ? "text-primary" : "text-text-main group-hover:text-primary/80"}`}>
                      {tier.label}
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      {tier.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-card border border-border-main rounded-[24px]">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main flex items-center gap-2">
                 Verified Only <ShieldCheck className="w-4 h-4 text-blue-500" />
              </span>
              <span className="text-[10px] text-text-muted mt-0.5">Show only verified profiles</span>
            </div>
            <button 
              onClick={() => handleChange("verified", !filters.verified)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner ${
                filters.verified ? "bg-primary shadow-primary/30" : "bg-slate-600 dark:bg-slate-800 shadow-black/5"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                filters.verified ? "left-7 shadow-[0_4px_12px_rgba(var(--primary-rgb),0.5)] scale-110" : "left-1 shadow-md shadow-black/10"
              }`} />
            </button>
          </div>

          {/* Availability Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Availability</label>
            <div className="grid grid-cols-4 gap-2">
              {OPTIONS.days.map((day) => {
                const isActive = filters.availability.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleChange("availability", day)}
                    className={`h-10 rounded-lg text-[10px] font-bold border transition-all ${
                      isActive 
                      ? "bg-primary border-primary text-white" 
                      : "bg-bg-card border-border-main text-text-muted hover:border-primary/30"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
               <Star className="w-3.5 h-3.5" /> Rating
            </label>
            <div className="grid grid-cols-5 gap-2">
              {OPTIONS.ratings.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChange("rating", rate)}
                  className={`flex items-center justify-center gap-1 h-10 rounded-xl text-xs font-bold border transition-all ${
                    filters.rating === rate 
                    ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-500" 
                    : "bg-bg-card border-border-main text-text-muted hover:border-amber-500/50"
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Selection - PREMIUM DROPDOWN */}
          <PremiumDropdown
            label="Favorite Timing"
            icon={Clock}
            value={filters.timing}
            onChange={(val) => handleChange("timing", val)}
            placeholder="Select Time Range"
            options={OPTIONS.timings.map(t => ({ value: t, label: t, icon: Clock }))}
          />
        </div>

        {/* Bottom Scroll Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-bg-base/80 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Fixed Action Buttons Footer */}
      <div className="p-6 bg-bg-secondary border-t border-border-main grid grid-cols-2 gap-4 z-30">
        <button
          onClick={handleClearAll}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-bg-card border border-border-main text-text-main font-bold hover:bg-bg-secondary transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={handleApply}
          className="h-14 rounded-2xl bg-linear-to-r from-primary-dark to-accent text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          Apply
        </button>
      </div>
    </div>
  );
}



