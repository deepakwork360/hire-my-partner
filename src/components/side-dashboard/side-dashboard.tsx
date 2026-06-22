"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { 
  Calendar, 
  Wallet, 
  UserRound, 
  Heart, 
  Star,
  ChevronRight, 
  LayoutDashboard,
  X,
  Compass,
  UserCheck,
  LogOut,
  Sparkles,
  HelpCircle,
  LogIn,
  Settings,
  Palette,
  Moon,
  Sun,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Pencil,
  Bell,
  Trash2,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert,
  BadgeInfo,
  MapPin,
  Locate
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getUserLocation, setUserLocation, resolveCoordinates } from "@/lib/location";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { useTheme, Theme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/toastStore";
import { mockDb } from "@/modules/auth/data/users";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { id: "violet", label: "Violet", color: "bg-violet-600" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
];

export const moods = [
  { id: "all", label: "All Vibes", emoji: "✨" },
  { id: "romantic", label: "Romantic", emoji: "❤️" },
  { id: "happy", label: "Happy/Friendly", emoji: "🌟" },
  { id: "chilled", label: "Chilled", emoji: "🍹" },
  { id: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { id: "serious", label: "Serious/Intellectual", emoji: "💼" },
];

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface SideDashboardProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export default function SideDashboard({ activeItem = "earning", onItemClick }: SideDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, clearAuth, updateUserAvatar, updateUserProfile } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { activeTheme, setTheme, isPreferenceSet, resetToRotation, appearance, toggleAppearance } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [favouriteCompanions, setFavouriteCompanions] = useState<any[]>([]);

  useEffect(() => {
    const loadFavourites = () => {
      try {
        const favs = localStorage.getItem("favourite_partners");
        if (favs) {
          setFavouriteCompanions(JSON.parse(favs));
        } else {
          setFavouriteCompanions([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const loadLocation = () => {
      try {
        const loc = getUserLocation();
        setActiveLocationName(loc.city);
        if (loc.useCustom) {
          setUseCustomCoords(true);
          setCustomLat(String(loc.lat));
          setCustomLng(String(loc.lng));
        } else {
          setUseCustomCoords(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadFavourites();
    loadLocation();
    window.addEventListener("favourites_changed", loadFavourites);
    window.addEventListener("user_location_updated", loadLocation);
    window.addEventListener("storage", loadFavourites);
    return () => {
      window.removeEventListener("favourites_changed", loadFavourites);
      window.removeEventListener("user_location_updated", loadLocation);
      window.removeEventListener("storage", loadFavourites);
    };
  }, []);

  const [isLivePartner, setIsLivePartner] = useState(false);
  const [partnerPhoto, setPartnerPhoto] = useState("");
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [activeMood, setActiveMood] = useState<string>("all");
  const [showMoodSettings, setShowMoodSettings] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [activeLocationName, setActiveLocationName] = useState("Mumbai");
  const [useCustomCoords, setUseCustomCoords] = useState(false);
  const [customLat, setCustomLat] = useState("");
  const [customLng, setCustomLng] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";

  const renderMenuItem = (href: string, label: string, IconComponent: any, extraClass?: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group border-l-2 ${extraClass || ""} ${
          isActive
            ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
            : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <IconComponent size={18} className={isActive ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
          <span className="text-sm font-semibold tracking-wide">{label}</span>
        </div>
        <ChevronRight size={14} className={isActive ? "text-primary" : "text-text-muted/40 group-hover:text-text-main transition-colors"} />
      </Link>
    );
  };

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event("side_dashboard_opened"));
    } else {
      window.dispatchEvent(new Event("side_dashboard_closed"));
    }
  }, [isOpen]);

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close dashboard on ESC key
  useEffect(() => {
    setMounted(true);
    
    const checkPartnerStatus = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED" && parsed.formData) {
            setIsLivePartner(true);
            if (parsed.formData.photo) {
              setPartnerPhoto(parsed.formData.photo);
            }
            // Auto sync approved partner profile values to the logged-in User profile!
            const currentUser = useAuthStore.getState().user;
            const fd = parsed.formData;
            const needsSync =
              fd.fullName !== currentUser?.name ||
              fd.gender !== currentUser?.gender ||
              fd.age !== currentUser?.age ||
              fd.country !== currentUser?.country ||
              fd.city !== currentUser?.city ||
              fd.mobile !== currentUser?.phone ||
              fd.phoneCountryCode !== currentUser?.phone_country_code;

            if (needsSync && currentUser) {
              updateUserProfile({
                name: fd.fullName || currentUser.name,
                gender: fd.gender || currentUser.gender,
                age: fd.age || currentUser.age,
                country: fd.country || currentUser.country,
                city: fd.city || currentUser.city,
                phone: fd.mobile || currentUser.phone,
                phone_country_code: fd.phoneCountryCode || currentUser.phone_country_code,
              });
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLivePartner(false);
      setPartnerPhoto("");
    };

    checkPartnerStatus();

    // Listen to custom updates
    window.addEventListener("partnerStatusChange", checkPartnerStatus);
    window.addEventListener("partner_profile_updated", checkPartnerStatus);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };
    const handleOpenAccountCenter = (e: Event) => {
      router.push("/account-center");
      setIsOpen(false);
    };
    const handleMoodChange = () => {
      if (typeof window !== "undefined") {
        const mood = localStorage.getItem("user_mood") || "all";
        setActiveMood(mood);
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("toggle_side_dashboard", handleToggle);
    window.addEventListener("open_account_center", handleOpenAccountCenter);
    window.addEventListener("user_mood_changed", handleMoodChange);

    // Initial load
    handleMoodChange();

    return () => {
      window.removeEventListener("partnerStatusChange", checkPartnerStatus);
      window.removeEventListener("partner_profile_updated", checkPartnerStatus);
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("toggle_side_dashboard", handleToggle);
      window.removeEventListener("open_account_center", handleOpenAccountCenter);
      window.removeEventListener("user_mood_changed", handleMoodChange);
    };
  }, [storageKey]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false);
    }
  }, [isOpen]);

  const DefaultSilhouette = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
      <circle cx="50" cy="50" r="50" fill="#c4c4c4" />
      <circle cx="50" cy="42" r="18" fill="#ffffff" />
      <path d="M50 66c-16 0-30 8-34 18 3 4 31 16 34 16s31-12 34-16c-4-10-18-18-34-18z" fill="#ffffff" />
    </svg>
  );

  const handleAvatarUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      updateUserAvatar(url);
      if (isLivePartner) {
        try {
          const savedApp = localStorage.getItem(storageKey);
          if (savedApp) {
            const parsed = JSON.parse(savedApp);
            if (!parsed.formData) parsed.formData = {};
            parsed.formData.photo = url;
            localStorage.setItem(storageKey, JSON.stringify(parsed));
            setPartnerPhoto(url);
            const nameToFind = parsed.formData.fullName;
            if (nameToFind) {
              const approvedStr = localStorage.getItem("approved_partners");
              if (approvedStr) {
                const list = JSON.parse(approvedStr);
                const updatedList = list.map((p: any) => {
                  if (p.name === nameToFind) {
                    return { ...p, image: url };
                  }
                  return p;
                });
                localStorage.setItem("approved_partners", JSON.stringify(updatedList));
              }
            }
          }
        } catch (err) {
          console.error("Failed to sync partner photo upload:", err);
        }
      }
      window.dispatchEvent(new Event("partnerStatusChange"));
      window.dispatchEvent(new Event("partner_profile_updated"));
      toast.success("Profile photo updated successfully!");
    }
  };

  const presetCities = [
    "Mumbai",
    "Delhi/NCR",
    "Bangalore",
    "Dubai",
    "Los Angeles",
    "New York",
    "Tokyo",
    "Paris",
    "London",
    "Sydney",
  ];

  const handleUpdateLocation = (cityName: string, latVal?: number, lngVal?: number, useCustom?: boolean) => {
    try {
      let resolvedLat = latVal;
      let resolvedLng = lngVal;

      if (resolvedLat === undefined || resolvedLng === undefined) {
        const coords = resolveCoordinates(cityName);
        resolvedLat = coords.lat;
        resolvedLng = coords.lng;
      }

      // 1. Update active user browsing location
      setUserLocation({
        city: cityName,
        lat: resolvedLat,
        lng: resolvedLng,
        useCustom
      });

      setActiveLocationName(cityName);
      if (useCustom) {
        setCustomLat(String(resolvedLat));
        setCustomLng(String(resolvedLng));
      } else {
        setUseCustomCoords(false);
      }

      // 2. If it's a verified live partner, update their profile too!
      if (isLivePartner) {
        const savedApp = localStorage.getItem(storageKey);
        if (savedApp) {
          const parsed = JSON.parse(savedApp);
          if (!parsed.formData) parsed.formData = {};
          parsed.formData.city = cityName;
          parsed.formData.location = cityName;
          parsed.formData.lat = resolvedLat;
          parsed.formData.lng = resolvedLng;
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
                  city: cityName,
                  lat: resolvedLat,
                  lng: resolvedLng
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
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        setIsLocating(false);
        handleUpdateLocation("GPS Location", lat, lng, true);
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        toast.error(error.message || "Failed to retrieve GPS location.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleApplyCustomCoordinates = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid latitude and longitude values.");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
      return;
    }
    handleUpdateLocation("Custom Position", lat, lng, true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    clearAuth();
    setShowLogoutConfirm(false);
    setIsOpen(false);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-y-0 left-0 z-100 h-[100dvh] overflow-hidden ${isOpen ? "w-full md:w-auto" : "w-0"} ${outfit.className}`}>
      {/* ── SLIDE-OUT PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/45 z-[-1]"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-[100dvh] w-full md:w-[380px] bg-bg-base border-r border-border-main shadow-[20px_0_50px_rgba(0,0,0,0.3)] p-6 pb-8 md:p-8 md:pb-10 flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute cursor-pointer right-4 top-4 p-2 rounded-xl bg-bg-secondary/80 hover:bg-bg-card border border-border-main/40 text-text-muted hover:text-text-main transition-all flex items-center justify-center z-10"
                title="Close Sidebar"
              >
                <ChevronRight size={16} className="rotate-180 text-text-muted" />
              </button>

              <style dangerouslySetInnerHTML={{__html: `
                .sidebar-scroll-container::-webkit-scrollbar {
                  display: none !important;
                }
              `}} />

              {/* Profile Header */}
              <div className="mt-2 mb-4 flex flex-col items-center border-b border-border-main pb-4 shrink-0">
                {isAuthenticated && user ? (
                  <div className="flex flex-col items-center w-full">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="relative w-20 h-20 rounded-full border-2 border-primary/40 shadow-lg mb-3 shrink-0">
                      {isLivePartner && partnerPhoto ? (
                        <img
                          src={partnerPhoto}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <DefaultSilhouette />
                        </div>
                      )}
                      
                      {/* Pencil upload overlay */}
                      <button
                        onClick={handleAvatarUploadClick}
                        className="absolute top-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-primary-dark border-2 border-bg-base text-white flex items-center justify-center shadow-lg transition-all cursor-pointer z-20"
                        title="Update Profile Photo"
                      >
                        <Pencil size={11} />
                      </button>
                    </div>
                    <span className="text-text-main text-lg font-bold tracking-wide">
                      {user.name}
                    </span>
                    <span className="text-text-muted text-xs font-medium tracking-wide mb-3">
                      {user.email}
                    </span>
                    <button
                      onClick={() => {
                        router.push("/account-center");
                        setIsOpen(false);
                      }}
                      className="cursor-pointer px-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings size={10} />
                      <span>Account Center</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-6 w-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-sm border border-primary/20">
                      <Sparkles className="text-primary animate-pulse" size={24} />
                    </div>
                    <h3 className={`${rochester.className} text-3xl text-text-main mb-1.5`}>Welcome Guest</h3>
                    <p className="text-text-muted text-xs max-w-[240px] leading-relaxed mb-5">
                      Create an account to book companions or become a partner for exploring more.
                    </p>
                    <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 bg-linear-to-r from-primary-dark to-accent text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md cursor-pointer">
                        Login / Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <div 
                className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 sidebar-scroll-container"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* EXPLORE SECTION */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                    Explore
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {renderMenuItem("/browse-partners", "Browse Companions", Compass)}
                    {renderMenuItem("/pricing", "Pricing", CircleDollarSign, "lg:hidden")}
                    <div className="mt-1 px-1">
                      <Link href="/become-a-partner" onClick={() => setIsOpen(false)} className="w-full">
                        <button className="w-full h-11 bg-linear-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
                          <Sparkles size={13} className="animate-pulse" />
                          <span>{isLivePartner ? "Manage Partner Profile" : "Become a Partner"}</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* CLIENT DASHBOARD SECTION */}
                {isAuthenticated && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                      Dashboard
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {renderMenuItem("/my-booking", "My Bookings", Calendar)}
                      {renderMenuItem("/my-earning", "My Earnings", Wallet)}
                      {renderMenuItem("/viewed-profile", "Profile Views", UserCheck)}
                      {renderMenuItem("/showed-interest", "Received Interests", Heart)}
                    </div>
                  </div>
                )}

                {/* FAVOURITES SECTION */}
                {isAuthenticated && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1 flex items-center justify-between">
                      <span>Favourites</span>
                      {favouriteCompanions.length > 0 && (
                        <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">
                          {favouriteCompanions.length}
                        </span>
                      )}
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {renderMenuItem("/favourites", "My Favourites", Star)}
                      
                      {favouriteCompanions.length > 0 && (
                        <div className="mt-1 px-1.5 py-1 flex flex-col gap-2 border-t border-border-main/20 pt-2.5">
                          {favouriteCompanions.slice(0, 4).map((comp) => (
                            <Link
                              key={comp.id}
                              href={`/partners/${comp.id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 py-1 text-text-muted hover:text-text-main transition-colors group cursor-pointer"
                            >
                              <img
                                src={comp.image}
                                alt={comp.name}
                                className="w-6.5 h-6.5 rounded-full object-cover border border-border-main/40 shrink-0 group-hover:border-primary/50 transition-colors"
                              />
                              <span className="text-xs font-semibold truncate">{comp.name}</span>
                            </Link>
                          ))}
                          {favouriteCompanions.length > 4 && (
                            <Link
                              href="/favourites"
                              onClick={() => setIsOpen(false)}
                              className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors pl-9.5 mt-0.5"
                            >
                              + View all {favouriteCompanions.length}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SETTINGS & SUPPORT */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                    Settings & Support
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {/* Collapsible Theme Settings Trigger */}
                    <button
                      onClick={() => setShowThemeSettings(!showThemeSettings)}
                      className={`w-full cursor-pointer flex items-center justify-between px-4 py-3.5 rounded-xl border-l-2 transition-all duration-200 group ${
                        showThemeSettings
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Palette size={18} className={showThemeSettings ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide">Appearance & Themes</span>
                      </div>
                      {showThemeSettings ? (
                        <ChevronDown size={14} className="text-primary rotate-180 transition-transform duration-200" />
                      ) : (
                        <ChevronRight size={14} className="text-text-muted/40 group-hover:text-text-main transition-colors" />
                      )}
                    </button>

                    {/* Collapsed Theme Settings Panel */}
                    <AnimatePresence>
                      {showThemeSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-bg-secondary/20 border border-border-main/30 rounded-xl px-4 py-3.5 flex flex-col gap-4 mt-1"
                        >
                          {/* Light/Dark Toggle */}
                          <div className="flex items-center justify-between pb-3 border-b border-border-main/40">
                            <span className="text-xs font-semibold text-text-muted">
                              Dark Mode
                            </span>
                            <button
                              onClick={toggleAppearance}
                              className={`relative w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                                appearance === "dark" ? "bg-primary" : "bg-bg-card border border-border-main"
                              }`}
                            >
                              <motion.div
                                layout
                                className="w-4 h-4 rounded-full bg-white shadow-md absolute top-[3px]"
                                style={{
                                  left: appearance === "dark" ? "21px" : "3px"
                                }}
                              />
                            </button>
                          </div>

                          {/* Theme Color Selection Grid */}
                          <div>
                            <span className="text-xs font-semibold text-text-muted block mb-3">
                              Accent Color
                            </span>
                            <div className="grid grid-cols-5 gap-2">
                              {themes.map((t) => {
                                const isSelected = activeTheme === t.id && isPreferenceSet;
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer relative ${
                                      isSelected
                                        ? "border-primary/60 bg-primary/10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]"
                                        : "border-border-main/40 bg-bg-card hover:border-primary/20"
                                    }`}
                                    title={t.label}
                                  >
                                    <div className={`w-4 h-4 rounded-full ${t.color}`} />
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                        <Check size={8} className="text-white" strokeWidth={3} />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Auto Rotate Option */}
                          <div className="pt-3 border-t border-border-main/40">
                            <button
                              onClick={resetToRotation}
                              className={`w-full cursor-pointer flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                !isPreferenceSet
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-bg-card border-border-main/50 text-text-muted hover:text-text-main"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <RotateCcw size={14} className={!isPreferenceSet ? "animate-spin text-emerald-400" : ""} style={!isPreferenceSet ? { animationDuration: '4s' } : {}} />
                                <span className="text-xs font-semibold">
                                  Auto Change Themes
                                </span>
                              </div>
                              {!isPreferenceSet && <Sparkles size={10} className="text-emerald-400 animate-pulse" />}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Collapsible Mood/Vibe Trigger */}
                    <button
                      onClick={() => setShowMoodSettings(!showMoodSettings)}
                      className={`w-full cursor-pointer flex items-center justify-between px-4 py-3.5 rounded-xl border-l-2 transition-all duration-200 group ${
                        showMoodSettings
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Sparkles size={18} className={showMoodSettings ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5 text-left">
                          <span>Set Mood</span>
                          <span className="text-xs font-black px-1.5 py-0.5 rounded bg-primary/25 text-primary">
                            {moods.find(m => m.id === activeMood)?.emoji || "✨"}
                          </span>
                        </span>
                      </div>
                      {showMoodSettings ? (
                        <ChevronDown size={14} className="text-primary rotate-180 transition-transform duration-200" />
                      ) : (
                        <ChevronRight size={14} className="text-text-muted/40 group-hover:text-text-main transition-colors" />
                      )}
                    </button>

                    {/* Collapsed Mood Panel */}
                    <AnimatePresence>
                      {showMoodSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-bg-secondary/20 border border-border-main/30 rounded-xl px-4 py-3.5 flex flex-col gap-3 mt-1"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted text-left block">
                            How are you feeling today?
                          </span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {moods.map((m) => {
                              const isSelected = activeMood === m.id;
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    localStorage.setItem("user_mood", m.id);
                                    setActiveMood(m.id);
                                    
                                    // Save to partner_moods map in localStorage
                                    if (typeof window !== "undefined") {
                                      try {
                                        const savedMoods = JSON.parse(localStorage.getItem("partner_moods") || "{}");
                                        const pName = user?.name;
                                        if (pName) {
                                          savedMoods[pName] = m.id;
                                          
                                          // Attempt to map using approved_partners list
                                          const approvedStr = localStorage.getItem("approved_partners");
                                          if (approvedStr) {
                                            const list = JSON.parse(approvedStr);
                                            const found = list.find((p: any) => p.name === pName);
                                            if (found) {
                                              savedMoods[String(found.id)] = m.id;
                                            }
                                          }
                                        }
                                        localStorage.setItem("partner_moods", JSON.stringify(savedMoods));
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }

                                    window.dispatchEvent(new Event("user_mood_changed"));
                                    toast.success(`Mood set to ${m.label} ${m.emoji}`);
                                  }}
                                  className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 text-left ${
                                    isSelected
                                      ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                                      : "bg-bg-card border-border-main/40 text-text-muted hover:border-primary/30 hover:text-text-main"
                                  }`}
                                >
                                  <span className="text-sm shrink-0">{m.emoji}</span>
                                  <span className="truncate">{m.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
 
                    {/* Collapsible Location Trigger */}
                    <button
                      onClick={() => setShowLocationSettings(!showLocationSettings)}
                      className={`w-full cursor-pointer flex items-center justify-between px-4 py-3.5 rounded-xl border-l-2 transition-all duration-200 group ${
                        showLocationSettings
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <MapPin size={18} className={showLocationSettings ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5 text-left">
                          <span>{isLivePartner ? "Set Current Location" : "Set Your Location"}</span>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/25 text-primary max-w-[100px] truncate">
                            {activeLocationName || "Mumbai"}
                          </span>
                        </span>
                      </div>
                      {showLocationSettings ? (
                        <ChevronDown size={14} className="text-primary rotate-180 transition-transform duration-200" />
                      ) : (
                        <ChevronRight size={14} className="text-text-muted/40 group-hover:text-text-main transition-colors" />
                      )}
                    </button>
 
                    {/* Collapsed Location Panel */}
                    <AnimatePresence>
                      {showLocationSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-bg-secondary/20 border border-border-main/30 rounded-xl px-4 py-3.5 flex flex-col gap-3 mt-1"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted text-left block">
                            {isLivePartner 
                              ? "Where are you serving from?" 
                              : "Filter partners by distance from:"}
                          </span>
                          
                          {/* City selection grid */}
                          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                            {presetCities.map((city) => {
                              const isSelected = activeLocationName === city && !useCustomCoords;
                              return (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => handleUpdateLocation(city)}
                                  className={`px-3 py-2 rounded-lg border text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-left ${
                                    isSelected
                                      ? "bg-primary text-white border-primary shadow-sm"
                                      : "bg-bg-card border-border-main/40 text-text-muted hover:border-primary/30 hover:text-text-main"
                                  }`}
                                >
                                  <MapPin size={10} className={isSelected ? "text-white" : "text-text-muted"} />
                                  <span className="truncate">{city}</span>
                                </button>
                              );
                            })}
                          </div>
 
                          {/* Geolocation Trigger */}
                          <div className="pt-2 border-t border-border-main/30">
                            <button
                              type="button"
                              onClick={handleUseGPSLocation}
                              disabled={isLocating}
                              className={`w-full cursor-pointer flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                isLocating
                                  ? "bg-primary/10 border-primary/30 text-primary"
                                  : "bg-bg-card border-border-main/50 text-text-muted hover:text-text-main"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Locate size={14} className={isLocating ? "animate-pulse text-primary" : ""} />
                                <span>
                                  {isLocating ? "Locating via GPS..." : "Use My GPS Location"}
                                </span>
                              </div>
                              {isLocating && <Sparkles size={10} className="text-primary animate-pulse shrink-0" />}
                            </button>
                          </div>
 
                          {/* Custom Coordinates Toggle */}
                          <div className="pt-2 border-t border-border-main/30 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => setUseCustomCoords(!useCustomCoords)}
                              className={`w-full cursor-pointer flex items-center justify-between p-2 rounded-lg border text-[11px] font-bold transition-all ${
                                useCustomCoords
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-bg-card border-border-main/40 text-text-muted"
                              }`}
                            >
                              <span>Custom Coordinates</span>
                              <ChevronDown size={12} className={`transition-transform duration-200 ${useCustomCoords ? "rotate-180" : ""}`} />
                            </button>
 
                            {useCustomCoords && (
                              <div className="flex flex-col gap-2 p-2 bg-bg-card border border-border-main/40 rounded-lg">
                                <div className="flex gap-2">
                                  <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase text-text-muted text-left">Lat</span>
                                    <input
                                      type="number"
                                      step="0.0001"
                                      placeholder="19.0760"
                                      value={customLat}
                                      onChange={(e) => setCustomLat(e.target.value)}
                                      className="w-full text-xs bg-bg-base border border-border-main/60 rounded px-2 py-1 outline-none text-text-main focus:border-primary/50"
                                    />
                                  </div>
                                  <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase text-text-muted text-left">Lng</span>
                                    <input
                                      type="number"
                                      step="0.0001"
                                      placeholder="72.8777"
                                      value={customLng}
                                      onChange={(e) => setCustomLng(e.target.value)}
                                      className="w-full text-xs bg-bg-base border border-border-main/60 rounded px-2 py-1 outline-none text-text-main focus:border-primary/50"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleApplyCustomCoordinates}
                                  className="w-full cursor-pointer py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded transition-all shadow-sm"
                                >
                                  Apply Coordinates
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
 
                    {/* Help & Support (Navigates to Contact) */}
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group border-l-2 ${
                        pathname === "/contact"
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <HelpCircle size={18} className={pathname === "/contact" ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide">Help & Support</span>
                      </div>
                      <ChevronRight size={14} className={pathname === "/contact" ? "text-primary" : "text-text-muted/40 group-hover:text-text-main transition-colors"} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Logout / Footer Section */}
              {isAuthenticated && (
                <div className="mt-auto pt-6 border-t border-border-main/80 flex flex-col gap-4 shrink-0">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer h-12 rounded-xl bg-bg-secondary hover:bg-red-500/10 border border-border-main hover:border-red-500/20 text-text-muted hover:text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}

              {/* Logout Confirmation Modal Overlay */}
              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-base/95 z-110 flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-full max-w-[280px] bg-bg-base border border-border-main rounded-[24px] p-6 text-center shadow-2xl flex flex-col gap-5"
                    >
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                        <LogOut size={20} className="text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-text-main text-lg">Are you sure?</h4>
                        <p className="text-text-muted text-xs leading-relaxed">
                          You will be logged out of your account.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 cursor-pointer py-2.5 bg-bg-secondary hover:bg-bg-secondary/80 border border-border-main text-text-main text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmLogout}
                          className="flex-1 cursor-pointer py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>


            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
  