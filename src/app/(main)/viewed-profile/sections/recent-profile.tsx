"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import DiscoveryButton from "@/components/ui/DiscoveryButton";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import PremiumDropdown from "@/components/ui/PremiumDropdown";
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
  };

  return (
    <div className={`space-y-12 ${outfit.className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border-main">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-text-main text-xl font-black uppercase tracking-wider">
              Recent Profile Viewers
            </h3>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Eye size={12} className="text-primary" />
              Explore individuals who recently interacted with your profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border-main shadow-sm">
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-text-main text-[10px] font-black uppercase tracking-widest">
            {filteredViewers.length} Matches Found
          </span>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 p-5 bg-bg-card border border-border-main rounded-[28px] shadow-2xl shadow-black/5 backdrop-blur-3xl"
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
            className="w-full h-14 pl-14 pr-6 bg-bg-secondary border border-border-main rounded-2xl text-text-main text-xs font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted shadow-sm"
          />
        </div>

        {/* Start Date */}
        <PremiumDatePicker
          value={startDate}
          onChange={setStartDate}
          placeholder="Start Date"
          className="xl:col-span-1"
        />

        {/* End Date */}
        <PremiumDatePicker
          value={endDate}
          onChange={setEndDate}
          placeholder="End Date"
          className="xl:col-span-1"
        />

        {/* City Select */}
        <PremiumDropdown
          icon={MapPin}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="City"
          options={CITIES.map(city => ({ value: city, label: city, icon: MapPin }))}
          className="xl:col-span-1"
        />

        {/* Reset Button */}
        <div className="xl:col-span-1">
          <button
            onClick={resetFilters}
            className="w-full h-14 bg-bg-secondary border border-border-main rounded-2xl flex items-center justify-center gap-3 text-text-muted hover:text-text-main hover:bg-bg-card transition-all group font-black uppercase tracking-widest text-[10px] shadow-sm"
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
                    showViewIcon={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.01] border border-dashed border-border-main rounded-[40px]"
          >
            <div className="w-20 h-20 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted">
              <X size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-text-main text-xl font-bold uppercase tracking-widest">
                No Viewers Found
              </h4>
              <p className="text-text-muted text-sm font-medium max-w-sm">
                We couldn't find any profile viewers matching your current
                filters. Try adjusting your search criteria.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="text-primary text-[10px] font-black uppercase tracking-widest underline underline-offset-8 hover:text-text-main transition-colors"
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
          <p className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
            Showing {displayCount} of {filteredViewers.length} active matches
          </p>
        </div>
      )}

      {displayCount >= filteredViewers.length && filteredViewers.length > 0 && (
        <div className="flex flex-col items-center justify-center pt-8">
          <div className="w-16 h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-4" />
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest italic">
            Viewing all available visitors
          </p>
        </div>
      )}
    </div>
  );
}



