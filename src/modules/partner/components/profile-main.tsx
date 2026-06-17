"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { MapPin, Star, ShieldCheck, Map, Heart, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

import { Partner } from "../types/partner.types";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface ProfileMainProps {
  partner?: Partner;
}

export default function ProfileMain({ partner }: ProfileMainProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { appearance } = useTheme();
  
  const defaultProfile = {
    id: "1",
    name: "Aisha Sharma",
    age: 28,
    bio: "A passionate software engineer with a love for travel and adventure. I enjoy hiking, photography, and trying new cuisines. Your perfect plus-one for any occasion, ready to make unforgettable memories.",
    location: "New Delhi, India",
    rating: "4.9",
    reviews: 128 as any,
    verified: true,
    distance: "5 km away",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  };

  const profileData = partner || defaultProfile;
  const reviewsCount = Array.isArray(profileData.reviews) ? profileData.reviews.length : 0;
  const rawRating = typeof profileData.rating === "number"
    ? profileData.rating
    : parseFloat(profileData.rating || "0");
  const ratingScore = rawRating === 0 ? "0.0" : rawRating.toFixed(1);

  return (
    <section
      className={`relative pt-22 pb-4 md:pt-26 md:pb-6 px-4 overflow-hidden bg-bg-base ${outfit.className}`}
    >
      {/* Ambiance Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-dark/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-[1250px] w-full mx-auto relative z-10">
        
        {/* Cover Photo Banner */}
        {(() => {
          const bannerSrc = profileData.banner || "/images/love1.jpg";
          return (
            <div 
              onClick={() => setLightboxImage(bannerSrc)}
              className="w-full h-[200px] sm:h-[280px] md:h-[340px] rounded-[36px] overflow-hidden border border-border-main relative shadow-2xl cursor-zoom-in group"
            >
              <Image
                src={bannerSrc}
                alt={`${profileData.name} cover banner`}
                fill
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                priority
              />
              {appearance === "dark" && (
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-black/10 to-transparent" />
              )}
            </div>
          );
        })()}

        {/* Profile Info Header (with overlapping circular avatar) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 px-6 sm:px-12 pb-8 relative z-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Circular Avatar */}
            <div className="relative shrink-0 -mt-20 sm:-mt-24">
              <div
                onClick={() => setLightboxImage(profileData.image)}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-bg-base overflow-hidden shadow-2xl bg-bg-card relative cursor-zoom-in group"
              >
                <Image
                  src={profileData.image}
                  alt={profileData.name}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Verified Badge Stamp */}
              {profileData.verified && (
                <div className="absolute -top-1 -left-2 bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-lg border border-bg-base rotate-[-12deg] flex items-center gap-1 z-30">
                  <ShieldCheck size={10} />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Name, Age, Rating */}
            <div className="pb-1">
              <h1 className={`${rochester.className} text-4xl sm:text-5xl md:text-6xl text-text-main font-bold leading-tight flex items-baseline justify-center sm:justify-start gap-3`}>
                {profileData.name}
                {profileData.age && (
                  <span className={`${outfit.className} text-xl font-light text-primary/60`}>
                    {profileData.age}
                  </span>
                )}
              </h1>
              
              {/* Stars & Reviews */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => {
                    const isFilled = rawRating >= i + 1;
                    return (
                      <Star
                        key={i}
                        size={14}
                        className={isFilled ? "fill-amber-400 text-amber-400" : "text-text-muted/40"}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-text-main">{ratingScore}</span>
                <span className="text-text-muted text-[10px] font-bold">({reviewsCount} Reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full lg:w-auto flex items-center gap-3 shrink-0 mt-4 lg:mt-0">
            <a
              href="#booking-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 sm:flex-none sm:px-8 h-12 bg-primary hover:bg-primary/95 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 active:scale-95 transition-all cursor-pointer text-center"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Book Now</span>
            </a>
            
            <Link href="#" className="p-3 w-12 h-12 bg-bg-secondary border border-border-main rounded-xl hover:bg-bg-card hover:border-primary/30 transition-all text-text-main shadow-sm flex items-center justify-center shrink-0">
              <MessageSquare size={16} />
            </Link>
          </div>
        </div>

        {/* Content Body: Stats Row */}
        <div className="mt-8 pt-8 border-t border-border-main/50 px-6 sm:px-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Location</p>
                <p className="text-text-main text-xs font-bold tracking-tight">{profileData.location}</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                <Star size={18} className="fill-amber-400" />
              </div>
              <div>
                <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Rating Score</p>
                <p className="text-text-main text-xs font-bold tracking-tight">{ratingScore} ({reviewsCount} Reviews)</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                <Map size={18} />
              </div>
              <div>
                <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Distance</p>
                <p className="text-text-main text-xs font-bold tracking-tight">
                  {profileData.distance !== undefined && profileData.distance !== null 
                    ? `${typeof profileData.distance === "number" ? profileData.distance : String(profileData.distance).replace(/[^0-9.]/g, "")} km away` 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-bg-base/95 backdrop-blur-xl p-4 md:p-20 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-full rounded-[32px] overflow-hidden shadow-2xl border border-border-main"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-bg-card/50 backdrop-blur-md border border-border-main flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="relative">
                <img
                  src={lightboxImage}
                  alt="Gallery preview"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
