"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Camera, MapPin, Star, ShieldCheck, Award, Zap, Heart } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/toastStore";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function MainProfile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState("/images/img1.webp");
  const [bannerUrl, setBannerUrl] = useState("/images/love1.jpg");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    try {
      const savedData = localStorage.getItem("partnerApplication");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const fd = parsed.formData || {};
        setProfileData(fd);
        if (fd.photo) setAvatarUrl(fd.photo);
        if (fd.banner) setBannerUrl(fd.banner);
      }
    } catch (e) {
      console.error("Failed to load partner application data", e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("partner_profile_updated", loadData);
    return () => window.removeEventListener("partner_profile_updated", loadData);
  }, []);

  const syncImageToDatabase = (type: "photo" | "banner", url: string) => {
    try {
      const savedData = localStorage.getItem("partnerApplication");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (!parsed.formData) parsed.formData = {};
        parsed.formData[type] = url;
        localStorage.setItem("partnerApplication", JSON.stringify(parsed));
        
        // Find corresponding partner in approved_partners list
        const nameToFind = parsed.formData.fullName;
        if (nameToFind) {
          const approvedStr = localStorage.getItem("approved_partners");
          if (approvedStr) {
            const list = JSON.parse(approvedStr);
            const updatedList = list.map((p: any) => {
              if (p.name === nameToFind) {
                return {
                  ...p,
                  [type === "photo" ? "image" : "banner"]: url
                };
              }
              return p;
            });
            localStorage.setItem("approved_partners", JSON.stringify(updatedList));
          }
        }
        
        // Dispatch events so components refresh in real-time
        window.dispatchEvent(new Event("partnerStatusChange"));
        window.dispatchEvent(new Event("partner_profile_updated"));
        
        toast.success(`${type === "photo" ? "Profile photo" : "Cover banner"} updated successfully!`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update image in database");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      syncImageToDatabase("photo", url);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setBannerUrl(url);
      syncImageToDatabase("banner", url);
    }
  };

  const name = profileData?.fullName || "Kavya Sharma";
  const age = profileData?.age || 22;
  const location = profileData?.city || "Andheri East, Mumbai";
  const bio = profileData?.bio || "A journey of a thousand miles begins with a single step. Traveler, art lover, and a believer in deep conversations.";

  return (
    <div className={`relative pt-22 pb-4 md:pt-26 md:pb-6 px-4 overflow-hidden bg-bg-base ${outfit.className}`}>
      {/* Hidden inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={bannerInputRef} 
        onChange={handleBannerChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Ambiance Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-dark/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-[1250px] w-full mx-auto relative z-10">
        
        {/* Cover Photo Banner (Editable) */}
        <div 
          onClick={handleBannerClick}
          className="w-full h-[200px] sm:h-[280px] md:h-[340px] rounded-[36px] overflow-hidden border border-border-main relative shadow-2xl cursor-pointer group"
          title="Click to update cover banner"
        >
          <Image
            src={bannerUrl}
            alt="Cover banner"
            fill
            className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-102"
            priority
          />
          {/* Cover Photo Hover Upload Hint Overlay */}
          <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-3 z-10">
             <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
               <Camera size={24} className="text-white" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Update Cover Banner</span>
          </div>
        </div>

        {/* Profile Info Header (with overlapping circular avatar) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 px-6 sm:px-12 pb-8 relative z-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Overlapping Circular Avatar */}
            <div className="relative shrink-0 -mt-20 sm:-mt-24">
              <div
                onClick={handleAvatarClick}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-bg-base overflow-hidden shadow-2xl bg-bg-card relative cursor-pointer group/avatar"
                title="Click to update profile photo"
              >
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover/avatar:scale-105"
                />
                {/* Avatar Hover Upload Hint Overlay */}
                <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-xs gap-1.5 z-10">
                   <Camera size={18} className="text-white" />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Update Photo</span>
                </div>
              </div>
              
              {/* Verified Badge Stamp */}
              <div className="absolute -top-1 -left-2 bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-lg border border-bg-base rotate-[-12deg] flex items-center gap-1 z-30">
                <ShieldCheck size={10} />
                <span>Verified</span>
              </div>
            </div>

            {/* Name, Age, Title */}
            <div className="pb-1">
              <h1 className={`${rochester.className} text-4xl sm:text-5xl md:text-6xl text-text-main font-bold leading-tight flex items-baseline justify-center sm:justify-start gap-3`}>
                {name}
                {age && (
                  <span className={`${outfit.className} text-xl font-light text-primary/60`}>
                    {age}
                  </span>
                )}
              </h1>
              
              {/* Location & Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-text-main">5.0</span>
                <span className="text-text-muted text-[10px] font-bold">(Verified Partner)</span>
              </div>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="w-full lg:w-auto flex items-center gap-3 shrink-0 mt-4 lg:mt-0 justify-center">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dashboard Active</span>
            </div>
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Award size={12} className="text-primary" />
              <span>Platinum Elite</span>
            </div>
          </div>
        </div>

        {/* Content Body: Bio & Stats */}
        <div className="mt-4 pt-6 border-t border-border-main/50 px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-wider mb-1">Companion Bio</p>
              <p className="text-text-main text-sm leading-relaxed max-w-2xl font-medium">
                "{bio}"
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-8 md:gap-12 shrink-0">
              {[
                { label: "Sessions", value: "24", icon: Zap, color: "text-blue-400" },
                { label: "Followers", value: "1.2k", icon: Heart, color: "text-rose-400" },
                { label: "Rating", value: "4.9", icon: Star, color: "text-amber-400", isStar: true }
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon size={12} className={`${stat.color} ${stat.isStar ? 'fill-amber-400' : ''}`} />
                    <span className="text-text-muted text-[9px] font-black uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-black text-text-main">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
