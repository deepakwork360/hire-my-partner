"use client";

import Slider from "@/components/common/Slider";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import PremiumDropdown from "@/components/ui/PremiumDropdown";
import { Range } from "react-range";
import { Outfit, Rochester } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Calendar,
  ChevronDown,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PartnerService } from "@/modules/partner/services/partner.service";
import { getUserLocation } from "@/lib/location";
import { Partner } from "@/modules/partner/types/partner.types";
import { toast } from "@/components/ui/toastStore";
import ProfileCardSkeleton from "@/components/ProfileCard/ProfileCardSkeleton";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

export default function PartnersNearby() {
  const [nearbyPartners, setNearbyPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [age, setAge] = useState("");
  const [rating, setRating] = useState("");
  const [distance, setDistance] = useState("");
  const [values, setValues] = useState<number[]>([0, 100]);
  const [debouncedRadius, setDebouncedRadius] = useState<number>(100);
  const [hasCoords, setHasCoords] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>("");

  // Debounce the slider radius value to avoid API rate limiting while dragging
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRadius(values[1]);
    }, 450);
    return () => clearTimeout(handler);
  }, [values[1]]);

  // Sync coords set state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_active_location");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.useCustom || parsed.geolocated) {
            setHasCoords(true);
          }
        } catch (e) {}
      }
    }
  }, []);

  const loadNearbyPartners = useCallback(async () => {
    if (!hasCoords) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const loc = getUserLocation();
      const latitude = loc.latitude !== undefined ? loc.latitude : loc.lat;
      const longitude = loc.longitude !== undefined ? loc.longitude : loc.lng;

      const data = await PartnerService.getNearbyPartners({
        latitude,
        longitude,
        radiusKm: debouncedRadius,
        bookedHours: 2,
      });
      setNearbyPartners(data);
    } catch (e) {
      console.error("Failed to load nearby partners:", e);
    } finally {
      setLoading(false);
    }
  }, [debouncedRadius, hasCoords]);

  useEffect(() => {
    loadNearbyPartners();

    const handleUpdate = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("user_active_location");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.useCustom || parsed.geolocated) {
              setHasCoords(true);
            } else {
              setHasCoords(false);
            }
          } catch (e) {
            setHasCoords(false);
          }
        } else {
          setHasCoords(false);
        }
      }
      loadNearbyPartners();
    };

    window.addEventListener("user_location_updated", handleUpdate);
    window.addEventListener("partner_location_updated", handleUpdate);
    window.addEventListener("reviews_updated", handleUpdate);

    return () => {
      window.removeEventListener("user_location_updated", handleUpdate);
      window.removeEventListener("partner_location_updated", handleUpdate);
      window.removeEventListener("reviews_updated", handleUpdate);
    };
  }, [loadNearbyPartners]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let cityName = "My Location";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await res.json();
          cityName = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "My Location";
        } catch (e) {
          console.warn("Osm reverse geocoding failed, using fallback name", e);
        }

        const newLoc = {
          city: cityName,
          lat: latitude,
          lng: longitude,
          latitude,
          longitude,
          useCustom: true,
          geolocated: true,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("user_active_location", JSON.stringify(newLoc));
          window.dispatchEvent(new Event("user_location_updated"));
        }
        setHasCoords(true);
        toast.success(`Location set successfully to ${cityName}!`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "Failed to retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission is blocked or denied. Please reset the site location permission in your browser's address bar to allow location access and try again.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out.";
        }
        setLocationError(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Dynamic filter logic for real partners
  const filteredProfiles = nearbyPartners.filter((partner) => {
    // 1. Age Range filter (supports ranges like "20-30" or single ages like "25")
    if (age.trim()) {
      const match = age.match(/^(\d+)-(\d+)$/);
      if (match) {
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        if (partner.age < min || partner.age > max) return false;
      } else {
        const singleAge = parseInt(age, 10);
        if (!isNaN(singleAge) && partner.age !== singleAge) return false;
      }
    }

    // 2. Rating filter (minimum rating selection)
    if (rating) {
      if (partner.rating < parseFloat(rating)) return false;
    }

    // 3. Distance filter range
    if (partner.distance < values[0] || partner.distance > values[1]) return false;

    return true;
  });

  const profile = filteredProfiles.slice(0, 12).map((partner) => {
    const oneHourRate = partner.pricing?.oneHour || 499;
    const bioText = partner.bio || "";
    return {
      image: partner.image,
      hourlyRate: `₹${oneHourRate}/hr`,
      name: partner.name,
      age: partner.age,
      location: (partner.location || "Mumbai, India").split(",")[0].trim(),
      rating: partner.rating,
      bio: bioText.substring(0, 45) + (bioText.length > 45 ? "..." : ""),
      distance: partner.distance,
      tag: (() => {
        if (partner.tags && partner.tags.length > 0 && partner.tags[0]) {
          const first = partner.tags[0];
          if (first === "NA") return "NA";
          return first.startsWith("#") ? first.substring(1) : first;
        }
        const isMock = partner.id ? !isNaN(Number(partner.id)) : false;
        if (!isMock) return "NA";
        return partner.id === "1" ? "Friendly" : partner.id === "2" ? "MusicFan" : partner.id === "3" ? "Talkative" : partner.id === "4" ? "Traveler" : partner.id === "5" ? "NatureLover" : "BookLover";
      })(),
      buttonText: "View Profile",
      buttonLink: `/partners/${partner.id}`,
      showViewIcon: false,
    };
  });
  return (
    <section className="py-10 md:py-16 px-4 bg-bg-secondary overflow-visible border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <h1
            className={`${rochester.className} text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 px-4 leading-[1.2]`}
          >
            Partners <span className="text-accent">Nearby You</span>
          </h1>
          <p
          className={`${outfit.className} text-lg md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200`}
          >
            Looking for the perfect plus-one? Explore charming companions
            nearby, available for events, dinners, or casual meetups.
          </p>
        </div>

        {/* Filters Section - Glassmorphic Design */}
        <div className="relative z-50 mb-8 p-6 md:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-border-main shadow-xl shadow-primary/5 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Age Filter */}
            <PremiumDropdown
              label="Age Range"
              icon={User}
              value={age}
              onChange={setAge}
              options={[
                { value: "", label: "Any Age", icon: User },
                { value: "18-20", label: "18 - 20 Yrs", icon: User },
                { value: "20-22", label: "20 - 22 Yrs", icon: User },
                { value: "22-24", label: "22 - 24 Yrs", icon: User },
                { value: "24-26", label: "24 - 26 Yrs", icon: User },
                { value: "26-28", label: "26 - 28 Yrs", icon: User },
                { value: "28-30", label: "28 - 30 Yrs", icon: User },
                { value: "30-40", label: "30+ Yrs", icon: User },
              ]}
              className="flex-1"
              size="sm"
            />

            {/* Location Coordinates Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 ml-1">
                <MapPin size={12} className="text-primary" /> Location Coordinates
              </label>
              <button
                onClick={handleGetLocation}
                type="button"
                className={`w-full h-12 px-4 rounded-2xl border flex items-center justify-between text-sm font-medium transition-all cursor-pointer ${
                  hasCoords
                    ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                    : "bg-white/5 border-border-main text-text-main hover:bg-white/10"
                }`}
              >
                <span className="truncate">
                  {hasCoords ? `Coords: ${getUserLocation().lat.toFixed(4)}, ${getUserLocation().lng.toFixed(4)}` : "Set Coordinates"}
                </span>
                <MapPin size={16} className={hasCoords ? "text-primary animate-pulse" : "text-text-muted"} />
              </button>
            </div>

            {/* Rating Filter */}
            <PremiumDropdown
              label="Min Rating"
              icon={Star}
              value={rating}
              onChange={setRating}
              options={[
                { value: "", label: "Any Rating", icon: Star },
                { value: "4.5", label: "4.5+ Stars", icon: Star },
                { value: "4.0", label: "4.0+ Stars", icon: Star },
                { value: "3.5", label: "3.5+ Stars", icon: Star },
              ]}
              className="flex-1"
              size="sm"
            />

            {/* Distance Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-primary" /> Distance
                </label>
                <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {values[0]}km - {values[1]}km
                </span>
              </div>
              <div className="px-2 pt-6 pb-2">
                <Range
                  step={1}
                  min={0}
                  max={100}
                  values={values}
                  onChange={(vals) => {
                    const minGap = 1;
                    if (vals[1] - vals[0] < minGap) {
                      if (vals[0] !== values[0]) {
                        const newLower = Math.min(vals[0], vals[1] - minGap);
                        setValues([newLower, vals[1]]);
                      } else {
                        const newUpper = Math.max(vals[1], vals[0] + minGap);
                        setValues([vals[0], newUpper]);
                      }
                    } else {
                      setValues(vals);
                    }
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      className="w-full h-8 flex items-center cursor-pointer"
                      style={{ ...props.style }}
                    >
                      <div
                        ref={props.ref}
                        className="w-full h-1.5 rounded-full relative"
                        style={{
                          background: `linear-gradient(to right, rgba(255,255,255,0.05) ${values[0]}%, rgb(var(--primary-dark-rgb)) ${values[0]}%, rgb(var(--primary-rgb)) ${values[1]}%, rgba(255,255,255,0.05) ${values[1]}%)`,
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        {/* Glow for active area */}
                        <div
                          className="absolute h-full top-0 rounded-full"
                          style={{
                            left: `${values[0]}%`,
                            width: `${values[1] - values[0]}%`,
                            boxShadow: "0 0 10px rgba(var(--primary-rgb),0.5)",
                          }}
                        />
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props, isDragged, index }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className={`group outline-none flex items-center justify-center ${isDragged ? "z-20" : "hover:z-10 z-0"}`}
                        style={{ ...restProps.style }}
                      >
                        {/* Thumb Design */}
                        <div
                          className={`w-5 h-5 rounded-full bg-white border-[3px] border-primary flex items-center justify-center transition-all duration-200 ${isDragged ? "scale-125 shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]" : "shadow-md group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]"}`}
                        >
                          {/* Inner dot */}
                          <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                        </div>

                        {/* Tooltip */}
                        <div
                          className={`absolute -top-10 px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-lg shadow-xl pointer-events-none transition-all duration-200 flex flex-col items-center min-w-[36px] ${
                            isDragged
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                          }`}
                        >
                          {values[index]}km
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 rounded-sm" />
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Slider */}
        <div className="relative -mx-4 md:mx-0 py-8">
          <div className="px-4 md:px-12 overflow-visible">
            {!hasCoords ? (
              <div className="flex flex-col items-center justify-center p-8 md:p-16 rounded-[32px] bg-white/5 backdrop-blur-xl border border-border-main shadow-xl text-center max-w-2xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6">
                  {/* Glowing background */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
                  <div className="relative w-20 h-20 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center shadow-lg animate-pulse">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-2 tracking-tight">
                  Set Your Coordinates
                </h3>
                <p className="text-text-muted font-medium mb-8 max-w-md">
                  Please set your coordinates for finding nearby partners and measuring distance.
                </p>
                {locationError && (
                  <p className="text-red-400 text-sm font-medium mb-6 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-2xl max-w-md mx-auto">
                    {locationError}
                  </p>
                )}
                <button
                  onClick={handleGetLocation}
                  className="px-6 py-3 rounded-full bg-linear-to-br from-primary to-primary-dark text-white font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/25 cursor-pointer"
                >
                  Set Coordinates Automatically
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center py-4">
                <div className="block"><ProfileCardSkeleton /></div>
                <div className="hidden sm:block"><ProfileCardSkeleton /></div>
                <div className="hidden lg:block"><ProfileCardSkeleton /></div>
                <div className="hidden 2xl:block"><ProfileCardSkeleton /></div>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 md:p-16 rounded-[32px] bg-white/5 backdrop-blur-xl border border-border-main shadow-xl text-center max-w-2xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6">
                  {/* Glowing background */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
                  <div className="relative w-20 h-20 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center shadow-lg">
                    <Search className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-2 tracking-tight">
                  No Companions Found Nearby
                </h3>
                <p className="text-text-muted font-medium mb-8 max-w-md">
                  We couldn't find any companions matching your selected filters. Try adjusting the age, rating, or distance parameters to discover more partners.
                </p>
                <button
                  onClick={() => {
                    setAge("");
                    setRating("");
                    setValues([0, 100]);
                  }}
                  className="px-6 py-3 rounded-full bg-linear-to-br from-primary to-primary-dark text-white font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/25 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <Slider
                items={profile}
                renderItem={(item, idx) => <ProfileCard key={idx} {...item} />}
                viewAllLink="/browse-partners"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



