"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { CheckCircle2, Circle, HeartHandshake } from "lucide-react";
import Link from "next/link";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ADD_ONS = [
  { id: "photo", label: "Casual Photoshoot", price: 1500 },
  { id: "playlist", label: "Personalized Playlist", price: 500 },
  { id: "travel", label: "Extra Travel Time", price: 2000 },
];

export default function RatesBooking() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const hourlyRate = 4999;
  const minHours = 2;

  const handleToggle = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const calculateTotal = () => {
    const base = hourlyRate * minHours;
    const extras = ADD_ONS.filter((addon) =>
      selectedAddOns.includes(addon.id),
    ).reduce((sum, item) => sum + item.price, 0);
    return base + extras;
  };

  return (
    <section
      className={`py-16 xl:py-24 px-4 sm:px-6 bg-[#0a0a0a] min-h-screen border-b border-white/5 flex items-center justify-center ${outfit.className}`}
    >
      <div className="max-w-[1600px] w-full mx-auto relative z-10">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full bg-pink-500/10 blur-[150px] rounded-[100%] -z-10 pointer-events-none" />

        <div className="flex flex-col xl:flex-row gap-10 xl:gap-16 items-stretch bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] xl:rounded-[60px] p-8 md:p-12 xl:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Left Column: Booking Configurations */}
          <div className="flex-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 xl:mb-12"
            >
              <h2
                className={`${rochester.className} text-5xl md:text-6xl xl:text-7xl text-white mb-2 xl:mb-4 drop-shadow-md`}
              >
                Rates & Booking
              </h2>
              <div className="w-20 xl:w-28 h-1 rounded-full bg-linear-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(255,51,119,0.5)]"></div>
            </motion.div>

            {/* Base Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6 mb-10 xl:mb-14">
              <div className="bg-black/40 border border-white/10 p-5 xl:p-8 rounded-2xl xl:rounded-3xl">
                <p className="text-slate-400 text-sm xl:text-base font-semibold uppercase tracking-wider mb-1 xl:mb-2">
                  Hourly Rate
                </p>
                <p className="text-white text-2xl xl:text-4xl font-bold tracking-wide">
                  ₹{hourlyRate}
                  <span className="text-sm xl:text-lg font-normal text-slate-500">
                    {" "}
                    / hour
                  </span>
                </p>
              </div>
              <div className="bg-black/40 border border-white/10 p-5 xl:p-8 rounded-2xl xl:rounded-3xl">
                <p className="text-slate-400 text-sm xl:text-base font-semibold uppercase tracking-wider mb-1 xl:mb-2">
                  Minimum Booking
                </p>
                <p className="text-white text-2xl xl:text-4xl font-bold tracking-wide">
                  {minHours}
                  <span className="text-sm xl:text-lg font-normal text-slate-500">
                    {" "}
                    hours
                  </span>
                </p>
              </div>
            </div>

            {/* Add-ons Checklist */}
            <div className="mb-0">
              <h3 className="text-xl xl:text-2xl font-bold text-white mb-4 xl:mb-6 flex items-center gap-2">
                <span className="text-pink-500">Premium</span> Add-ons
              </h3>
              <div className="flex flex-col gap-3 xl:gap-5">
                {ADD_ONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggle(addon.id)}
                      className={`flex items-center justify-between p-4 xl:p-6 rounded-2xl xl:rounded-3xl cursor-pointer transition-all duration-300 border ${isSelected ? "bg-pink-500/10 border-pink-500/50 shadow-[0_0_20px_rgba(255,51,119,0.15)]" : "bg-black/20 border-white/5 hover:border-white/20"}`}
                    >
                      <div className="flex items-center gap-3 xl:gap-5">
                        {isSelected ? (
                          <CheckCircle2 className="w-6 h-6 xl:w-8 xl:h-8 text-pink-500 drop-shadow-[0_0_8px_rgba(255,51,119,0.8)]" />
                        ) : (
                          <Circle className="w-6 h-6 xl:w-8 xl:h-8 text-slate-600" />
                        )}
                        <span
                          className={`font-medium xl:text-xl transition-colors ${isSelected ? "text-white" : "text-slate-300"}`}
                        >
                          {addon.label}
                        </span>
                      </div>
                      <span className="text-slate-400 text-sm xl:text-lg font-semibold">
                        + ₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vertical Divider for Desktop (moved to xl) */}
          <div className="hidden xl:block w-px bg-white/10" />

          {/* Right Column: Checkout Summary Box */}
          <div className="w-full xl:w-[450px] 2xl:w-[500px] flex flex-col justify-between bg-black/30 rounded-3xl xl:rounded-[40px] p-6 md:p-8 xl:p-10 border border-white/5">
            <div>
              <h3 className="text-lg xl:text-xl font-semibold text-slate-300 mb-6 xl:mb-10 uppercase tracking-widest border-b border-white/10 pb-4 xl:pb-6">
                Booking Summary
              </h3>

              <div className="flex flex-col gap-3 xl:gap-6 mb-6 flex-grow text-base xl:text-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Base Rate ({minHours} hrs)</span>
                  <span>₹{hourlyRate * minHours}</span>
                </div>

                {ADD_ONS.map((addon) => {
                  if (selectedAddOns.includes(addon.id)) {
                    return (
                      <div
                        key={`summary-${addon.id}`}
                        className="flex justify-between items-center text-pink-400/80"
                      >
                        <span>+ {addon.label}</span>
                        <span>₹{addon.price}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-end border-t border-white/10 pt-6 xl:pt-10 mb-6 xl:mb-10">
                <span className="text-slate-300 uppercase tracking-wider text-sm xl:text-base font-semibold">
                  Total Cost
                </span>
                <span className="text-white text-3xl xl:text-5xl font-black">
                  ₹{calculateTotal()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 group xl:text-lg xl:py-6 xl:rounded-3xl"
              >
                <HeartHandshake className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform" />
                Confirm & Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
