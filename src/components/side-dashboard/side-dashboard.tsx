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
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const menuItems = [
  { id: "booking", label: "My Booking", icon: Calendar, path: "/my-booking" },
  { id: "earning", label: "My Earning", icon: Wallet, path: "/my-earning" },
  { id: "profile", label: "People View My Profile", icon: UserRound, path: "/viewed-profile" },
  { id: "interest", label: "People Show Interest", icon: Heart, path: "/showed-interest" },
];

interface SideDashboardProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export default function SideDashboard({ activeItem = "earning", onItemClick }: SideDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(activeItem);
  const router = useRouter();

  // Close dashboard on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleItemClick = (id: string, path: string) => {
    setActive(id);
    if (onItemClick) onItemClick(id);
    
    // Navigate to the section page
    router.push(path);
    
    // Close the sidebar smoothly after navigation
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-[100] ${outfit.className}`}>
      {/* ── TOGGLE BUTTON (Floating Tab) ── */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 group flex items-center gap-3 pl-3 pr-4 py-6 bg-[#050505] border border-pink-500/20 border-l-0 rounded-r-2xl shadow-[15px_0_40px_rgba(219,39,119,0.15)] transition-all hover:pl-5 hover:bg-zinc-900 ${
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
            <LayoutDashboard size={20} className="text-pink-500 group-hover:scale-110 group-hover:text-rose-500 transition-all drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">
                Dashboard
            </span>
        </div>
      </motion.button>

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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-full w-[320px] md:w-[380px] bg-[#050505] border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] p-8 md:p-10 flex flex-col relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mt-8 mb-12 relative">
                <div className="absolute -left-10 -top-4 w-24 h-24 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                    <LayoutDashboard size={14} className="text-pink-500" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 text-[10px] font-black uppercase tracking-[0.3em]">Quick Access</span>
                </div>
                <h2 className={`${rochester.className} text-5xl text-white tracking-wide leading-tight relative`}>
                  Your Dashboard
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-pink-600 to-rose-700 rounded-full" />
                </h2>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id, item.path)}
                      className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all group ${
                        isActive
                          ? "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-xl shadow-pink-600/20"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-white/20"
                              : "bg-black/20 group-hover:bg-black/40"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Footer Note */}
              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="p-6 bg-pink-600/5 rounded-2x border border-pink-500/10">
                    <p className="text-slate-500 text-[10px] italic leading-relaxed text-center">
                        "Manage your profile, bookings, and earnings seamlessly from this central hub."
                    </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
