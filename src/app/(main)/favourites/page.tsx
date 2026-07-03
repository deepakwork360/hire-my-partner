"use client";

import { useState, useEffect } from "react";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../home-page/sections/Footer";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import { Bookmark, Sparkles, Heart, Compass, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";
import Link from "next/link";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function FavouritesPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadBookmarks = () => {
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
          setBookmarks(JSON.parse(bookmarksStr));
        } else {
          setBookmarks([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadBookmarks();

    window.addEventListener("bookmarks_changed", loadBookmarks);
    window.addEventListener("favourites_changed", loadBookmarks); // Backwards compatibility
    return () => {
      window.removeEventListener("bookmarks_changed", loadBookmarks);
      window.removeEventListener("favourites_changed", loadBookmarks);
    };
  }, []);

  const handleRemoveBookmark = (id: string | number, name: string) => {
    try {
      let bookmarksStr = localStorage.getItem("bookmarked_partners");
      if (!bookmarksStr) {
        bookmarksStr = localStorage.getItem("favourite_partners");
      }
      
      let favList = bookmarksStr ? JSON.parse(bookmarksStr) : [];
      if (Array.isArray(favList)) {
        favList = favList.filter((p: any) => String(p.id) !== String(id));
        localStorage.setItem("bookmarked_partners", JSON.stringify(favList));
        localStorage.setItem("favourite_partners", JSON.stringify(favList)); // Keep both sync'd
        setBookmarks(favList);
        window.dispatchEvent(new Event("bookmarks_changed"));
        window.dispatchEvent(new Event("favourites_changed"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`bg-bg-base min-h-screen relative flex ${outfit.className}`}>
      <SideDashboard />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 1. TOP BANNER */}
        <section className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden flex items-center justify-center pt-[70px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/love1.jpg')", opacity: 0.15 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-base" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-text-main">
              Bookmarks
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
              Your hand-picked list of premium companions for quick booking and direct access.
            </p>
          </div>
        </section>

        {/* 2. MAIN CONTENT GRID */}
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col gap-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border-main/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Bookmark className="text-primary fill-primary" size={20} />
              </div>
              <div>
                <h3 className="text-text-main text-lg font-black uppercase tracking-wider">
                  Bookmarked Companions
                </h3>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="text-primary animate-pulse" />
                  Your curated list of bookmarks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border-main shadow-sm">
              <Bookmark size={14} className="text-primary fill-primary" />
              <span className="text-text-main text-[10px] font-black uppercase tracking-widest">
                {bookmarks.length} Bookmarks
              </span>
            </div>
          </div>

          {/* Grid list */}
          {mounted && (
            <div className="relative">
              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center">
                  <AnimatePresence mode="popLayout">
                    {bookmarks.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            duration: 0.4,
                            delay: (index % 4) * 0.05,
                            ease: [0.21, 1.11, 0.81, 0.99]
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          transition: {
                            duration: 0.15
                          }
                        }}
                        className="w-full flex justify-center"
                      >
                        <div className="relative group/card w-full max-w-[328px] mx-auto">
                          <ProfileCard
                            id={profile.id}
                            image={profile.image}
                            hourlyRate={profile.hourlyRate}
                            name={profile.name}
                            age={profile.age}
                            location={profile.location}
                            bio={profile.bio}
                            rating={profile.rating}
                            confirmation="Verified"
                            buttonText="Book Now"
                            buttonLink={`/partners/${profile.id}#booking-section`}
                            viewLink={`/partners/${profile.id}`}
                            showViewIcon={true}
                          />
                          <button
                            onClick={() => handleRemoveBookmark(profile.id, profile.name)}
                            className="absolute -top-3 -right-3 z-45 w-9 h-9 bg-rose-500 hover:bg-rose-600 text-white border-2 border-bg-base rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 transition-all duration-500 ease-in-out group-hover/card:-translate-y-2 scale-95 hover:scale-105 active:scale-95 cursor-pointer"
                            title="Remove Bookmark"
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-bg-secondary/20 border border-dashed border-border-main rounded-[40px]"
                >
                  <div className="w-20 h-20 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted">
                    <Bookmark size={40} className="text-text-muted/40" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-text-main text-xl font-bold uppercase tracking-widest">
                      No Bookmarks Yet
                    </h4>
                    <p className="text-text-muted text-sm font-medium max-w-sm">
                      You haven't bookmarked any companions yet. Explore profiles to add them here.
                    </p>
                  </div>
                  <Link href="/browse-partners">
                    <button className="h-12 px-8 bg-primary hover:bg-primary/95 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all cursor-pointer">
                      <Compass size={14} />
                      <span>Browse Companions</span>
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          )}

        </div>

        <Footer />
      </div>
    </div>
  );
}
