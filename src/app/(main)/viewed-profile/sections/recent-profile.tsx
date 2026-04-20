"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import DiscoveryButton from "@/components/ui/DiscoveryButton";
import {
  Users,
  Eye,
  Sparkles,
  Search,
  Calendar,
  MapPin,
  Filter,
  X,
  RefreshCw,
} from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_VIEWERS = [
  {
    id: 1,
    name: "Sophia",
    age: 24,
    location: "Mumbai",
    image: "/images/img1.webp",
    rating: "4.9",
    tag: "Friendly",
    rate: "₹1500/hr",
    lastViewed: "2025-06-21",
  },
  {
    id: 2,
    name: "Emily",
    age: 22,
    location: "Delhi",
    image: "/images/img2.webp",
    rating: "4.8",
    tag: "Talkative",
    rate: "₹1800/hr",
    lastViewed: "2025-06-20",
  },
  {
    id: 3,
    name: "Olivia",
    age: 25,
    location: "Bangalore",
    image: "/images/img3.webp",
    rating: "5.0",
    tag: "BookLover",
    rate: "₹2000/hr",
    lastViewed: "2025-06-19",
  },
  {
    id: 4,
    name: "Ava",
    age: 23,
    location: "Hyderabad",
    image: "/images/img4.webp",
    rating: "4.7",
    tag: "MusicFan",
    rate: "₹1400/hr",
    lastViewed: "2025-06-18",
  },
  {
    id: 5,
    name: "Isabella",
    age: 26,
    location: "Goa",
    image: "/images/img5.webp",
    rating: "4.9",
    tag: "Traveler",
    rate: "₹2500/hr",
    lastViewed: "2025-06-17",
  },
  {
    id: 6,
    name: "Mia",
    age: 21,
    location: "Pune",
    image: "/images/img6.webp",
    rating: "4.6",
    tag: "NatureLover",
    rate: "₹1200/hr",
    lastViewed: "2025-06-16",
  },
  {
    id: 7,
    name: "Charlotte",
    age: 24,
    location: "Chennai",
    image: "/images/img7.webp",
    rating: "4.8",
    tag: "Artistic",
    rate: "₹1700/hr",
    lastViewed: "2025-06-15",
  },
  {
    id: 8,
    name: "Amelia",
    age: 23,
    location: "Kolkata",
    image: "/images/img8.webp",
    rating: "4.7",
    tag: "Chef",
    rate: "₹1600/hr",
    lastViewed: "2025-06-14",
  },
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Goa",
  "Pune",
  "Chennai",
  "Kolkata",
];

export default function RecentProfile() {
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const filteredViewers = useMemo(() => {
    return MOCK_VIEWERS.filter((viewer) => {
      // 1. Search by Name
      if (
        searchQuery &&
        !viewer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      // 2. City Selection
      if (selectedCity && viewer.location !== selectedCity) return false;

      // 3. Date Range
      if (startDate && viewer.lastViewed < startDate) return false;
      if (endDate && viewer.lastViewed > endDate) return false;

      return true;
    });
  }, [searchQuery, selectedCity, startDate, endDate]);

  const displayedProfiles = useMemo(
    () => filteredViewers.slice(0, displayCount),
    [filteredViewers, displayCount],
  );

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 3, filteredViewers.length));
      setLoading(false);
    }, 800);
  }, [filteredViewers.length]);

  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedCity("");
    setIsFilterApplied(false);
  };

  return (
    <div className={`space-y-12 ${outfit.className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-white text-xl font-black uppercase tracking-wider">
              Recent Profile Viewers
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Eye size={12} className="text-primary" />
              Explore individuals who recently interacted with your profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
            {filteredViewers.length} Matches Found
          </span>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-[28px] shadow-2xl backdrop-blur-3xl"
      >
        {/* Search Name */}
        <div className="relative group xl:col-span-1">
          <Search
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none group-focus-within:scale-110 transition-transform"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full h-14 pl-14 pr-6 bg-black/40 border border-white/10 rounded-2xl text-slate-200 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Start Date */}
        <div className="relative group xl:col-span-1">
          <Calendar
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none transition-transform group-hover:scale-110"
          />
          <div className="relative h-14">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="absolute inset-0 w-full h-full pl-14 pr-6 bg-black/40 border border-white/10 rounded-2xl text-slate-200 text-xs font-bold transition-all cursor-pointer [color-scheme:dark] opacity-0 focus:opacity-100 z-10 
                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              style={{ opacity: startDate ? 1 : 0 }}
            />
            {!startDate && (
              <div className="absolute inset-0 flex items-center pl-14 pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Start Date
                </span>
              </div>
            )}
          </div>
        </div>

        {/* End Date */}
        <div className="relative group xl:col-span-1">
          <Calendar
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none transition-transform group-hover:scale-110"
          />
          <div className="relative h-14">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="absolute inset-0 w-full h-full pl-14 pr-6 bg-black/40 border border-white/10 rounded-2xl text-slate-200 text-xs font-bold transition-all cursor-pointer [color-scheme:dark] opacity-0 focus:opacity-100 z-10 
                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              style={{ opacity: endDate ? 1 : 0 }}
            />
            {!endDate && (
              <div className="absolute inset-0 flex items-center pl-14 pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  End Date
                </span>
              </div>
            )}
          </div>
        </div>

        {/* City Select */}
        <div className="relative group xl:col-span-1">
          <MapPin
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full h-14 pl-14 pr-10 appearance-none bg-black/40 border border-white/10 rounded-2xl text-slate-200 text-xs font-bold outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="" className="bg-[#050505]">
              All Cities
            </option>
            {CITIES.map((city) => (
              <option key={city} value={city} className="bg-[#050505]">
                {city}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <Filter size={14} />
          </div>
        </div>

        {/* Reset Button */}
        <div className="xl:col-span-1">
          <button
            onClick={resetFilters}
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-white hover:bg-white/10 transition-all group font-black uppercase tracking-widest text-[10px]"
          >
            <RefreshCw
              size={14}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Profile Grid */}
      <div className="relative">
        {displayedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {displayedProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 3) * 0.1,
                    ease: [0.21, 1.11, 0.81, 0.99],
                  }}
                >
                  <ProfileCard
                    image={profile.image}
                    hourlyRate={profile.rate}
                    name={profile.name}
                    age={profile.age}
                    location={profile.location}
                    bio={`Looking for profile matching ${profile.name} at ${profile.location}. (Last Viewed: ${profile.lastViewed})`}
                    tag={profile.tag}
                    rating={profile.rating}
                    confirmation="Verified"
                    buttonText="View Profile"
                    viewLink="/partner-profile-detail"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
              <X size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-white text-xl font-bold uppercase tracking-widest">
                No Viewers Found
              </h4>
              <p className="text-slate-500 text-sm font-medium max-w-sm">
                We couldn't find any profile viewers matching your current
                filters. Try adjusting your search criteria.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="text-primary text-[10px] font-black uppercase tracking-widest underline underline-offset-8 hover:text-white transition-colors"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Discovery / Load More */}
      {displayCount < filteredViewers.length && (
        <div className="flex flex-col items-center justify-center pt-8 gap-4">
          <DiscoveryButton
            label="Show More Visitors"
            onClick={handleLoadMore}
            loading={loading}
          />
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
            Showing {displayCount} of {filteredViewers.length} active matches
          </p>
        </div>
      )}

      {displayCount >= filteredViewers.length && filteredViewers.length > 0 && (
        <div className="flex flex-col items-center justify-center pt-8">
          <div className="w-16 h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
            Viewing all available visitors
          </p>
        </div>
      )}
    </div>
  );
}
