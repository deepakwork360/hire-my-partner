"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import { Star, Flame, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import DiscoveryButton from "@/components/ui/DiscoveryButton";

interface ProfileData {
  id: number;
  image: string;
  hourlyRate: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  tag: string;
  rating: string;
  confirmation: string;
  viewLink: string;
}

const MOCK_TAGS = [
  "Friendly",
  "BookLover",
  "Talkative",
  "MusicFan",
  "Traveler",
  "NatureLover",
];
const MOCK_LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Goa"];
const MOCK_IMAGES = [
  "/images/img1.webp",
  "/images/img2.webp",
  "/images/img3.webp",
  "/images/img4.webp",
  "/images/img5.webp",
  "/images/img6.webp",
  "/images/img7.webp",
  "/images/img8.webp",
];

const generateMockProfiles = (
  startIndex: number,
  count: number,
): ProfileData[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = startIndex + i;
    return {
      id,
      image: MOCK_IMAGES[id % MOCK_IMAGES.length],
      hourlyRate: `₹${Math.floor(Math.random() * 3000) + 1000}/hr`,
      name: ["Emily", "Sophia", "Olivia", "Ava", "Isabella"][id % 5],
      age: Math.floor(Math.random() * 12) + 18,
      location: MOCK_LOCATIONS[id % MOCK_LOCATIONS.length],
      bio: "I am a friendly and outgoing person who loves to meet new people and explore new places.",
      tag: MOCK_TAGS[id % MOCK_TAGS.length],
      rating: (Math.random() * 2 + 3).toFixed(1),
      confirmation: "Verified",
      viewLink: "/partner-profile-detail",
    };
  });
};

export default function ProfilePart() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [sortBy, setSortBy] = useState<"top-rated" | "popular">("popular");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const loadMoreProfiles = useCallback((isInitial = false) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    // Simulate API delay
    const delay = isInitial ? 0 : 800; // instant for first load
    setTimeout(() => {
      setProfiles((prev) => {
        const count = isInitial ? 12 : 8; // load 12 initially, then 8 more as requested
        const newProfiles = generateMockProfiles(prev.length, count);
        return [...prev, ...newProfiles];
      });
      setLoading(false);
      loadingRef.current = false;
    }, delay);
  }, []);

  // Reset profiles and handle initial load when filters change
  useEffect(() => {
    setProfiles([]);
    setHasMore(true);
    // Trigger initial load
    loadMoreProfiles(true);

    // Smooth scroll to top of profiles section on filter change
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams, loadMoreProfiles]);

  const sortedProfiles = [...profiles]
    .filter((profile) => {
      const ageParam = searchParams.get("age");
      const locationParam =
        searchParams.get("location") || searchParams.get("city");
      const ratingParam = searchParams.get("rating");
      const genderParam = searchParams.get("gender");
      const priceMinParam = searchParams.get("priceMin");
      const priceMaxParam = searchParams.get("priceMax");

      // Age range filter
      if (ageParam) {
        if (ageParam === "18-25" && (profile.age < 18 || profile.age > 25))
          return false;
        if (ageParam === "25-30" && (profile.age < 25 || profile.age > 30))
          return false;
        if (ageParam === "30-40" && (profile.age < 30 || profile.age > 40))
          return false;
        if (ageParam === "40+" && profile.age < 40) return false;
      }

      // Location filter (case insensitive)
      if (
        locationParam &&
        !profile.location.toLowerCase().includes(locationParam.toLowerCase())
      ) {
        return false;
      }

      // Rating filter
      if (ratingParam) {
        const minRating = parseFloat(ratingParam);
        if (parseFloat(profile.rating) < minRating) return false;
      }

      // Gender filter
      if (
        genderParam &&
        profile.name.toLowerCase() !==
          (genderParam.toLowerCase() === "female" ? "sophia" : "emily")
      ) {
        // Simple mock gender mapping based on name for now
        const isFemale = [
          "Emily",
          "Sophia",
          "Olivia",
          "Ava",
          "Isabella",
        ].includes(profile.name);
        if (genderParam.toLowerCase() === "female" && !isFemale) return false;
        if (genderParam.toLowerCase() === "male" && isFemale) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "top-rated") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      return a.id - b.id; // Corrected: Ascending ID ensures new items append to the bottom
    });

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Sorting Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex w-full sm:w-auto p-1 bg-black/40 rounded-xl">
          <button
            onClick={() => setSortBy("popular")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              sortBy === "popular"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame size={16} />
            Most Popular
          </button>
          <button
            onClick={() => setSortBy("top-rated")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              sortBy === "top-rated"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Star size={16} />
            Top Rated
          </button>
        </div>
        <div className="text-xs text-slate-500 font-medium px-4">
          Showing {sortedProfiles.length} results
        </div>
      </div>

      {/* Grid Area */}
      {sortedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: (index % 8) * 0.1, // Staggered entry for the current batch
                ease: "easeOut",
              }}
            >
              <ProfileCard
                image={profile.image}
                hourlyRate={profile.hourlyRate}
                name={profile.name}
                age={profile.age}
                location={profile.location}
                bio={profile.bio}
                tag={profile.tag}
                rating={profile.rating}
                confirmation={profile.confirmation}
                buttonText="View Profile"
                viewLink={profile.viewLink}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-white/5 rounded-[40px] border border-dashed border-white/10"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Star className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold text-white">No Profiles Found</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            We couldn't find any partners matching your current filters. Try
            adjusting your preferences.
          </p>
        </motion.div>
      )}

      {/* Loading & Pagination */}
      <div className="py-12 flex flex-col items-center justify-center space-y-8">
        {hasMore && (
          <div className="flex flex-col items-center gap-6">
            <DiscoveryButton
              label="Load More Partners"
              onClick={() => loadMoreProfiles(false)}
              loading={loading}
            />
            {!loading && profiles.length > 0 && (
              <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
                Showing {profiles.length} profiles
              </p>
            )}
          </div>
        )}

        {!hasMore && profiles.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-1 rounded-full bg-white/5" />
            <p className="text-slate-500 text-sm italic">
              You've reached the end of the list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
