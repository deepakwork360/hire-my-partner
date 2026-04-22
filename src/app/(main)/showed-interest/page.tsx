"use client";

import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../home-page/sections/Footer";
import MainInterest from "./sections/main-interest";
import Overview from "./sections/overview";
import InterestedPeople from "./sections/interested-people";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function ShowedInterestPage() {
  return (
    <div className={`bg-bg-base min-h-screen ${outfit.className}`}>
      {/* ── REUSABLE TOGGLE DASHBOARD ── */}
      <SideDashboard activeItem="interest" />

      {/* 1. TOP BANNER */}
      <MainInterest />

      {/* 2. MAIN CONTENT AREA (Monitor Optimized Dashboard Layout) */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 md:py-20 flex flex-col gap-12 xl:gap-20">
        
        {/* ANALYTICS SECTION */}
        <section id="interest-overview">
          <Overview />
        </section>

        {/* INTERESTED PEOPLE LIST SECTION */}
        <section id="interested-list">
          <InterestedPeople />
        </section>

      </div>

      <Footer />
    </div>
  );
}



