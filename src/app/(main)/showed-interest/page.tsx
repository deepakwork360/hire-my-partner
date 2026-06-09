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
    <div className={`bg-bg-base min-h-screen relative flex ${outfit.className}`}>
      {/* ── REUSABLE TOGGLE DASHBOARD ── */}
      <SideDashboard activeItem="interest" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 1. TOP BANNER */}
        <MainInterest />

        {/* 2. MAIN CONTENT AREA (Monitor Optimized Dashboard Layout) */}
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col gap-12 xl:gap-20">
          
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
    </div>
  );
}



