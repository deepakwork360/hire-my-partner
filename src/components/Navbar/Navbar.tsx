"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PremiumButton from "../ui/PremiumButton";
import { useTheme } from "@/context/ThemeContext";
import ThemeLogo from "@/components/ui/ThemeLogo";
import { useAuthStore } from "@/modules/auth/store";


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
          {/* Contact Us - Hidden on mobile/tablet */}
          <div className="hidden lg:block">
            <PremiumButton
              label="Contact Us"
              href="/contact"
              size="md"
              variant="primary"
            />
          </div>





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
