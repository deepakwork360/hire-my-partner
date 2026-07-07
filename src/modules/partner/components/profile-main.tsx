"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { MapPin, Star, Bookmark, ShieldCheck, Map, Heart, X, UserPlus, UserCheck, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/toastStore";
import { Partner } from "../types/partner.types";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const moods = [
  { id: "happy", label: "Happy", emoji: "😄" },
  { id: "romantic", label: "Romantic", emoji: "🥰" },
  { id: "chilled", label: "Chilled", emoji: "😎" },
  { id: "excited", label: "Excited", emoji: "🥳" },
  { id: "angry", label: "Angry", emoji: "😠" },
  { id: "sad", label: "Sad", emoji: "🥺" },
];

interface ProfileMainProps {
  partner?: Partner;
}

export default function ProfileMain({ partner }: ProfileMainProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { appearance } = useTheme();
  const [currentMoodId, setCurrentMoodId] = useState<string>("");
  const [currentMoodText, setCurrentMoodText] = useState<string>("");
  
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
    pricing: {
      oneHour: 499,
      twoHours: 998,
      threeHours: 1497,
      fourHours: 1996,
      fiveHours: 2495,
      eightHours: 3992,
    }
  };

  const profileData = partner || defaultProfile;
  const reviewsCount = Array.isArray(profileData.reviews) ? profileData.reviews.length : 0;
  const rawRating = typeof profileData.rating === "number"
    ? profileData.rating
    : parseFloat(profileData.rating || "0");
  const ratingScore = rawRating === 0 ? "0.0" : rawRating.toFixed(1);

  // Followers & Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(() => {
    // Generate deterministic followers based on partner id/name
    const base = (profileData.name.length * 83) % 900 + 350;
    return base;
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowers((prev) => prev - 1);
      toast.success(`Unfollowed ${profileData.name}`);
    } else {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
      toast.success(`Followed ${profileData.name}!`);
    }
  };

  // Bookmarks State
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        let bookmarksStr = localStorage.getItem("bookmarked_partners");
        
        // Graceful migration
        if (!bookmarksStr) {
          const oldFavs = localStorage.getItem("favourite_partners");
          if (oldFavs) {
            localStorage.setItem("bookmarked_partners", oldFavs);
            bookmarksStr = oldFavs;
          }
        }

        if (bookmarksStr) {
          const favList = JSON.parse(bookmarksStr);
          if (Array.isArray(favList)) {
            setIsBookmarked(favList.some((p: any) => String(p.id) === String(profileData.id)));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [profileData.id]);

  const handleBookmarkToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    
    if (typeof window !== "undefined") {
      try {
        let bookmarksStr = localStorage.getItem("bookmarked_partners");
        
        // Migration fallback
        if (!bookmarksStr) {
          bookmarksStr = localStorage.getItem("favourite_partners") || "[]";
        }
        
        let favList = bookmarksStr ? JSON.parse(bookmarksStr) : [];
        if (!Array.isArray(favList)) favList = [];
        
        if (nextState) {
          const oneHourRate = profileData.pricing?.oneHour || 499;
          const companion = {
            id: profileData.id,
            name: profileData.name,
            age: profileData.age,
            image: profileData.image,
            location: profileData.location,
            rating: profileData.rating,
            verified: profileData.verified,
            distance: profileData.distance,
            hourlyRate: `₹${oneHourRate}/hr`,
            bio: profileData.bio || ""
          };
          favList.push(companion);
        } else {
          favList = favList.filter((p: any) => String(p.id) !== String(profileData.id));
        }
        
        localStorage.setItem("bookmarked_partners", JSON.stringify(favList));
        // Keep both keys in sync during the action
        localStorage.setItem("favourite_partners", JSON.stringify(favList));

        window.dispatchEvent(new Event("bookmarks_changed"));
        window.dispatchEvent(new Event("favourites_changed"));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const loadPartnerMood = () => {
      if (typeof window !== "undefined") {
        try {
          let savedStr = localStorage.getItem("partner_moods");
          if (!savedStr) {
            const defaultMoods = {
              "1": "romantic",
              "Gigi Hadid": "romantic",
              "2": "chilled",
              "Sabrina Carpenter": "chilled",
              "3": "serious",
              "Kristen Stewart": "serious",
              "4": "adventurous",
              "Can Yaman": "adventurous"
            };
            localStorage.setItem("partner_moods", JSON.stringify(defaultMoods));
            savedStr = JSON.stringify(defaultMoods);
          }
          const savedMoods = JSON.parse(savedStr);
          const mood = savedMoods[profileData.id] || savedMoods[profileData.name];
          if (mood && mood !== "all") {
            setCurrentMoodId(mood);
          } else {
            setCurrentMoodId("");
          }

          // Load text status too
          const savedTextsStr = localStorage.getItem("partner_mood_texts");
          if (savedTextsStr) {
            const savedTexts = JSON.parse(savedTextsStr);
            const text = savedTexts[profileData.id] || savedTexts[profileData.name] || "";
            setCurrentMoodText(text);
          } else {
            setCurrentMoodText("");
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadPartnerMood();
    window.addEventListener("user_mood_changed", loadPartnerMood);
    return () => {
      window.removeEventListener("user_mood_changed", loadPartnerMood);
    };
  }, [profileData.id, profileData.name]);

  const currentMoodInfo = moods.find(m => m.id === currentMoodId);

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
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 px-6 sm:px-12 pb-8 relative z-20 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left w-full sm:w-auto">
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
            <div className="pb-1 w-full sm:w-auto">
              <h1 className={`${rochester.className} text-4xl sm:text-5xl md:text-6xl text-text-main font-bold leading-tight flex items-baseline justify-center sm:justify-start gap-3`}>
                {profileData.name}
                {profileData.age && (
                  <span className={`${outfit.className} text-xl font-light text-primary/60`}>
                    {profileData.age}
                  </span>
                )}
              </h1>
              
              {/* Stars & Reviews */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1.5 mt-2">
                <div className="flex items-center gap-2 shrink-0">
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
                <span className="hidden sm:inline text-text-muted/45 font-light">|</span>
                <span className="text-text-main text-[10px] font-bold uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 flex items-center gap-1.5 shadow-sm shrink-0">
                  <Users size={12} className="text-primary shrink-0" />
                  {followers.toLocaleString()} Followers
                </span>
                {currentMoodInfo && (
                  <>
                    <span className="hidden sm:inline text-text-muted/45 font-light">|</span>
                    <span className="text-text-main text-[10px] font-black uppercase tracking-widest bg-linear-to-br from-primary/10 to-accent/10 px-3 py-0.5 rounded-lg border border-primary/30 flex items-center gap-1 shadow-sm shrink-0">
                      <span className="text-xs shrink-0 leading-none">{currentMoodInfo.emoji}</span>
                      <span>
                        Mood: {currentMoodInfo.label}
                        {currentMoodText && (
                          <span className="normal-case italic text-text-muted ml-1 font-semibold">
                            &nbsp;- "{currentMoodText}"
                          </span>
                        )}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 mt-4 lg:mt-0">
            <a
              href="#booking-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 sm:flex-none sm:px-6 h-12 bg-primary hover:bg-primary/95 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 active:scale-95 transition-all cursor-pointer text-center"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Book Now</span>
            </a>

            <button
              onClick={handleFollowToggle}
              className={`flex-1 sm:flex-none sm:px-6 h-12 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 border transition-all cursor-pointer text-center ${
                isFollowing
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
  : "bg-zinc-900/70 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-primary/40 transition-all duration-200"
              }`}
            >
              {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </button>
            
            <button 
              onClick={handleBookmarkToggle}
              className="cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center p-0 bg-transparent border-none outline-none"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
            >
              <img 
                src={isBookmarked ? "/icons/bookmark4.png" : "/icons/bookmark3.png"} 
                alt="Bookmark" 
                className={`w-12 h-12 object-contain transition-all duration-300 ${
                  isBookmarked ? "scale-115 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : "opacity-90 hover:opacity-100"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content Body: Stats Row */}
        <div className="mt-8 pt-8 border-t border-border-main/50 px-6 sm:px-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Image src="/icons/pin.png" alt="location" width={35} height={35} className="object-contain" />
              </div>
              <div>
                <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Location</p>
                <p className="text-text-main text-xs font-bold tracking-tight">{profileData.location}</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Image src="/icons/star1.png" alt="rating" width={35} height={35} className="object-contain" />
              </div>
              <div>
                <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">Rating Score</p>
                <p className="text-text-main text-xs font-bold tracking-tight">{ratingScore} ({reviewsCount} Reviews)</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-4 bg-bg-secondary border border-border-main rounded-[20px] hover:bg-bg-card transition-all shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Image src="/icons/location.png" alt="distance" width={35} height={35} className="object-contain" />
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
