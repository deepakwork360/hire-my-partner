"use client";

import { useState } from "react";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../home-page/sections/Footer";
import Bookings from "./sections/bookings";
import FilterBy from "./sections/filter-by";
import MainBooking from "./sections/main-booking";
import CategorySwitcher from "./sections/category-switcher";
import { motion } from "framer-motion";

export default function MyBooking() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("hired_by_me");

  return (
    <div className="bg-[#050505] min-h-screen">
      <SideDashboard activeItem="booking" />
      <MainBooking />

      <div className="max-w-[1600px] mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center justify-center mb-16 sm:hidden">
          <CategorySwitcher
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            id="mobile"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Sidebar Filter - Responsive widths for larger screens */}
          <aside className="lg:w-[300px] xl:w-[360px] 2xl:w-[400px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <FilterBy
                activeTab={activeFilter}
                onTabChange={setActiveFilter}
              />
            </div>
          </aside>

          {/* Main Bookings Content - 75-80% width */}
          <main className="flex-1">
            <Bookings
              activeFilter={activeFilter}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
