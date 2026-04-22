"use client";

import SideDashboard from "@/components/side-dashboard/side-dashboard";
import EarningPart from "./sections/earning-part";
import Overview from "./sections/overview";
import RecentPaid from "./sections/recent-paid";
import Note from "./sections/note";
import Footer from "../home-page/sections/Footer";
import MainEarning from "./sections/main-earning";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function MyEarning() {
  return (
    <div className={`bg-bg-base min-h-screen ${outfit.className}`}>
      {/* ── REUSABLE TOGGLE DASHBOARD ── */}
      <SideDashboard activeItem="earning" />

      {/* 1. TOP BANNER */}
      <MainEarning />

      {/* 2. MAIN CONTENT AREA (Full Width with Floating Dashboard) */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 md:py-20">
        
        {/* CENTERED CONTENT COLUMN */}
        <main className="max-w-5xl mx-auto flex flex-col gap-10 xl:gap-14">
          <EarningPart />
          <Overview />
          <RecentPaid />
          <Note />
        </main>
      </div>

      <Footer />
    </div>
  );
}



