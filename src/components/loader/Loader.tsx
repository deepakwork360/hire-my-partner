"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Insignia Ring */}
        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-full"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full fill-pink-500/80 font-bold uppercase tracking-[0.3em] text-[12px]">
              <path
                id="loaderPath"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill="none"
              />
              <text>
                <textPath href="#loaderPath" spacing="auto" className={outfit.className}>
                  HIRE MY PARTNER • HIRE MY PARTNER • 
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Central Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.95, 1.05, 0.95],
              opacity: 1,
              boxShadow: [
                "0 0 20px rgba(244, 63, 94, 0.2)",
                "0 0 40px rgba(244, 63, 94, 0.4)",
                "0 0 20px rgba(244, 63, 94, 0.2)"
              ]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.8 },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-28 h-28 md:w-36 md:h-36 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 p-5 flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/Logo.webp"
                alt="Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-pink-500/5 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <span className={`${outfit.className} text-white/40 text-[10px] uppercase tracking-[0.5em]`}>
            Initializing Experience
          </span>
          <div className="w-32 h-px bg-white/5 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-pink-500/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/5" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/5" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/5" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/5" />
    </div>
  );
}
