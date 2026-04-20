"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Camera, MapPin, Star, ShieldCheck, Heart, Bookmark } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function MainProfile() {
  const [avatarUrl, setAvatarUrl] = useState("/images/img1.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation for image type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      
      // Cleanup the previous URL if it was a blob
      // (Optional but good practice if you do many updates)
      // if (avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    }
  };

  return (
    <div className={`relative ${outfit.className}`}>
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* ── CINEMATIC HERO BACKGROUND ── */}
      <div 
        className="relative w-full h-[520px] bg-cover bg-center overflow-hidden flex flex-col justify-end" 
        style={{ backgroundImage: `url('/images/my-profile.png')` }}
      >
        {/* Dark Overlays & Fades */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

        {/* Content Container - pt-32 handles navbar overlap */}
        <div className="relative pt-32 pb-14 px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-7"
          >
            {/* PORTRAIT AVATAR */}
            <div className="relative group">
              <div 
                onClick={handleImageClick}
                className="relative w-28 h-36 rounded-2xl overflow-hidden ring-4 ring-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                <Image 
                  src={avatarUrl} 
                  alt="My Profile" 
                  fill 
                  className="object-cover object-top"
                  priority
                />
                {/* Change photo overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] gap-2">
                   <Camera className="text-white w-6 h-6" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Photo</span>
                </div>
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#050505] rounded-full flex items-center justify-center border-2 border-[#050505]">
                 <div className="w-full h-full bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <ShieldCheck size={14} className="text-white" />
                 </div>
              </div>
            </div>

            {/* NAME & LOCATION */}
            <div className="flex flex-col items-center">
              <h1 className={`${rochester.className} text-5xl md:text-6xl text-white tracking-wide mb-2 drop-shadow-2xl`}>
                Kavya Sharma
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <MapPin size={11} className="text-pink-500" />
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Andheri, Mumbai</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-pink-500/50" />
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-white/40">Member since 2024</span>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="flex items-center gap-4 md:gap-8 mt-2 p-4 bg-white/[0.04] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col items-center px-4">
                 <span className="text-white text-xl font-black">24</span>
                 <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Bookings</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center px-4">
                 <span className="text-white text-xl font-black">12</span>
                 <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Favorites</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center px-4">
                 <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} className="fill-amber-400" />
                    <span className="text-white text-xl font-black">4.9</span>
                 </div>
                 <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Trust Score</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
