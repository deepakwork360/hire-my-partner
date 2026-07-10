"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Send,
  Mail,
  ArrowRight,
  User,
  ChevronDown,
  MapPin,
  Locate,
  Search,
  Compass,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PremiumButton from "../ui/PremiumButton";
import { useTheme } from "@/context/ThemeContext";
import ThemeLogo from "@/components/ui/ThemeLogo";
import { useAuthStore } from "@/modules/auth/store";
import { getUserLocation, setUserLocation, resolveCoordinates } from "@/lib/location";
import { toast } from "@/components/ui/toastStore";


const countriesList = [
  { name: "India", code: "IN" },
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Singapore", code: "SG" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Japan", code: "JP" },
  { name: "Malaysia", code: "MY" },
  { name: "Nepal", code: "NP" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Bangladesh", code: "BD" },
  { name: "Thailand", code: "TH" },
  { name: "South Africa", code: "ZA" },
  { name: "New Zealand", code: "NZ" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Netherlands", code: "NL" },
  { name: "Switzerland", code: "CH" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Safety and Trust", href: "/#safety-and-trust" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { activeTheme } = useTheme();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [activeLocationName, setActiveLocationName] = useState("Mumbai");
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ name: "India", code: "IN" });
  const [countryQuery, setCountryQuery] = useState("India");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateLocation = (
    cityName: string,
    latVal?: number,
    lngVal?: number,
    useCustom?: boolean,
    stateVal?: string,
    countryVal?: string
  ) => {
    try {
      let resolvedLat = latVal;
      let resolvedLng = lngVal;

      if (resolvedLat === undefined || resolvedLng === undefined) {
        const coords = resolveCoordinates(cityName);
        resolvedLat = coords.lat;
        resolvedLng = coords.lng;
      }

      const justCityName = cityName.includes(",") ? cityName.split(",")[0].trim() : cityName;
      const justCountryName = cityName.includes(",") ? cityName.split(",")[1].trim() : (countryVal || "India");

      // 1. Update active user browsing location
      setUserLocation({
        city: cityName,
        lat: resolvedLat,
        lng: resolvedLng,
        useCustom,
        latitude: resolvedLat,
        longitude: resolvedLng,
        state: stateVal || justCityName,
        country: justCountryName
      });

      setActiveLocationName(cityName);

      // 2. If it's a verified live partner, update their profile too!
      const storageKey = user?.email 
        ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` 
        : "partnerApplication";
      let isLivePartner = false;
      try {
        const savedApp = localStorage.getItem(storageKey);
        if (savedApp) {
          const parsed = JSON.parse(savedApp);
          if (parsed.verificationStatus === "VERIFIED" && parsed.formData) {
            isLivePartner = true;
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (isLivePartner) {
        const savedApp = localStorage.getItem(storageKey);
        if (savedApp) {
          const parsed = JSON.parse(savedApp);
          if (!parsed.formData) parsed.formData = {};
          parsed.formData.city = justCityName;
          parsed.formData.location = cityName;
          parsed.formData.lat = resolvedLat;
          parsed.formData.lng = resolvedLng;
          parsed.formData.latitude = resolvedLat;
          parsed.formData.longitude = resolvedLng;
          parsed.formData.state = stateVal || justCityName;
          parsed.formData.country = justCountryName;
          localStorage.setItem(storageKey, JSON.stringify(parsed));

          // Also update approved_partners list
          const approvedStr = localStorage.getItem("approved_partners");
          if (approvedStr) {
            const list = JSON.parse(approvedStr);
            const nameToFind = parsed.formData.fullName;
            const updatedList = list.map((p: any) => {
              if (p.name === nameToFind || String(p.id) === String(user?.id)) {
                return { 
                  ...p, 
                  location: cityName, 
                  city: justCityName,
                  lat: resolvedLat,
                  lng: resolvedLng,
                  latitude: resolvedLat,
                  longitude: resolvedLng,
                  state: stateVal || justCityName,
                  country: justCountryName
                };
              }
              return p;
            });
            localStorage.setItem("approved_partners", JSON.stringify(updatedList));
          }
        }
        window.dispatchEvent(new Event("partner_profile_updated"));
        toast.success(`Partner profile location updated to ${cityName}`);
      } else {
        toast.success(`Browsing location set to ${cityName}`);
      }
    } catch (err) {
      console.error("Failed to update location:", err);
      toast.error("Failed to update location");
    }
  };

  const handleUseGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
            headers: {
              "User-Agent": "hire-my-partner-app"
            }
          });
          
          if (!res.ok) throw new Error("Reverse geocode request failed");
          
          const data = await res.json();
          const address = data.address || {};
          
          const city = address.city || address.town || address.village || address.suburb || "Delhi";
          const state = address.state || address.region || "Delhi";
          const country = address.country || "India";
          
          setIsLocating(false);
          handleUpdateLocation(`${city}, ${country}`, lat, lng, false, state, country);
        } catch (error) {
          console.error("Reverse geocoding failed, using fallback:", error);
          setIsLocating(false);
          handleUpdateLocation("Delhi, India", lat, lng, false, "Delhi", "India");
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        toast.error(error.message || "Failed to retrieve GPS location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Debounce search typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(searchQuery)}&countrycodes=${selectedCountry.code}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search geocoding failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCountry]);

  useEffect(() => {
    setMounted(true);

    const updateAvatar = () => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        // Read partner application photo from localStorage if present
        const storageKey = currentUser.email 
          ? `partnerApplication_${currentUser.email.replace(/[^a-zA-Z0-9]/g, "_")}` 
          : "partnerApplication";
        try {
          const savedData = localStorage.getItem(storageKey);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.formData?.photo) {
              setAvatarUrl(parsed.formData.photo);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
        setAvatarUrl(currentUser.avatar || "");
      } else {
        setAvatarUrl("");
      }
    };

    updateAvatar();

    // Location Initialization
    const loc = getUserLocation();
    if (loc && loc.city) {
      const justCity = loc.city.includes(",") ? loc.city.split(",")[0].trim() : loc.city;
      setActiveLocationName(justCity);
    }

    const savedLoc = localStorage.getItem("user_active_location");
    if (!savedLoc) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
                headers: { "User-Agent": "hire-my-partner-app" }
              });
              if (res.ok) {
                const data = await res.json();
                const address = data.address || {};
                const city = address.city || address.town || address.village || address.suburb || "Delhi";
                const state = address.state || address.region || "Delhi";
                const country = address.country || "India";
                handleUpdateLocation(`${city}, ${country}`, lat, lng, false, state, country);
              }
            } catch (e) {
              console.error("Auto geocoding failed", e);
            }
          },
          (err) => {
            console.log("Auto geolocation permission denied/failed", err);
          }
        );
      }
    }

    const handleLocationUpdateEvent = () => {
      const updatedLoc = getUserLocation();
      if (updatedLoc && updatedLoc.city) {
        const justCity = updatedLoc.city.includes(",") ? updatedLoc.city.split(",")[0].trim() : updatedLoc.city;
        setActiveLocationName(justCity);
      }
    };

    window.addEventListener("user_location_updated", handleLocationUpdateEvent);

    const onOpened = () => setIsSidebarOpen(true);
    const onClosed = () => setIsSidebarOpen(false);

    window.addEventListener("side_dashboard_opened", onOpened);
    window.addEventListener("side_dashboard_closed", onClosed);
    window.addEventListener("partnerStatusChange", updateAvatar);
    window.addEventListener("partner_profile_updated", updateAvatar);
    window.addEventListener("storage", updateAvatar);

    // Subscribe to auth store changes directly
    const unsub = useAuthStore.subscribe(() => {
      updateAvatar();
    });

    return () => {
      window.removeEventListener("side_dashboard_opened", onOpened);
      window.removeEventListener("side_dashboard_closed", onClosed);
      window.removeEventListener("partnerStatusChange", updateAvatar);
      window.removeEventListener("partner_profile_updated", updateAvatar);
      window.removeEventListener("storage", updateAvatar);
      window.removeEventListener("user_location_updated", handleLocationUpdateEvent);
      unsub();
    };
  }, [user]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("toggle_side_dashboard"));
  };



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-10%",
      transition: {
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0],
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 30,
      filter: "blur(10px)"
    },
    open: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 px-4 md:px-8 flex items-center justify-between ${isScrolled
            ? "bg-bg-base/80 backdrop-blur-md shadow-lg h-[70px] md:h-[80px]"
            : "bg-transparent h-[90px] md:h-[110px]"
          }`}
      >
        {/* LEFT LOGO */}
        <Link href="/" className="flex md:m-10 items-center gap-2 cursor-pointer z-10 group">
          <ThemeLogo
            width={150}
            height={125}
            className={`transition-all duration-500 ${isScrolled
                ? "h-[50px] md:h-[82px]"
                : "h-[70px] md:h-[130px] mt-4"
              } drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.15)] group-hover:drop-shadow-[0_5px_22px_rgba(var(--primary-rgb),0.4)] group-hover:scale-105`}
            priority
          />
        </Link>


        {/* CENTER NAV - DESKTOP */}
        <div
          className={`hidden lg:flex items-center backdrop-blur-md border rounded-full px-2 py-1 shadow-sm transition-all duration-500 ${isScrolled
              ? "bg-bg-card border-border-main"
              : "bg-bg-card border-border-main"
            }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={!isAuthenticated && item.href.startsWith("/#") ? `/login?redirect=${encodeURIComponent(item.href)}` : item.href}
              onClick={(e) => {
                if (!isAuthenticated && item.href.startsWith("/#")) {
                  e.preventDefault();
                  router.push(`/login?redirect=${encodeURIComponent(item.href)}`);
                }
              }}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 group
              ${pathname === item.href
                  ? "bg-linear-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 border-none"
                  : isScrolled
                    ? "text-text-main font-bold hover:text-primary"
                    : "text-primary hover:text-primary"
                }`}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100" />
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE - DESKTOP/MOBILE */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Location Picker Pill & Popover */}
          {mounted && (
            <div className="relative">
              <button
                onClick={() => setShowLocationPopover(!showLocationPopover)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border cursor-pointer hover:scale-102 transition-all duration-300 shadow-sm text-xs font-bold ${
                  showLocationPopover
                    ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.25)]"
                    : isScrolled
                      ? "bg-bg-card/45 border-border-main hover:bg-bg-card/75 text-text-main"
                      : "bg-black/25 border-white/20 hover:bg-black/45 text-white"
                }`}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 shrink-0">
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <MapPin className={`w-3.5 h-3.5 ${showLocationPopover ? "text-primary animate-bounce" : "text-primary"}`} />
                  )}
                </div>
                <span className="max-w-[85px] sm:max-w-[120px] truncate tracking-wide">
                  {isLocating ? "Locating..." : activeLocationName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 shrink-0 ${showLocationPopover ? "rotate-180 text-primary" : ""}`} />
              </button>

              <AnimatePresence>
                {showLocationPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-96 bg-bg-base/95 backdrop-blur-md border border-border-main rounded-2xl shadow-2xl p-5 z-150 flex flex-col gap-4"
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 animate-pulse" />
                      Set Location
                    </div>

                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleUseGPSLocation();
                        setShowLocationPopover(false);
                      }}
                      disabled={isLocating}
                      className="w-full cursor-pointer flex items-center justify-between p-3 rounded-xl border border-border-main bg-bg-secondary/40 text-text-main hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Locate className={`w-3.5 h-3.5 text-primary ${isLocating ? "animate-pulse" : ""}`} />
                        <span>Use My Current Location</span>
                      </div>
                      {isLocating && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    </button>

                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-border-main/50"></div>
                      <span className="flex-shrink mx-3 text-[10px] text-text-muted font-bold uppercase tracking-wider">or search</span>
                      <div className="flex-grow border-t border-border-main/50"></div>
                    </div>

                    {/* Country Field */}
                    <div className="relative">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-text-muted mb-1">
                        Country
                      </span>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countryQuery}
                          onFocus={() => {
                            setIsCountryDropdownOpen(true);
                            setCountryQuery(""); // Clear for instant search typing on focus
                          }}
                          onChange={(e) => {
                            setCountryQuery(e.target.value);
                            setIsCountryDropdownOpen(true);
                          }}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary/60 border border-border-main focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-text-main placeholder-text-muted outline-none transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {selectedCountry.code}
                        </span>
                      </div>

                      {/* Country Dropdown list */}
                      <AnimatePresence>
                        {isCountryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto border border-border-main/80 bg-bg-secondary/95 backdrop-blur-md rounded-xl shadow-2xl z-200 p-1.5 custom-scrollbar"
                          >
                            {countriesList
                              .filter((c) =>
                                c.name.toLowerCase().includes(countryQuery.toLowerCase())
                              )
                              .map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setCountryQuery(c.name);
                                    setIsCountryDropdownOpen(false);
                                    // Focus City input on next tick
                                    setTimeout(() => {
                                      cityInputRef.current?.focus();
                                    }, 100);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary text-xs text-text-main font-semibold transition-colors flex items-center justify-between cursor-pointer mb-0.5 last:mb-0"
                                >
                                  <span>{c.name}</span>
                                  <span className="text-[10px] font-black tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                    {c.code}
                                  </span>
                                </button>
                              ))}
                            {countriesList.filter((c) =>
                              c.name.toLowerCase().includes(countryQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="p-3 text-center text-xs text-text-muted">
                                No countries found
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* City/Area Field */}
                    <div className="relative">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-text-muted mb-1">
                        City / Area
                      </span>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          ref={cityInputRef}
                          type="text"
                          placeholder={`Search city in ${selectedCountry.name}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => {
                            setIsCountryDropdownOpen(false); // Close country dropdown
                          }}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary/60 border border-border-main focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-text-main placeholder-text-muted outline-none transition-all"
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-primary" />
                        )}
                      </div>
                    </div>

                    {/* Search Results list */}
                    {searchResults.length > 0 && (
                      <div className="max-h-48 overflow-y-auto border border-border-main/50 rounded-xl divide-y divide-border-main/30 bg-bg-secondary/20">
                        {searchResults.map((result, idx) => {
                          const name = result.display_name;
                          const address = result.address || {};
                          const city = address.city || address.town || address.village || address.suburb || searchQuery;
                          const state = address.state || address.region || "";
                          const country = address.country || "";
                          
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                handleUpdateLocation(name, parseFloat(result.lat), parseFloat(result.lon), false, state, country);
                                setShowLocationPopover(false);
                                setSearchQuery("");
                                setSearchResults([]);
                              }}
                              className="w-full text-left p-3 hover:bg-primary/5 text-xs text-text-main transition-colors flex items-start gap-2.5 cursor-pointer"
                            >
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <span className="line-clamp-2 leading-tight">{name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {searchQuery && !isSearching && searchResults.length === 0 && (
                      <div className="text-center py-4 text-xs text-text-muted font-medium">
                        No locations found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile / Login */}
          {mounted && isAuthenticated ? (
            <button
              onClick={handleProfileClick}
              className={`hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full border cursor-pointer hover:scale-102 transition-all duration-300 shadow-sm ${
                isSidebarOpen 
                  ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.25)]" 
                  : isScrolled
                    ? "bg-bg-card/45 border-border-main hover:bg-bg-card/75 text-text-main"
                    : "bg-black/25 border-white/20 hover:bg-black/45 text-white"
              }`}
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0 flex items-center justify-center bg-primary/10">
                {avatarUrl && avatarUrl !== "/images/avatar6.jpg" ? (
                  <Image
                    src={avatarUrl}
                    alt="profile"
                    width={28}
                    height={28}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User size={14} className="text-primary" />
                )}
              </div>
              <span className="text-xs font-bold tracking-wide max-w-[100px] truncate">
                {user?.name ? user.name.split(" ")[0] : "Profile"}
              </span>
              <motion.div
                animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center text-text-muted shrink-0"
              >
                <ChevronDown size={14} className={isSidebarOpen ? "text-primary" : ""} />
              </motion.div>
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-primary/50 hover:border-primary cursor-pointer hover:scale-105 transition shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.55)] relative group duration-300"
              title="Login"
            >
              {/* Active breathing dot badge on top corner */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <User size={18} className="text-white group-hover:text-primary transition-colors duration-300" />
            </Link>
          )}

          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={handleProfileClick}
            className={`lg:hidden flex items-center justify-center transition-all active:scale-95 z-50 p-2 cursor-pointer ${
              isScrolled ? "text-text-main" : "text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isSidebarOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>


    </>
  );
}
