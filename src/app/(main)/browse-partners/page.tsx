"use client";

import { useState } from "react";
import MainBrowse from "./sections/main-browse";
import FilterBy from "./sections/filter-by";
import { ListFilter } from "lucide-react";
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

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Top Banner Section */}
      <MainBrowse />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar (approx 20%) */}
          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-24 h-[calc(100vh-120px)] rounded-[32px] border border-white/5 shadow-2xl shadow-black">
            <FilterBy />
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
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

          {/* Main Content Area (approx 80%) */}
          <main className="flex-1 w-full space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h3
                  className={`${rochester.className} text-2xl font-bold text-white tracking-tight`}
                >
                  Available Partners
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Showing profiles based on your interest
                </p>
              </div>
            </div>

            {/* Results Grid / ProfilePart */}
            <ProfilePart />
          </main>
        </div>
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
      <Footer />
    </div>
  );
}
