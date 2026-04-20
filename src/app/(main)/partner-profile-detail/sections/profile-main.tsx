"use client";

import { useState } from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { MapPin, Star, ShieldCheck, Map, Clock, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop", // High quality placeholder
  };

  return (
    <section
      className={`py-12 md:py-24 px-4 bg-[#0a0a0a] min-h-screen border-b border-white/5 ${outfit.className}`}
    >
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Premium Image Portfolio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full aspect-[4/5] lg:mt-16 md:mt-16 sm:mt-0 rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(255,51,119,0.15)] group cursor-zoom-in"
            >
              <Image
                src={profileData.image}
                alt={profileData.name}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {/* Subtle Vignette Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

              {/* Dynamic Verification Badge */}
              {profileData.verified && (
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-pink-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,51,119,0.2)]">
                  <ShieldCheck className="w-5 h-5 text-pink-500" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Ambient Pink Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-pink-500/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
          </motion.div>

          {/* Right Column: Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col pt-4 md:pt-8"
          >
            {/* Header Area */}
            <div className="mb-6">
              <h1
                className={`${rochester.className} text-5xl md:text-7xl font-bold text-white mb-2 leading-tight tracking-wide drop-shadow-lg`}
              >
                {profileData.name}{" "}
                <span
                  className={`${outfit.className} text-3xl font-light text-pink-500 ml-2`}
                >
                  {profileData.age}
                </span>
              </h1>

              <div className="w-24 h-1 rounded-full bg-linear-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(255,51,119,0.5)] mt-4"></div>
            </div>

            {/* Quote / Bio Highlight */}
            <p className="text-xl md:text-2xl text-slate-300 italic font-light leading-relaxed mb-8 border-l-4 border-pink-500/50 pl-6">
              "{profileData.bio}"
            </p>

            {/* Glassmorphic Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-white font-bold tracking-wide">
                    {profileData.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/20">
                  <Star className="w-6 h-6 fill-pink-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Rating
                  </p>
                  <p className="text-white font-bold tracking-wide flex items-baseline gap-1">
                    <span>{profileData.rating}</span>
                    <span className="text-slate-500 text-xs font-normal">
                      ({profileData.reviews} Reviews)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300 sm:col-span-2">
                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/20">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Distance
                  </p>
                  <p className="text-white font-bold tracking-wide">
                    {profileData.distance} from your location
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mt-auto pb-4">
              <button className="btn-primary w-full sm:w-auto flex-1 flex items-center justify-center gap-2 text-sm sm:text-base">
                <Heart className="w-5 h-5 fill-white" />
                Book Now
              </button>
              <button className="btn-secondary w-full sm:w-auto flex-1 flex items-center justify-center gap-2 text-sm sm:text-base">
                Message {profileData.name.split(" ")[0]}
              </button>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pink-500 transition-colors duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full h-[80vh] aspect-auto">
                <img
                  src={profileData.image}
                  alt="Full preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

