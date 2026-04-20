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
  ChevronUp
} from "lucide-react";

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
  const [isTimingOpen, setIsTimingOpen] = useState(false);

  const handleChange = (name: keyof FilterState, value: any) => {
    setFilters((prev) => {
      // Toggle for multi-select arrays
      if (Array.isArray(prev[name]) && typeof value === 'string') {
        const arr = prev[name] as string[];
        return {
          ...prev,
          [name]: arr.includes(value) 
            ? arr.filter(v => v !== value) 
            : [...arr, value]
        };
      }
      // Standard override
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
    <div className="flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-2xl border-r border-white/5 animate-in fade-in slide-in-from-left duration-700 relative">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white tracking-tight">Filters</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Body Container */}
      <div className="flex-1 overflow-auto relative">
        {/* Top Scroll Shadow */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-[#0a0a0a] to-transparent z-20 pointer-events-none opacity-60" />
        
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-10 pb-32 pt-4">
          {/* Age Range */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Age Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OPTIONS.ageRange.map((range) => (
                <button
                  key={range}
                  onClick={() => handleChange("age", range)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    filters.age === range 
                    ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female"].map((g) => (
                <button
                  key={g}
                  onClick={() => handleChange("gender", g)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                    filters.gender === g 
                    ? "bg-white/10 border-primary text-primary shadow-inner" 
                    : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Location Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <MapPin className="w-3.5 h-3.5" /> Location
            </label>
            <div className="relative group">
              <select
                value={filters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full h-12 pl-4 pr-10 appearance-none bg-[#111] border border-white/10 rounded-2xl text-white text-sm outline-hidden focus:border-primary transition-all cursor-pointer"
              >
                <option value="" className="bg-[#111]">Select City</option>
                {OPTIONS.locations.map(loc => <option key={loc} value={loc} className="bg-[#111]">{loc}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
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
                      ? "bg-white/10 border-primary text-primary" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 underline-offset-4"
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interests / Tags</label>
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
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
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
                      ? "bg-white/10 border-primary shadow-inner" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isActive ? "text-primary" : "text-white group-hover:text-primary/80"}`}>
                      {tier.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {tier.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/3 border border-primary/20 rounded-[24px]">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                 Verified Only <ShieldCheck className="w-4 h-4 text-blue-400" />
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Show only verified profiles</span>
            </div>
            <button 
              onClick={() => handleChange("verified", !filters.verified)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                filters.verified ? "bg-primary" : "bg-white/10"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                filters.verified ? "left-7 shadow-lg" : "left-1"
              }`} />
            </button>
          </div>

          {/* Availability Select */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Availability</label>
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
                      : "bg-white/5 border-white/10 text-slate-500"
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Star className="w-3.5 h-3.5" /> Rating
            </label>
            <div className="grid grid-cols-5 gap-2">
              {OPTIONS.ratings.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChange("rating", rate)}
                  className={`flex items-center justify-center gap-1 h-10 rounded-xl text-xs font-bold border transition-all ${
                    filters.rating === rate 
                    ? "bg-amber-500/20 border-amber-500 text-amber-500" 
                    : "bg-white/5 border-white/10 text-slate-500"
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {/* Timing Selection - PREMIUM DROPDOWN */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Clock className="w-3.5 h-3.5" /> Favorite Timing
            </label>
            
            <div className="relative">
              <button
                onClick={() => setIsTimingOpen(!isTimingOpen)}
                className={`w-full h-14 px-5 rounded-2xl bg-white/5 border transition-all flex items-center justify-between ${
                  isTimingOpen ? "border-primary/50 bg-white/10" : "border-white/10"
                }`}
              >
                <span className={`text-sm ${filters.timing ? "text-white font-bold" : "text-slate-500"}`}>
                  {filters.timing || "Select Time Range"}
                </span>
                {isTimingOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-slate-500" />}
              </button>

              <AnimatePresence>
                {isTimingOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 z-40 p-2 bg-[#0d0d0d]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="space-y-1">
                      {OPTIONS.timings.map((time) => {
                        const isActive = filters.timing === time;
                        return (
                          <button
                            key={time}
                            onClick={() => {
                              handleChange("timing", time);
                              setIsTimingOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm transition-all ${
                              isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="font-medium">{time}</span>
                            {isActive && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black/80 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Fixed Action Buttons Footer */}
      <div className="p-6 bg-[#0a0a0a] border-t border-white/5 grid grid-cols-2 gap-4 z-30">
        <button
          onClick={handleClearAll}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={handleApply}
          className="h-14 rounded-2xl bg-linear-to-r from-primary-dark to-accent text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

