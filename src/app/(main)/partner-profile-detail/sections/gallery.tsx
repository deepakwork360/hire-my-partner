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
      className={`py-16 md:py-20 px-4 bg-[#080808] border-b border-white/5 ${outfit.className}`}
    >
      <div className="max-w-[1000px] w-full mx-auto">
        <div className="flex flex-col items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-4xl md:text-5xl text-white mb-3`}
          >
            Photo Portfolio
          </motion.h2>
          <div className="w-16 h-1 rounded-full bg-linear-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(255,51,119,0.5)]"></div>
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
                className={`relative group overflow-hidden bg-white/5 border border-white/5 cursor-pointer shadow-lg rounded-2xl md:rounded-3xl ${spanClasses}`}
              >
                {/* Premium Hover Vignette Inner Rim */}
                <div className="absolute inset-0 z-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] group-hover:shadow-[inset_0_0_0_2px_rgba(255,51,119,0.4)] transition-shadow duration-500 rounded-2xl md:rounded-3xl" />

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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-pink-500 transition-colors duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full h-[80vh] aspect-auto">
                <img
                  src={selectedImage}
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

