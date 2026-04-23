"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { X } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const rawImages = [
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

  const galleryImages = rawImages.slice(0, 9);

  return (
    <section
      className={`py-16 md:py-20 px-4 bg-bg-secondary border-b border-border-main ${outfit.className}`}
    >
      <div className="max-w-[1000px] w-full mx-auto">
        <div className="flex flex-col items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main mb-3`}
          >
            Photo Portfolio
          </motion.h2>
          <div className="w-16 h-1 rounded-full bg-linear-to-r from-primary to-primary-dark shadow-lg shadow-primary/20"></div>
        </div>

        {/* Premium Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[180px]">
          {galleryImages.map((src, idx) => {
            // Make the first image a large featured block (2x2)
            const isFeatured = idx === 0;
            const spanClasses = isFeatured
              ? "col-span-2 row-span-2"
              : "col-span-1 row-span-1";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => setSelectedImage(src)}
                className={`relative group overflow-hidden bg-bg-card border border-border-main cursor-pointer shadow-lg shadow-black/5 rounded-2xl md:rounded-3xl ${spanClasses}`}
              >
                {/* Premium Hover Vignette Inner Rim */}
                <div className="absolute inset-0 z-10 shadow-[inset_0_0_0_1px_rgba(var(--border-main),var(--border-opacity))] group-hover:shadow-[inset_0_0_0_2px_rgba(var(--primary-rgb),0.4)] transition-shadow duration-500 rounded-2xl md:rounded-3xl" />

                {/* Gradient Bottom Fade */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                <Image
                  src={src}
                  alt={`Portfolio Photo ${idx + 1}`}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-110"
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fully Immersive Lightbox Modal - BUG FIX VERSION */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 flex items-center justify-center bg-[#050505] cursor-default"
          >
            {/* Backdrop Click-to-Close */}
            <div 
              className="absolute inset-0 z-0" 
              onClick={() => setSelectedImage(null)} 
            />

            {/* Prominent Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="fixed top-6 right-6 md:top-10 md:right-10 z-2100 w-14 h-14 rounded-full bg-white/10 hover:bg-rose-500/20 border border-white/20 hover:border-rose-500/50 flex items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl"
            >
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full h-full max-w-[95vw] max-h-[calc(100vh-120px)] flex items-center justify-center p-4 md:p-10 pointer-events-none"
            >
              <img
                src={selectedImage}
                alt="Portfolio Full Preview"
                className="max-w-full max-h-full object-contain shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-lg pointer-events-auto"
              />
            </motion.div>
            
            {/* ESC Hint */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-black uppercase tracking-[0.4em] pointer-events-none">
              Click anywhere to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}




