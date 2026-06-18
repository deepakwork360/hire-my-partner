"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import ProfileCardSkeleton from "@/components/ProfileCard/ProfileCardSkeleton";
import { Star, Flame, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import DiscoveryButton from "@/components/ui/DiscoveryButton";
import { usePartners } from "@/modules/partner/hooks/usePartners";

interface ProfileData {
  id: number | string;
  image: string;
  hourlyRate: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  distance?: number;
  bio: string;
  tag: string;
  rating: number;
  confirmation: string;
  viewLink: string;
}

export default function ProfilePart({ isSidebarOpen }: { isSidebarOpen?: boolean }) {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<"top-rated" | "popular">("popular");
  const [loading, setLoading] = useState(false);

  // Fetch partners asynchronously using our custom hook
  const { partners: fetchedPartners, loading: apiLoading, error: apiError } = usePartners();

  // Convert fetched partners to ProfileData dynamically inside the component
  const dbProfiles = useMemo((): ProfileData[] => {
    return fetchedPartners.map((p) => {
      const oneHourRate = p.pricing?.oneHour || 499;
      return {
        id: p.id,
        image: p.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256",
        hourlyRate: `₹${oneHourRate}/hr`,
        name: p.name || "Anonymous",
        age: p.age || 22,
        gender: p.gender || "Select Gender",
        location: (p.location || "Mumbai, India").split(",")[0].trim(),
        distance: p.distance,
        bio: p.bio || "",
        tag: (() => {
          if (p.tags && p.tags.length > 0 && p.tags[0]) {
            const first = p.tags[0];
            if (first === "NA") return "NA";
            return first.startsWith("#") ? first.substring(1) : first;
          }
          const isMock = p.id ? !isNaN(Number(p.id)) : false;
          if (!isMock) return "NA";
          return p.id === "1" ? "Friendly" : p.id === "2" ? "MusicFan" : p.id === "3" ? "Talkative" : p.id === "4" ? "Traveler" : p.id === "5" ? "NatureLover" : "BookLover";
        })(),
        rating: p.rating || 4.9,
        confirmation: p.verified ? "Verified" : "",
        viewLink: `/partners/${p.id}`,
      };
    });
  }, [fetchedPartners]);

  // Synchronously track search parameters to reset pagination during the render phase
  const searchParamsStr = searchParams.toString();
  const [prevParams, setPrevParams] = useState(searchParamsStr);
  const [visibleCount, setVisibleCount] = useState(12);

  if (searchParamsStr !== prevParams) {
    setPrevParams(searchParamsStr);
    setVisibleCount(12);
  }

  // Standardized Grid Classes (3 on laptop, 4 on monitor)
  const gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  const filterProfile = useCallback((profile: ProfileData) => {
    const ageParam = searchParams.get("age");
    const locationParam = searchParams.get("location") || searchParams.get("city");
    const ratingParam = searchParams.get("rating");
    const genderParam = searchParams.get("gender");
    const verifiedParam = searchParams.get("verified");
    const tagsParam = searchParams.get("tags");
    const priceMinParam = searchParams.get("priceMin");
    const priceMaxParam = searchParams.get("priceMax");

    if (ageParam) {
      const match = ageParam.match(/^(\d+)-(\d+)$/);
      if (match) {
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        if (profile.age < min || profile.age > max) return false;
      } else if (ageParam.endsWith("+")) {
        const min = parseInt(ageParam.replace("+", ""), 10);
        if (!isNaN(min) && profile.age < min) return false;
      } else {
        const singleAge = parseInt(ageParam, 10);
        if (!isNaN(singleAge) && profile.age !== singleAge) return false;
      }
    }

    if (locationParam && !profile.location.toLowerCase().includes(locationParam.toLowerCase())) return false;

    if (ratingParam) {
      const minRating = parseFloat(ratingParam);
      if (profile.rating < minRating) return false;
    }

    if (genderParam) {
      const targetGender = genderParam.toLowerCase();
      const profileGender = profile.gender.toLowerCase();
      if (targetGender !== profileGender) return false;
    }

    if (verifiedParam === "true") {
      if (profile.confirmation !== "Verified") return false;
    }

    const hourlyRateNum = parseInt(profile.hourlyRate.replace(/[^0-9]/g, ""), 10);
    if (priceMinParam) {
      const priceMin = parseInt(priceMinParam, 10);
      if (!isNaN(priceMin) && hourlyRateNum < priceMin) return false;
    }
    if (priceMaxParam) {
      const priceMax = parseInt(priceMaxParam, 10);
      if (!isNaN(priceMax) && hourlyRateNum > priceMax) return false;
    }

    if (tagsParam) {
      const tagsList = tagsParam.split(",").map(t => t.trim().toLowerCase());
      if (tagsList.length > 0) {
        const profileTag = profile.tag.toLowerCase();
        if (!tagsList.includes(profileTag)) return false;
      }
    }

    return true;
  }, [searchParams]);

  // Compute all matching profiles and sort them synchronously
  const allMatchingProfiles = useMemo(() => {
    const filtered = dbProfiles.filter(filterProfile);
    return filtered.sort((a, b) => {
      if (sortBy === "top-rated") {
        return b.rating - a.rating;
      }
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
  }, [dbProfiles, filterProfile, sortBy]);

  // Take the slice currently visible to the user
  const displayedProfiles = useMemo(() => {
    return allMatchingProfiles.slice(0, visibleCount);
  }, [allMatchingProfiles, visibleCount]);

  const hasMore = visibleCount < allMatchingProfiles.length;

  const loadMoreProfiles = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 24);
      setLoading(false);
    }, 800);
  }, [loading]);

  return (
    <div className="space-y-8">
      {/* Sorting Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-bg-card rounded-2xl border border-border-main">
        <div className="flex w-full sm:w-auto p-1 bg-bg-secondary rounded-xl">
          <button
            onClick={() => setSortBy("popular")}
            className={`flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              sortBy === "popular"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Flame size={16} />
            Most Popular
          </button>
          <button
            onClick={() => setSortBy("top-rated")}
            className={`flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              sortBy === "top-rated"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Star size={16} />
            Top Rated
          </button>
        </div>
        <div className="text-xs text-text-muted font-medium px-4">
          Showing {displayedProfiles.length} results
        </div>
      </div>

      {/* Grid Area */}
      {apiLoading ? (
        <div className={`grid ${gridClasses} gap-6 justify-items-center py-4`}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProfileCardSkeleton key={idx} />
          ))}
        </div>
      ) : apiError ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-bg-card rounded-[40px] border border-dashed border-red-500/20">
          <p className="text-red-400 text-sm">Failed to load profiles: {apiError.message}</p>
        </div>
      ) : displayedProfiles.length > 0 ? (
        <div className={`grid ${gridClasses} gap-6 justify-items-center`}>
          {displayedProfiles.map((profile, index) => (
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
                id={profile.id}
                image={profile.image}
                hourlyRate={profile.hourlyRate}
                name={profile.name}
                age={profile.age}
                location={profile.location}
                distance={profile.distance}
                bio={profile.bio}
                tag={profile.tag}
                rating={profile.rating}
                confirmation={profile.confirmation}
                buttonText="Book Now"
                buttonLink={`/partners/${profile.id}#booking-section`}
                viewLink={profile.viewLink}
                showViewIcon={true}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-bg-card rounded-[40px] border border-dashed border-border-main"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Star className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold text-text-main">No Profiles Found</h3>
          <p className="text-text-muted max-w-xs mx-auto text-sm">
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
              onClick={loadMoreProfiles}
              loading={loading}
            />
            {!loading && displayedProfiles.length > 0 && (
              <p className="text-text-muted text-xs font-medium tracking-widest uppercase">
                Showing {displayedProfiles.length} profiles
              </p>
            )}
          </div>
        )}

        {!hasMore && displayedProfiles.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-1 rounded-full bg-white/5" />
            <p className="text-text-muted text-sm italic">
              You've reached the end of the list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



