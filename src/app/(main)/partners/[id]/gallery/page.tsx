"use client";

import { use, useState, useEffect, useRef, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { usePartner } from "@/modules/partner/hooks/usePartner";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";
import Footer from "@/app/(main)/home-page/sections/Footer";
import PartnerDetailSkeleton from "@/components/loader/PartnerDetailSkeleton";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerGalleryPage({ params }: PageProps) {
  const { id } = use(params);
  const { partner, loading, error } = usePartner(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);

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
    return (partner?.gallery && partner.gallery.length > 0 
      ? partner.gallery.map((img: any) => typeof img === "string" ? img : (img && img.image ? img.image : ""))
      : defaultImages
    ).filter(Boolean);
  }, [partner?.gallery]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex > 0) {
      setActiveIndex((prevIdx) => prevIdx - 1);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex < allImages.length - 1) {
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
      const idx = allImages.indexOf(selectedImage);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [selectedImage, allImages]);

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
  }, [selectedImage, activeIndex, allImages]);

  if (loading) {
    return <PartnerDetailSkeleton />;
  }

  if (error || !partner) {
    notFound();
  }

  return (
    <div className={`flex flex-col gap-0 relative min-h-screen bg-bg-base overflow-hidden ${outfit.className}`}>
      <PageHeaderAccent />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 py-20 px-4 md:px-8 max-w-[1250px] w-full mx-auto">
        {/* Top Header Controls */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 mt-8 md:mt-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href={`/partners/${partner.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-text-muted hover:text-text-main text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md"
            >
              <ArrowLeft size={12} className="text-primary" />
              Back to Profile
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${rochester.className} text-5xl md:text-7xl text-text-main mt-6 mb-3`}
          >
          <span className="text-primary">{partner.name}&apos;s </span> Gallery
          </motion.h1>

        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allImages.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 1) }}
              onClick={() => setSelectedImage(src)}
              className="relative aspect-[3/4] group overflow-hidden bg-bg-card border border-border-main hover:border-primary/40 cursor-pointer shadow-xl rounded-2xl md:rounded-3xl transition-all duration-300"
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={idx < 8}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Lightbox Modal */}
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

            {/* Left Control Button */}
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[2100] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Right Control Button */}
            <button
              onClick={handleNext}
              disabled={activeIndex === allImages.length - 1}
              className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[2100] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Image Container with swipe events */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative z-10 w-full h-full max-w-[90vw] md:max-w-[75vw] max-h-[calc(100vh-160px)] flex items-center justify-center p-4 md:p-12 pointer-events-auto cursor-default animate-fade-in"
            >
              <img
                src={allImages[activeIndex]}
                alt={`Portfolio Full Preview ${activeIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain shadow-[0_50px_100px_rgba(0,0,0,0.85)] rounded-3xl border border-white/10 select-none pointer-events-none"
              />
              
              {/* Pagination Info */}
              <div className="absolute bottom-2 md:bottom-6 text-text-muted text-xs font-semibold tracking-widest bg-black/60 px-4 py-2 rounded-full border border-white/5">
                {activeIndex + 1} / {allImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
