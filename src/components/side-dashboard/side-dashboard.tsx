"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { 
  Calendar, 
  Wallet, 
  UserRound, 
  Heart, 
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
  CircleDollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { useTheme, Theme } from "@/context/ThemeContext";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { id: "violet", label: "Violet", color: "bg-violet-600" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
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
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { activeTheme, setTheme, isPreferenceSet, resetToRotation, appearance, toggleAppearance } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isLivePartner, setIsLivePartner] = useState(false);
  const [partnerPhoto, setPartnerPhoto] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showThemeSettings, setShowThemeSettings] = useState(false);

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

  // Close dashboard on ESC key
  useEffect(() => {
    setMounted(true);
    
    // Read online status from localStorage
    const savedOnlineStatus = localStorage.getItem("companion_online_status");
    if (savedOnlineStatus !== null) {
      setIsOnline(savedOnlineStatus === "true");
    }

    const checkPartnerStatus = () => {
      try {
        const savedData = localStorage.getItem("partnerApplication");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED" && parsed.formData) {
            setIsLivePartner(true);
            if (parsed.formData.photo) {
              setPartnerPhoto(parsed.formData.photo);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
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

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("toggle_side_dashboard", handleToggle);

    return () => {
      window.removeEventListener("partnerStatusChange", checkPartnerStatus);
      window.removeEventListener("partner_profile_updated", checkPartnerStatus);
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("toggle_side_dashboard", handleToggle);
    };
  }, []);

  const handleOnlineToggle = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    localStorage.setItem("companion_online_status", String(nextStatus));
    window.dispatchEvent(new Event("companionOnlineChange"));
  };

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-y-0 left-0 z-100 ${outfit.className}`}>
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
              className="fixed inset-0 bg-bg-base/60 backdrop-blur-sm z-[-1]"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-full w-[320px] md:w-[380px] bg-bg-base border-r border-border-main shadow-[20px_0_50px_rgba(0,0,0,0.3)] p-6 md:p-8 flex flex-col relative"
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
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg mb-3">
                      {isLivePartner && partnerPhoto ? (
                        <img
                          src={partnerPhoto}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-black">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-text-main text-lg font-bold tracking-wide">
                      {user.name}
                    </span>
                    <span className="text-text-muted text-xs font-medium tracking-wide mb-3">
                      {user.email}
                    </span>

                    {/* Online/Offline Status Switch for Verified Partners */}
                    {isLivePartner && (
                      <div className="flex items-center justify-between w-full max-w-[220px] bg-bg-secondary/60 border border-border-main/80 rounded-full px-4 py-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-text-muted"}`} />
                          <span className="text-xs font-bold uppercase tracking-wider text-text-main">
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                        <button
                          onClick={handleOnlineToggle}
                          className={`relative w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                            isOnline ? "bg-primary" : "bg-bg-card border border-border-main"
                          }`}
                        >
                          <motion.div
                            layout
                            className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-[3px]`}
                            style={{
                              left: isOnline ? "21px" : "3px"
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-6 w-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-sm border border-primary/20">
                      <Sparkles className="text-primary animate-pulse" size={24} />
                    </div>
                    <h3 className={`${rochester.className} text-3xl text-text-main mb-1.5`}>Welcome Guest</h3>
                    <p className="text-text-muted text-xs max-w-[240px] leading-relaxed mb-5">
                      Create an account to book companions or become a companion partner.
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
                    {!isLivePartner && renderMenuItem("/become-a-partner", "Become a Partner", UserCheck)}
                    {renderMenuItem("/pricing", "Pricing", CircleDollarSign, "lg:hidden")}
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

                {/* COMPANION HUB SECTION */}
                {isAuthenticated && isLivePartner && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                      Companion Hub
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {renderMenuItem("/my-profile", "Profile Manager", UserRound)}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
  