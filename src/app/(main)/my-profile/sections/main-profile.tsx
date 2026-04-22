"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Camera, MapPin, Star, ShieldCheck, Award, Zap, Heart, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function MainProfile() {
  const [avatarUrl, setAvatarUrl] = useState("/images/img1.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${outfit.className} overflow-hidden`}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          
          {/* Header Actions */}
          <div className="w-full flex justify-between items-center mb-12 max-w-4xl">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-main rounded-full backdrop-blur-xl"
             >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online Now</span>
             </motion.div>
             <div className="flex items-center gap-3">
                 <button className="w-10 h-10 rounded-full bg-bg-card border border-border-main flex items-center justify-center text-text-main hover:bg-bg-secondary transition-all">
                   <Share2 size={16} />
                 </button>
                 <button className="w-10 h-10 rounded-full bg-bg-card border border-border-main flex items-center justify-center text-text-main hover:bg-bg-secondary transition-all">
                   <MoreHorizontal size={16} />
                 </button>
             </div>
          </div>

          {/* Profile Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl relative group"
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary-dark/30 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative bg-bg-secondary/80 border border-border-main rounded-[48px] p-8 md:p-16 backdrop-blur-3xl shadow-2xl overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
               
               <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
                  {/* Portrait Column */}
                  <div className="relative shrink-0">
                    <motion.div 
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative z-10"
                    >
                      <div 
                        onClick={handleImageClick}
                         className="relative w-56 h-72 md:w-64 md:h-80 rounded-[40px] overflow-hidden border-4 border-bg-card shadow-2xl shadow-black/20 cursor-pointer group/img"
                      >
                        <Image 
                          src={avatarUrl} 
                          alt="Profile" 
                          fill 
                          className="object-cover object-top rounded-[40px] transition-transform duration-700 group-hover/img:scale-110"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-md gap-4 rounded-[40px]">
                           <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                             <Camera size={24} className="text-white" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Update</span>
                        </div>
                      </div>
                      
                      {/* Floating Badge */}
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -right-6 z-20"
                      >
                        <div className="w-20 h-20 bg-bg-base rounded-3xl p-1.5 border border-border-main shadow-2xl">
                           <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-[18px] flex items-center justify-center">
                              <ShieldCheck size={32} className="text-white" />
                           </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-4">
                     <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                           <h1 className={`${rochester.className} text-6xl md:text-8xl text-text-main tracking-wide`}>
                             Kavya Sharma
                           </h1>
                           <div className="px-3 py-1 bg-primary/20 border border-primary/40 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest h-fit mt-4">
                             PRO
                           </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                           <div className="flex items-center gap-2 text-text-muted">
                             <MapPin size={14} className="text-primary" />
                             <span className="text-xs font-bold uppercase tracking-widest">Andheri East, Mumbai</span>
                           </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-border-main" />
                           <div className="flex items-center gap-2 text-text-muted">
                             <Award size={14} className="text-amber-400" />
                             <span className="text-xs font-bold uppercase tracking-widest text-amber-400/80">Platinum Elite</span>
                           </div>
                        </div>
                     </div>

                     <p className="text-text-muted text-sm leading-relaxed max-w-xl mb-12">
                       "A journey of a thousand miles begins with a single step. I'm here to make that step memorable. 
                       Traveler, art lover, and a believer in deep conversations."
                     </p>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-3 gap-6 md:gap-12 w-full">
                        {[
                          { label: "Sessions", value: "24", icon: Zap, color: "text-blue-400" },
                          { label: "Followers", value: "1.2k", icon: Heart, color: "text-rose-400" },
                          { label: "Rating", value: "4.9", icon: Star, color: "text-amber-400", isStar: true }
                        ].map((stat) => (
                          <div key={stat.label} className="flex flex-col items-center lg:items-start group/stat">
                             <div className="flex items-center gap-2 mb-2">
                                <stat.icon size={14} className={`${stat.color} ${stat.isStar ? 'fill-amber-400' : ''}`} />
                                <span className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</span>
                             </div>
                              <span className="text-3xl font-black text-text-main group-hover/stat:text-primary transition-colors duration-500">{stat.value}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



