"use client";

import { useState, useMemo } from "react";
import GiftCard from "@/components/ui/GiftCard";
import PremiumDropdown from "@/components/ui/PremiumDropdown";
import { Search, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { Rochester } from "next/font/google";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ChooseGift({
  onSelectGift,
}: {
  onSelectGift: (gift: { image: string; title: string; price: string }) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const gifts = [
    {
      image: "/images/flower.webp",
      title: "Royal Crimson Roses",
      description:
        "A breathtaking bouquet of 24 fresh crimson roses, elegantly wrapped to express your deepest admiration.",
      price: "₹1,499",
      numericPrice: 1499,
    },
    {
      image: "/images/choclate.webp",
      title: "Handcrafted Truffles",
      description:
        "An artisan selection of dark and milk chocolate truffles made with premium Belgian cocoa.",
      price: "₹999",
      numericPrice: 999,
    },
    {
      image: "/images/dry-fruit.webp",
      title: "Exotic Nut Collection",
      description:
        "A premium assortment of slow-roasted almonds, cashews, and pistachios in a luxury gift box.",
      price: "₹1,249",
      numericPrice: 1249,
    },
    {
      image: "/images/gift.webp",
      title: "Luxury Watch",
      description:
        "A timeless classic with a high-end movement and sapphire crystal glass.",
      price: "₹12,999",
      numericPrice: 12999,
    },
    {
      image: "/images/coffee.webp",
      title: "Gourmet Coffee Kit",
      description:
        "Includes premium single-origin beans and a specialty dripper for the coffee enthusiast.",
      price: "₹3,499",
      numericPrice: 3499,
    },
  ];

  const filteredGifts = useMemo(() => {
    let result = gifts.filter((gift) =>
      gift.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.numericPrice - a.numericPrice);
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="w-full bg-bg-base pt-0 pb-16 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* SECTION HEADER */}
        <div className="mb-6 flex flex-col items-center text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`${rochester.className} text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main tracking-tight`}
          >
            Select the{" "}
            <span className={`${rochester.className} text-primary`}>
              Perfect Gift
            </span>
          </motion.h2>
          <p className="text-text-muted max-w-xl">
            Browse our curated selection of premium gifts to complement your
            booking.
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8 bg-bg-card backdrop-blur-2xl border border-border-main rounded-[40px] shadow-2xl shadow-black/5 relative z-20">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 bg-bg-base border border-border-main rounded-2xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 shadow-sm transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 text-text-muted px-4 min-w-max">
              <Filter size={20} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-widest">
                Sort Price
              </span>
            </div>

            <div className="w-full">
              <PremiumDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "none", label: "Default Selection", icon: Filter },
                  { value: "low-to-high", label: "Low to High", icon: ArrowUpDown },
                  { value: "high-to-low", label: "High to Low", icon: ArrowUpDown },
                ]}
                placeholder="Sort Price"
                icon={ArrowUpDown}
              />
            </div>
          </div>
        </div>

        {/* GIFT GRID */}
        {filteredGifts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredGifts.map((gift) => (
              <GiftCard
                key={gift.title}
                {...gift}
                onSend={() => onSelectGift(gift)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-bg-secondary rounded-[40px] border border-dashed border-border-main"
          >
            <div className="w-20 h-20 bg-bg-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5">
              <Search size={32} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">
              No results found
            </h3>
            <p className="text-text-muted mb-8">
              Try adjusting your keywords or clearing the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("none");
              }}
              className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}



