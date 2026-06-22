"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Link from "next/link";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

import { Partner } from "../types/partner.types";

interface GalleryProps {
  images?: string[] | { id: string; image: string }[] | any[];
  partner?: Partner;
}

export default function Gallery({ images, partner }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultImages = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop",
  ];

  const allImages = useMemo(() => {
    return (images && images.length > 0 
      ? images.map((img) => typeof img === "string" ? img : (img && img.image ? img.image : ""))
      : defaultImages
    ).filter(Boolean);
  }, [images]);

  const galleryImages = useMemo(() => allImages.slice(0, 9), [allImages]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex > 0) {
      setActiveIndex((prevIdx) => prevIdx - 1);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex < galleryImages.length - 1) {
      setActiveIndex((prevIdx) => prevIdx + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX;
    const swipeThreshold = 40;
    if (swipeDistance > swipeThreshold) {
      handleNext();
    } else if (swipeDistance < -swipeThreshold) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const idx = galleryImages.indexOf(selectedImage);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, activeIndex]);

  // Split bio by newlines and handle fallbacks
  const bio = partner?.bio || "I love deep conversations, spontaneous laughs, and making every moment feel special. Whether you need someone for a formal event or just a relaxing dinner, I'm here to help you feel comfortable and confident.\n\nI'm easy to talk to, a great listener, and I genuinely enjoy getting to know new people.\n\nLet's make the time we share together meaningful, respectful, and memorable.";
  const paragraphs = bio.split("\n").filter(Boolean);

  const isMockPartner = partner?.id ? !isNaN(Number(partner.id)) : false;

  const tags = partner?.tags && partner.tags.length > 0 
    ? partner.tags 
    : (isMockPartner ? ["#Friendly", "#Empathetic", "#NonJudgmental"] : ["NA"]);

  const interests = partner?.interests 
    ? partner.interests 
    : (isMockPartner ? "Travel, Music, Coffee dates, Bollywood, Nature walks" : "NA");

  const languages = partner?.languages 
    ? partner.languages 
    : (isMockPartner ? "English, Hindi" : "NA");

  return (
    <section
      className={`py-10 md:py-12 px-4 bg-bg-secondary border-b border-border-main ${outfit.className}`}
    >
      <div className="max-w-[1250px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Card: About Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-bg-card backdrop-blur-3xl border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col justify-between shadow-xl overflow-hidden"
          >
            {/* Elegant Background Watermark Quote */}
            <div className="absolute top-4 right-8 text-primary/5 select-none pointer-events-none">
              <span className="font-serif text-[180px] leading-none">“</span>
            </div>

            <div className="relative z-10 flex flex-col h-full grow">
              <h3 className={`${rochester.className} text-4xl md:text-5xl text-text-main mb-4`}>
                About Me
              </h3>
              
              {/* Vertically centered bio container to handle short bios beautifully */}
              <div className="flex-1 flex flex-col justify-center py-8 min-h-[160px] md:min-h-[200px]">
                <div className="space-y-4 text-text-muted text-[15px] md:text-base leading-relaxed font-medium">
                  {paragraphs.map((p, index) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Metadata Block */}
            <div className="relative z-10 bg-bg-base/40 border border-border-main/50 rounded-2xl p-5 flex items-stretch gap-4 mt-auto">
              {/* Vertical accent colored bar */}
              <div className="w-1.5 rounded-full bg-rose-500 shrink-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-xs md:text-sm font-medium">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="font-bold text-rose-500 block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full text-xs font-semibold select-none"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-rose-500 block mb-2">Interests:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(interests === "NA" ? ["NA"] : interests.split(",").map(i => i.trim()).filter(Boolean)).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-semibold select-none"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 md:border-l md:border-border-main/40 md:pl-6 flex flex-col justify-start">
                  <div>
                    <span className="font-bold text-text-main block mb-2">Languages:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(languages === "NA" ? ["NA"] : languages.split(",").map(l => l.trim()).filter(Boolean)).map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-text-muted rounded-full text-xs font-semibold select-none"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Card: Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-bg-card backdrop-blur-3xl border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className={`${rochester.className} text-4xl md:text-5xl text-center text-text-main mb-6`}>
                Gallery
              </h3>
              
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {galleryImages.map((src, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-square group overflow-hidden bg-bg-base border border-border-main cursor-pointer shadow-md rounded-2xl md:rounded-3xl"
                  >
                    {/* Premium Hover Vignette Inner Rim */}
                    <div className="absolute inset-0 z-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] group-hover:shadow-[inset_0_0_0_2px_rgba(var(--primary-rgb),0.4)] transition-shadow duration-500 rounded-2xl md:rounded-3xl" />
                    
                    {/* Gradient Bottom Fade */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    <Image
                      src={src}
                      alt={`Portfolio Photo ${idx + 1}`}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover object-top transition-all duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 15vw"
                    />
                  </motion.div>
                ))}
              </div>

              {allImages.length > 9 && partner?.id && (
                <div className="mt-6 flex justify-center">
                  <Link href={`/partners/${partner.id}/gallery`} className="w-full">
                    <button className="w-full py-3.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2">
                      <Images size={14} />
                      View All Gallery ({allImages.length} Photos)
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Fully Immersive Lightbox Modal - BUG FIX VERSION */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#050505] cursor-default"
          >
            {/* Backdrop Click-to-Close */}
            <div 
              className="absolute inset-0 z-0" 
              onClick={() => setSelectedImage(null)} 
            />

            {/* Prominent Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="fixed top-6 right-6 md:top-10 md:right-10 z-[2100] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-rose-500/20 border border-white/20 hover:border-rose-500/50 flex items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer"
            >
              <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Left Control Button (hidden on mobile, shown on desktop) */}
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[2100] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Right Control Button (hidden on mobile, shown on desktop) */}
            <button
              onClick={handleNext}
              disabled={activeIndex === galleryImages.length - 1}
              className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[2100] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Image Container with swipe events */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative z-10 w-full h-full max-w-[90vw] md:max-w-[70vw] max-h-[calc(100vh-160px)] flex items-center justify-center p-4 md:p-12 pointer-events-auto cursor-default"
            >
              <img
                src={galleryImages[activeIndex]}
                alt={`Portfolio Full Preview ${activeIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain shadow-[0_50px_100px_rgba(0,0,0,0.85)] rounded-3xl border border-white/10 select-none pointer-events-none"
              />
            </div>
         </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}




