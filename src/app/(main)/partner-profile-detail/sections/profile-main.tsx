"use client";

import { useState } from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { MapPin, Star, ShieldCheck, Map, Clock, Heart, X, MessageSquare, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface ProfileData {
  name: string;
  age: number;
  bio: string;
  location: string;
  rating: string;
  verified: boolean;
  distance: string;
  image: string;
  reviews: number;
}

export default function ProfileMain() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const profileData: ProfileData = {
    name: "Aisha Sharma",
    age: 28,
    bio: "A passionate software engineer with a love for travel and adventure. I enjoy hiking, photography, and trying new cuisines. Your perfect plus-one for any occasion, ready to make unforgettable memories.",
    location: "New Delhi, India",
    rating: "4.9",
    reviews: 128,
    verified: true,
    distance: "5 km away",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
  };

  return (
    <section
      className={`relative pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 px-4 overflow-hidden ${outfit.className}`}
    >
      {/* ── BACKGROUND AMBIANCE ── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-dark/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-[1250px] w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
          
          {/* Left Column: Compact Portfolio Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full aspect-4/5 max-h-[420px] md:max-h-[500px] lg:max-h-[520px] xl:max-h-[580px] rounded-[32px] overflow-hidden border border-border-main shadow-2xl shadow-black/10 group cursor-zoom-in"
            >
              <Image
                src={profileData.image}
                alt={profileData.name}
                fill
                priority
                className="object-cover object-top transition-transform duration-1000 ease-in-out group-hover:scale-110"
              />
              
              {/* Premium Overlays */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              {/* Dynamic Verification Badge */}
              {profileData.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-bg-card/60 backdrop-blur-md border border-border-main px-3 py-1.5 rounded-xl shadow-xl">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="text-text-main text-[8px] font-black uppercase tracking-[0.2em]">Verified</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Refined Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
               <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-primary text-[8px] font-black uppercase tracking-widest">Premium Partner</span>
               <div className="w-1 h-1 rounded-full bg-border-main" />
               <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">Active</span>
            </div>

            {/* Header Area */}
            <div className="mb-4">
              <h1
                className={`${rochester.className} text-4xl md:text-6xl lg:text-7xl text-text-main mb-1 leading-none drop-shadow-2xl`}
              >
                {profileData.name}
                <span
                  className={`${outfit.className} text-xl md:text-2xl font-light text-primary/60 ml-3`}
                >
                  {profileData.age}
                </span>
              </h1>
               <div className="w-20 h-1 bg-linear-to-r from-primary to-transparent rounded-full mt-2" />
            </div>

            {/* Quote / Bio */}
            <div className="relative mb-6">
                <div className="absolute -left-3 top-0 w-1 h-full bg-linear-to-b from-primary via-primary/20 to-transparent rounded-full" />
               <p className="text-base md:text-lg lg:text-xl text-text-main italic font-light leading-relaxed line-clamp-3">
                "{profileData.bio}"
               </p>
            </div>

            {/* Stats Grid - Tighter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="group flex items-center gap-3 p-3.5 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Base</p>
                  <p className="text-text-main text-xs font-bold tracking-tight">{profileData.location}</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 p-3.5 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all">
                <div className="w-9 h-9 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                </div>
                <div>
                  <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-text-main text-xs font-bold">{profileData.rating}</span>
                    <span className="text-text-muted text-[8px] font-bold uppercase">{profileData.reviews} Reviews</span>
                  </div>
                </div>
              </div>

              <div className="group flex items-center gap-3 p-3.5 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all sm:col-span-2">
                <div className="w-9 h-9 bg-blue-400/10 rounded-lg flex items-center justify-center text-blue-400">
                  <Map size={16} />
                </div>
                <div>
                  <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Proximity</p>
                  <p className="text-text-main text-xs font-bold tracking-tight">{profileData.distance} from you</p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Compact height */}
            <div className="flex items-center gap-3 w-full">
               <Link href="/checkout" className="group relative flex-[1.8] h-14 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Heart className="w-4 h-4 fill-white relative z-10" />
                <span className="relative z-10">Reserve Now</span>
              </Link>
              <Link href="#" className="flex-1 h-14 bg-bg-secondary/80 border-2 border-border-main rounded-2xl flex items-center justify-center gap-2 text-text-main text-[10px] font-black uppercase tracking-[0.2em] shadow-inner hover:bg-bg-card hover:border-primary/30 transition-all">
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
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
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-bg-card/50 backdrop-blur-md border border-border-main flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="relative">
                <img
                  src={profileData.image}
                  alt="Gallery preview"
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



