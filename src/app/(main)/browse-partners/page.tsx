"use client";

import { useState } from "react";
import MainBrowse from "./sections/main-browse";
import FilterBy from "./sections/filter-by";
import { ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePart from "./sections/profile-part";
import { Rochester } from "next/font/google";
import Footer from "../home-page/sections/Footer";

const rochester = Rochester({
  subsets: ["latin"],
  weight: "400",
});

export default function BrowsePartnersPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-bg-base min-h-screen flex relative">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-90 hidden lg:block"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="hidden lg:block fixed left-0 top-0 bottom-0 w-[400px] z-100 bg-bg-secondary border-r border-border-main shadow-2xl"
            >
              <div className="relative h-full">
                <FilterBy onClose={() => setIsSidebarOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Reopen Button - Shows when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-r-2xl items-center justify-center text-primary hover:bg-primary/30 transition-all z-50 group"
          title="Open Filters"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-widest ml-1">Filters</span>
        </button>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Banner Section */}
        <MainBrowse />

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex-1">
          <div className="flex flex-col gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border-main mb-4">
              <div className="flex items-center gap-3">
                <ListFilter className="w-5 h-5 text-primary" />
                <span className="text-white font-bold">Filters</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20"
              >
                Change
              </button>
            </div>

            {/* Main Content Area */}
            <main className="w-full space-y-8">
              {/* Results Header */}
              <div className="flex items-center justify-between border-b border-border-main pb-6">
                <div className="space-y-1">
                  <h3
                    className={`${rochester.className} text-2xl font-bold text-white tracking-tight`}
                  >
                    Available Partners
                  </h3>
                  <p className="text-sm text-text-muted font-medium">
                    Showing profiles based on your interest
                  </p>
                </div>
              </div>

              {/* Results Grid / ProfilePart */}
              <ProfilePart isSidebarOpen={isSidebarOpen} />
            </main>
          </div>
        </div>

        <Footer />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-100 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[360px] z-101 lg:hidden"
            >
              <FilterBy onClose={() => setIsMobileFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}



