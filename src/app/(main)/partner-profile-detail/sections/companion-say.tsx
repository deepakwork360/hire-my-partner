"use client";

import { useState } from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Eye, ArrowRight } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const reviews = [
  {
    id: 1,
    name: "Rohit",
    role: "User",
    text: "She made my sister's wedding feel so special. Everyone thought we were best friends for years!",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Aayush",
    role: "User",
    text: "Charming, respectful, and truly present in every moment. I felt totally at ease.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Karan",
    role: "User",
    text: "Booked her for a formal event. Graceful, well-spoken, and made every interaction smooth and professional.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 4,
    name: "Aryan",
    role: "Companion",
    text: "We had great conversation during dinner. Intelligent, funny, and very respectful.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram",
    role: "User",
    text: "Excellent service! Found a great movie buddy in minutes. Highly recommended.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
    rating: 5,
  },
];

// Extracted Card Component for reuse in grid and modal
const ReviewCard = ({ review }: { review: any }) => (
  <div className="bg-[#111] backdrop-blur-xl border border-white/10 rounded-3xl relative overflow-hidden group hover:border-pink-500/30 transition-colors duration-500 h-full flex flex-col">
    {/* Premium Glow Header Area */}
    <div className="absolute top-0 w-full h-28 bg-linear-to-b from-pink-600/30 via-pink-600/10 to-transparent pointer-events-none" />
    <div className="absolute top-0 w-full h-1 bg-linear-to-r from-transparent via-pink-500/50 to-transparent" />

    <div className="px-6 pb-8 pt-12 flex flex-col items-center relative z-10 text-center h-full">
      {/* Overlapping Profile Image */}
      <div className="relative w-24 h-24 shrink-0 rounded-full border-4 border-[#111] shadow-[0_0_20px_rgba(255,51,119,0.2)] overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-500">
        <Image
          src={review.image}
          alt={review.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <h3 className="text-2xl font-bold text-white mb-3">{review.name}</h3>
      <p className="text-slate-400 italic text-sm leading-relaxed mb-6 flex-grow flex items-center justify-center">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center justify-center gap-1 mb-5">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500" />
        ))}
      </div>
      <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider py-1.5 px-6 rounded-full shadow-[0_0_10px_rgba(255,51,119,0.1)] mt-auto">
        {review.role}
      </div>
    </div>
  </div>
);

export default function CompanionSay() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If there are more than 4 reviews, we show 3 + "View All" card.
  const hasMore = reviews.length > 4;
  const displayedReviews = hasMore ? reviews.slice(0, 3) : reviews;

  return (
    <section
      className={`py-16 md:py-24 px-4 bg-[#080808] border-b border-white/5 ${outfit.className}`}
    >
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-4xl md:text-6xl text-white mb-4 text-center`}
          >
            Experiences Shared by Users
          </motion.h2>
          <div className="w-24 h-1 rounded-full bg-linear-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(255,51,119,0.5)]"></div>
        </div>

        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
          {displayedReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full"
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}

          {/* Conditional "View All" Card */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-full min-h-[400px] relative group overflow-hidden rounded-[40px] bg-[#0a0a0a] border border-white/5 transition-all duration-500 hover:border-pink-500/30 hover:shadow-[0_0_60px_rgba(255,51,119,0.15)] cursor-pointer"
              >
                {/* Dynamic Background Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-transparent to-rose-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated Radial Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 blur-[80px] rounded-full group-hover:bg-pink-500/10 transition-colors duration-700" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-8">
                    {/* Glowing Ring */}
                    <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-150 opacity-0 group-hover:opacity-100" />
                    
                    <div className="relative w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-400 transition-all duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Eye className="w-10 h-10 text-pink-400 group-hover:text-white transition-colors duration-500" />
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 bg-pink-600 text-[10px] font-black text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                      {reviews.length} total
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-pink-400 transition-colors">
                    View All
                  </h3>
                  <p className="text-slate-400 font-medium mb-8 max-w-[200px]">
                    Read {reviews.length - 3} more experiences shared by others
                  </p>

                  <div className="flex items-center gap-2 text-pink-500 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span>See All Reviews</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-pink-500/5 to-transparent pointer-events-none" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* View All Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 w-full max-w-[1200px] max-h-[85vh] rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 relative z-10 shrink-0">
                <h3
                  className={`${rochester.className} text-3xl md:text-5xl text-white`}
                >
                  All Experiences
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-pink-500/30 transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Red Glow isolated behind header */}
              <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 md:p-8 flex-1 scroll-smooth">
                {/* 3 Column grid for interior of modal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="h-full min-h-[350px]">
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
