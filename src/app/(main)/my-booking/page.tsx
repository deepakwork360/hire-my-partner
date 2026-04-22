"use client";

import { useState } from "react";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../home-page/sections/Footer";
import Bookings from "./sections/bookings";
import FilterBy from "./sections/filter-by";
import MainBooking from "./sections/main-booking";
import CategorySwitcher from "./sections/category-switcher";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

export default function MyBooking() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("hired_by_me");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-bg-base min-h-screen relative flex">
      <SideDashboard activeItem="booking" />
      
      {/* Desktop Sidebar - Collapsible */}
      {/* Desktop Filter Drawer (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] hidden lg:block"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="hidden lg:block fixed left-0 top-0 bottom-0 w-[400px] z-[100] bg-bg-secondary border-r border-border-main shadow-2xl"
            >
              <div className="relative h-full">
                <FilterBy
                  activeTab={activeFilter}
                  onTabChange={setActiveFilter}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Reopen Button - Positioned above Dashboard Tab */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden lg:flex fixed left-0 top-[25%] -translate-y-1/2 w-10 h-24 bg-primary/10 backdrop-blur-2xl border border-primary/20 border-l-0 rounded-r-2xl items-center justify-center text-primary hover:bg-primary/20 transition-all z-50 group"
          title="Open Filters"
        >
          <div className="flex flex-col items-center gap-2">
            <Filter size={18} className="group-hover:scale-110 transition-transform" />
            <span className="[writing-mode:vertical-lr] rotate-180 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white transition-colors">
              Filters
            </span>
          </div>
        </button>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <MainBooking />

        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 md:py-16 flex-1">
          <div className="flex items-center justify-center mb-16 sm:hidden">
            <CategorySwitcher
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              id="mobile"
            />
          </div>

          <div className="flex flex-col gap-8 lg:gap-16">
            {/* Main Bookings Content */}
            <main className="flex-1">
              <Bookings
                activeFilter={activeFilter}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                isSidebarOpen={isSidebarOpen}
              />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}



